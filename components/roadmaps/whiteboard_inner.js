"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  addEdge,
  useReactFlow,
} from "reactflow";
import { nodeTypes } from "./nodes";
import { supabase } from "@/lib/supabaseClient";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";


const uid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;



function TrashIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 16h10l1-16" />
      <path d="M10 11v7" />
      <path d="M14 11v7" />
    </svg>
  );
}

export default function WhiteboardInner({
  title,
  subtitle,
  initialNodes,
  initialEdges,
  backMode = "history",
  storageKey,
}) {
  const router = useRouter();
  const trashRef = useRef(null);
  const [dirty, setDirty] = useState(false);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [activeNode, setActiveNode] = useState(null);
  const [toast, setToast] = useState(null);

  const [dragState, setDragState] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [hoveredGroup, setHoveredGroup] = useState(null);

  const [isEditable, setIsEditable] = useState(false); // édition uniquement local
  const [cloudReady, setCloudReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [skipDeleteConfirm, setSkipDeleteConfirm] = useState(false);

  const { getIntersectingNodes } = useReactFlow();
  const confirmKey = storageKey ? `${storageKey}:skipDeleteConfirm` : "roadmap:skipDeleteConfirm";
  const roadmapKey = storageKey?.replace("roadmap:", "") || null;

  const [isSaving, setIsSaving] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const canSave = isEditable && cloudReady && !!userId && !isSaving;



  // ✅ client-only effects
  useEffect(() => {
    setIsEditable(process.env.NODE_ENV === "development");
  }, []);
  

  useEffect(() => {
    let cancelled = false;
  
    async function initAuth() {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
  
      setUserId(data?.session?.user?.id || null);
      setAuthReady(true);
    }
  
    initAuth();
  
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });
  
    return () => {
      cancelled = true;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);
  
  
  

  // Supabase / cloud load
  useEffect(() => {
    let cancelled = false;

    async function boot() {
        if (!roadmapKey) {
          setCloudReady(true);
          return;
        }
      
        if (!isEditable) {
          setCloudReady(true);
          return;
        }
      
        const { data: userData } = await supabase.auth.getUser();
        if (cancelled) return;
      
        const uid = userData?.user?.id || null;
        setUserId(uid);
      
        if (!uid) {
          setCloudReady(true); // boot fini, mais pas connecté
          return;
        }
      
        const { data, error } = await supabase
          .from("roadmaps")
          .select("data,title,subtitle")
          .eq("user_id", uid)
          .eq("key", roadmapKey)
          .maybeSingle();
      
        if (cancelled) return;
      
        if (!error && data?.data) {
          if (Array.isArray(data.data.nodes)) setNodes(data.data.nodes);
          if (Array.isArray(data.data.edges)) setEdges(data.data.edges);
        }
      
        setCloudReady(true);
      }
      

    boot();
    return () => { cancelled = true; };
  }, [isEditable, roadmapKey, setNodes, setEdges]);

  // Toast helper
  const showToast = useCallback((message) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToast({ id, message });
    window.setTimeout(() => setToast(t => t?.id === id ? null : t), 3000);
  }, []);

  const setSkipPersisted = useCallback((v) => {
    setSkipDeleteConfirm(v);
    try { localStorage.setItem(confirmKey, v ? "1" : "0"); } catch {}
  }, [confirmKey]);

  const isPointInTrash = useCallback((x, y) => {
    const el = trashRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }, []);

  const removeNodeAndEdgesDeep = useCallback((nodeId) => {
    setNodes(nds => {
      const toDelete = new Set([nodeId]);
      let changed = true;
      while (changed) {
        changed = false;
        for (const n of nds) {
          if (n.parentNode && toDelete.has(n.parentNode) && !toDelete.has(n.id)) {
            toDelete.add(n.id);
            changed = true;
          }
        }
      }
      setEdges(eds => eds.filter(e => !toDelete.has(e.source) && !toDelete.has(e.target)));
      return nds.filter(n => !toDelete.has(n.id));
    });
    setDirty(true);
  }, [setNodes, setEdges]);

  const restoreNodeSnapshot = useCallback((nodeId, snap) => {
    setNodes(nds => nds.map(n =>
      n.id === nodeId ? { ...n, position: snap.position, parentNode: snap.parentNode, extent: snap.extent } : n
    ));
  }, [setNodes]);

  const signInGoogle = useCallback(async () => {
    setAuthLoading(true);
  
    // où revenir après connexion (ta page actuelle)
    const returnTo = `${window.location.pathname}${window.location.search}`;
    localStorage.setItem("auth:returnTo", returnTo);
  
    const redirectTo = `${window.location.origin}/auth/callback`;
  
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
  
    if (error) {
      console.error(error);
      showToast("Erreur connexion Google");
      setAuthLoading(false);
    }

    const { data } = await supabase.auth.getSession();
    console.log("SESSION?", data.session?.user?.id);


  }, [showToast]);
    
  

  const onConnect = useCallback((params) => {
    if (!isEditable) return;
    setEdges(eds => addEdge({ ...params, animated: true, style: { opacity: 0.7 } }, eds));
  }, [isEditable, setEdges]);

  const updateNodeData = useCallback((id, patch) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...patch } } : n));
    setDirty(true);
  }, [setNodes]);

  const addCard = useCallback(() => {
    const id = uid();
    setNodes(nds => [
      ...nds,
      { id, type: "card", position: { x: 300, y: 240 }, data: { title: "Nouvelle carte", note: "à remplir", items: ["..."] } }
    ]);
    setDirty(true);
    showToast("Carte ajoutée");
  }, [setNodes, showToast]);

  const addGroup = useCallback(() => {
    const id = uid();
    setNodes(nds => [
      ...nds,
      { id, type: "group", position: { x: 160, y: 180 }, style: { width: 560, height: 420 }, data: { title: "Nouveau bloc", subtitle: "Sous-titre", tag: "" } }
    ]);
    setDirty(true);
    showToast("Bloc ajouté");
  }, [setNodes, showToast]);

  const saveCloud = useCallback(async () => {
    if (!isEditable) {
      showToast("Lecture seule");
      return;
    }
    if (!cloudReady) {
      showToast("Chargement…");
      return;
    }
    if (!userId || !roadmapKey) {
      showToast("Connecte-toi pour sauvegarder");
      return;
    }
  
    setIsSaving(true);
  
    try {
      const payload = {
        user_id: userId,
        key: roadmapKey,
        title,
        subtitle,
        data: {
          nodes: nodes.map(n => ({
            id: n.id,
            type: n.type,
            position: n.position,
            parentNode: n.parentNode || null,
            extent: n.extent || null,
            style: n.style || {},
            data: n.data || {},
          })),
          edges: edges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            type: e.type || null,
            animated: !!e.animated,
            style: e.style || {},
            label: e.label || null,
          })),
        },
      };
  
      const { error } = await supabase
        .from("roadmaps")
        .upsert(payload, { onConflict: "user_id,key" });
  
      if (error) throw error;
      console.log("Saved to cloud");
      setDirty(false);
      showToast("✅ Sauvegardé");
    } catch (err) {
      console.error(err);
      showToast("❌ Erreur sauvegarde");
    } finally {
      setIsSaving(false);
    }
  }, [isEditable, cloudReady, userId, roadmapKey, title, subtitle, nodes, edges, showToast]);
    


  const renderNodes = useMemo(() => 
    nodes.map(n => {
      const isHoveredGroup = n.type === "group" && n.id === hoveredGroup;
  
      return {
        ...n,
        style: {
          ...(n.style || {}),
          zIndex: n.type === "group" ? 0 : 20,
  
          ...(isHoveredGroup && {
            borderColor: "rgba(34,197,94,0.8)", // vert
            boxShadow: "0 0 0 2px rgba(34,197,94,0.25)",
            backgroundColor: "rgba(34,197,94,0.08)",
          }),
        },
        data: {
          ...n.data,
          showDropHint: isHoveredGroup,
          editable: isEditable,
          onUpdate: updateNodeData,
          isDropTarget: isHoveredGroup, // optionnel
        },
      };
    }),
  [nodes, hoveredGroup, isEditable, updateNodeData]);
  

  const handleBack = useCallback(() => { router.push("/roadmaps"); }, [router]);

  const onNodeDragStart = useCallback((_, node) => {
    if (!isEditable) return;
    setDragState({ id: node.id, snapshot: { position: { ...node.position }, parentNode: node.parentNode, extent: node.extent }, overTrash: false });
    setDirty(true); // 👈 ICI (une fois le drag terminé)
  }, [isEditable]);

  const onNodeDrag = useCallback((event, node) => {
    if (!isEditable) return;
    if (dragState?.id === node.id) setDragState(s => s ? { ...s, overTrash: isPointInTrash(event.clientX, event.clientY) } : s);
    if (node.type === "card") setHoveredGroup(getIntersectingNodes(node).find(n => n.type === "group")?.id || null);
  }, [isEditable, dragState?.id, getIntersectingNodes, isPointInTrash]);

  const onNodeDragStop = useCallback((event, node) => {
    if (!isEditable) return;

    const droppedInTrash = isPointInTrash(event.clientX, event.clientY);
    if (droppedInTrash) {
      if (skipDeleteConfirm) removeNodeAndEdgesDeep(node.id), showToast("Élément supprimé");
      else setConfirmDelete({ id: node.id, startPos: { ...node.position } });
      setHoveredGroup(null);
      setDragState(null);
      return;
    }

    if (node.type === "card") {
      const group = getIntersectingNodes(node).find(n => n.type === "group");
      if (group) {
        const nAbs = node.positionAbsolute || node.position;
        const gAbs = group.positionAbsolute || group.position;
        const nextPos = { x: nAbs.x - gAbs.x, y: nAbs.y - gAbs.y };
        setNodes(nds => nds.map(n => n.id === node.id ? { ...n, parentNode: group.id, extent: "parent", position: nextPos } : n));
        showToast("Carte intégrée au bloc");
      }
    }

    setHoveredGroup(null);
    setDragState(null);
  }, [isEditable, getIntersectingNodes, removeNodeAndEdgesDeep, skipDeleteConfirm, showToast]);

  

  return (
    <div className="relative w-screen h-screen overflow-hidden">

      {/* Toast */}
      {toast && (
        <div className="absolute top-6 right-6 z-30">
          <div className="min-w-[260px] max-w-[360px] rounded-2xl border border-[var(--text3)]/25 bg-black/45 backdrop-blur-2xl shadow-xl overflow-hidden">
            <div className="px-4 py-3 text-sm text-[var(--text1)]">{toast.message}</div>
            <div className="h-[3px] w-full bg-[var(--text3)]/15">
              <div key={toast.id} className="h-full bg-[var(--green2)] origin-left animate-[toastbar_3s_linear_forwards]" />
            </div>
          </div>
        </div>
      )}

      {/* HUD */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
        <button onClick={handleBack} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--text3)]/25 bg-black/30 backdrop-blur-2xl text-[var(--text1)] hover:border-[var(--green2)]/50 hover:text-[var(--green2)] transition">
          ← Retour
        </button>

        <div className="rounded-3xl border border-[var(--text3)]/25 bg-black/25 backdrop-blur-2xl px-5 py-4 max-w-[560px]">
          <div className="text-[var(--text1)] text-xl font-extrabold">{title}</div>
          <div className="text-[var(--text2)] text-sm mt-1">{subtitle}</div>
          <div className="text-[var(--text3)] text-xs mt-2">{isEditable ? "Mode édition" : "Mode lecture"} • Pan/zoom OK</div>
        </div>


        {isEditable && (
          <>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={addCard}
              disabled={!isEditable}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--text3)]/25 bg-black/30 backdrop-blur-2xl text-[var(--text1)] ${
                isEditable
                  ? "hover:border-[var(--green2)]/50 hover:text-[var(--green2)] transition"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              + Carte
            </button>
        
            <button 
              onClick={addGroup}
              disabled={!isEditable} 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--text3)]/25 bg-black/30 backdrop-blur-2xl text-[var(--text1)] ${
                isEditable
                  ? "hover:border-[var(--green2)]/50 hover:text-[var(--green2)] transition"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              + Bloc
            </button>
        
            <button
              onClick={saveCloud}
              disabled={!canSave}
              className={`px-4 py-2 rounded-full text-black ${
                canSave
                  ? "bg-[var(--green2)] hover:brightness-110 transition"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              {isSaving ? "Sauvegarde..." : "Sauver"}
            </button>
          </div>
        
          {/* STATUS */}
          <div className="flex justify-center mt-2">
            <div
              className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full border backdrop-blur-2xl w-full text-center justify-center
                ${
                  dirty
                    ? "text-amber-400 border-amber-400/30 bg-amber-400/10"
                    : "text-[var(--green2)] border-[var(--green2)]/30 bg-[var(--green2)]/10"
                }
              `}
            >
              {dirty ? (
                <>
                  <span className="text-sm">⚠️</span>
                  <span>Modifications non sauvegardées</span>
                  <span className="text-sm">⚠️</span>
                </>
              ) : (
                <>
                  <span className="text-sm">✅</span>
                  <span>Tout est sauvegardé</span>
                  <span className="text-sm">✅</span>
                </>
              )}
            </div>
          </div>
        </>        
        )}
        </div>

        <div className="absolute top-6 right-6 z-30">

        {isEditable && authReady && !userId && (
        <div className="rounded-3xl border border-[var(--text3)]/25 bg-black/25 backdrop-blur-2xl px-5 py-4 max-w-[560px]">
            <div className="text-[var(--text1)] font-semibold">Connexion requise</div>
            <div className="text-[var(--text2)] text-sm mt-1">
            Connecte-toi pour activer la sauvegarde Supabase.
            </div>

            <div className="flex gap-2 mt-3">
            <button
                onClick={signInGoogle}
                disabled={authLoading}
                className="px-4 py-2 rounded-full border border-[var(--text3)]/25 bg-black/30 text-[var(--text1)] hover:border-[var(--green2)]/50"
            >
                {authLoading ? "..." : "Se connecter (Google)"}
            </button>
            </div>
        </div>
        )}

      </div>

      {isSaving && (
        <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
            <div className="text-white text-sm">Sauvegarde en cours…</div>
            </div>
        </div>
        )}



      {/* TRASH */}
      {isEditable && dragState && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 cursor-default">
          <div ref={trashRef} className={`w-[360px] h-[72px] rounded-3xl border backdrop-blur-2xl flex items-center justify-center gap-3 transition ${dragState.overTrash ? "border-red-400/50 bg-red-500/15 shadow-[0_0_0_1px_rgba(248,113,113,0.15)]" : "border-[var(--text3)]/25 bg-black/35"}`}>
            <TrashIcon className={`w-5 h-5 ${dragState.overTrash ? "text-red-200" : "text-[var(--text2)]"}`} />
            <div className="text-sm text-[var(--text1)] font-medium cursor-default">Glisse ici pour supprimer</div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="absolute inset-0">
        <ReactFlow
          nodes={renderNodes}
          edges={edges}
          onNodesChange={isEditable ? onNodesChange : undefined}
          onEdgesChange={isEditable ? onEdgesChange : undefined}
          onConnect={isEditable ? onConnect : undefined}
          nodesDraggable={isEditable && !isSaving}
          nodesConnectable={isEditable && !isSaving}
          elementsSelectable={isEditable && !isSaving}
          onNodeDragStart={isEditable ? onNodeDragStart : undefined}
          onNodeDrag={isEditable ? onNodeDrag : undefined}
          onNodeDragStop={isEditable ? onNodeDragStop : undefined}
          nodeTypes={nodeTypes}
        >
          <MiniMap pannable zoomable />
          <Controls />
          <Background gap={24} size={1} />
        </ReactFlow>
      </div>

      {/* Active node panel */}
      {activeNode && (
        <div className="absolute bottom-6 left-6 z-20 max-w-[420px]">
          <div className="rounded-3xl border border-[var(--text3)]/25 bg-black/35 backdrop-blur-2xl px-5 py-4">
            <div className="text-[var(--text1)] font-semibold">{activeNode.data.title || "Détail"}</div>
            <div className="text-[var(--text2)] text-sm mt-1">{activeNode.data.note || activeNode.data.text || "—"}</div>
            <button onClick={() => setActiveNode(null)} className="mt-3 text-xs text-[var(--text2)] hover:text-[var(--text1)] underline">fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
