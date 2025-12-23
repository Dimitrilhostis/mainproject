"use client";

import { useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import { NodeResizer } from "@reactflow/node-resizer";

/* GROUP */
export function GroupNode({ data, selected }) {
    const [editing, setEditing] = useState(false);
  
    const [title, setTitle] = useState(data.title || "");
    const [subtitle, setSubtitle] = useState(data.subtitle || "");
    const [tag, setTag] = useState(data.tag || "");
  
    const editRef = useRef(null);
  
    useEffect(() => {
      setTitle(data.title || "");
      setSubtitle(data.subtitle || "");
      setTag(data.tag || "");
    }, [data.title, data.subtitle, data.tag]);
  
    const startEdit = (e) => {
      e.stopPropagation();
      if (!data.editable) return;
      setEditing(true);
    };
  
    const cancel = () => {
      setEditing(false);
      setTitle(data.title || "");
      setSubtitle(data.subtitle || "");
      setTag(data.tag || "");
    };
  
    const commit = () => {
      setEditing(false);
      data.onUpdate?.(data.__id, { title, subtitle, tag });
    };
  
    const keyHandler = (e) => {
      if (e.key === "Escape") cancel();
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) commit();
    };
  
    // ✅ commit uniquement quand on sort DU BLOC d’édition
    const onEditorBlur = (e) => {
      const next = e.relatedTarget;
      if (next && editRef.current && editRef.current.contains(next)) return;
      commit();
    };
  
    return (
      <div className="w-full h-full relative pointer-events-auto">
        {data.editable ? (
          <NodeResizer
            isVisible={selected}
            minWidth={420}
            minHeight={260}
            maxWidth={1600}
            maxHeight={1200}
            handleClassName="!bg-[var(--green2)] !border-none"
            lineClassName="!border-[var(--green2)]"
          />
        ) : null}
  
        <div
          className={`absolute inset-0 rounded-3xl border transition
            ${
              data.isHovered
                ? "border-[var(--green2)] shadow-[0_0_0_2px_rgba(34,197,94,0.25)]"
                : "border-[var(--text3)]/25"
            }`}
        >
          {/* HEADER */}
          <div
            onClick={startEdit}
            className="px-4 pt-4 pb-3 bg-black/25 backdrop-blur-md"
          >
            {editing ? (
              <div
                ref={editRef}
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={keyHandler}
                onBlur={onEditorBlur}
                className="outline-none"
              >
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Titre du bloc"
                    className="flex-1 bg-transparent text-[var(--text1)] font-bold outline-none"
                  />
  
                  <input
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Label"
                    className="w-[120px] bg-transparent text-xs border border-[var(--text3)]/25 rounded-full px-2 py-1 outline-none"
                  />
                </div>
  
                <input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Sous-titre"
                  className="mt-2 w-full bg-transparent text-xs text-[var(--text2)] outline-none"
                />
  
                <div className="mt-2 text-[10px] text-[var(--text3)]">
                  Ctrl/Cmd+Enter = valider • Esc = annuler • clique dehors = valider
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center gap-3">
                  <div className="font-bold text-[var(--text1)]">
                    {data.title || "Bloc"}
                  </div>
  
                  {data.tag ? (
                    <div className="text-xs px-2 py-1 rounded-full border border-[var(--text3)]/25 text-[var(--text2)]">
                      {data.tag}
                    </div>
                  ) : null}
                </div>
  
                {data.subtitle ? (
                  <div className="text-xs text-[var(--text2)] mt-1">
                    {data.subtitle}
                  </div>
                ) : (
                  <div className="text-xs text-[var(--text3)] mt-1">
                    (clique pour éditer)
                  </div>
                )}
              </>
            )}
          </div>
  
          {/* intérieur transparent */}
          <div className="h-[calc(100%-64px)]" />
        </div>
      </div>
    );
  }

/* CARD (inchangé chez toi) */
export function CardNode({ data }) {
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState(data.title || "");
  const [note, setNote] = useState(data.note || "");
  const [itemsText, setItemsText] = useState((data.items || []).join("\n"));

  const editRef = useRef(null);

  useEffect(() => {
    setTitle(data.title || "");
    setNote(data.note || "");
    setItemsText((data.items || []).join("\n"));
  }, [data.title, data.note, data.items]);

  const startEdit = (e) => {
    e.stopPropagation();
    if (!data.editable) return;
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setTitle(data.title || "");
    setNote(data.note || "");
    setItemsText((data.items || []).join("\n"));
  };

  const commit = () => {
    setEditing(false);
    const items = itemsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    data.onUpdate?.(data.__id, { title, note, items });
  };

  const keyHandler = (e) => {
    if (e.key === "Escape") cancel();
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) commit();
  };

  const onEditorBlur = (e) => {
    const next = e.relatedTarget;
    if (next && editRef.current && editRef.current.contains(next)) return;
    commit();
  };

  return (
    <div
      onClick={startEdit}
      className="min-w-[220px] max-w-[320px] rounded-2xl border border-[var(--text3)]/25 bg-[var(--details-dark)] shadow-lg relative"
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0.6 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0.6 }} />

      <div className="px-4 py-3">
        {editing ? (
          <div
            ref={editRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={keyHandler}
            onBlur={onEditorBlur}
            className="outline-none"
          >
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-[var(--text1)] font-semibold bg-transparent outline-none"
              placeholder="Titre"
            />
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full mt-2 text-xs text-[var(--text2)] bg-transparent outline-none"
              placeholder="Note"
            />
            <textarea
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              className="w-full mt-3 min-h-[90px] text-xs text-[var(--text2)] bg-transparent outline-none resize-none"
              placeholder={"Items (1 par ligne)\nEx: Skyr\nOeufs\nPoulet"}
            />
            <div className="mt-2 text-[10px] text-[var(--text3)]">
              Ctrl/Cmd+Enter = valider • Esc = annuler • clique dehors = valider
            </div>
          </div>
        ) : (
          <>
            <div className="text-[var(--text1)] font-semibold">{data.title}</div>
            {data.note ? <div className="text-xs text-[var(--text2)] mt-1">{data.note}</div> : null}
            {Array.isArray(data.items) && data.items.length > 0 ? (
              <ul className="mt-3 space-y-1 text-xs text-[var(--text2)]">
                {data.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="opacity-70">•</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 text-xs text-[var(--text3)]">(clique pour éditer)</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* NOTE */
export function NoteNode({ data }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data.text || "");

  useEffect(() => setValue(data.text || ""), [data.text]);

  const startEdit = (e) => {
    e.stopPropagation();
    if (!data.editable) return;
    setEditing(true);
  };

  const commit = () => {
    setEditing(false);
    data.onUpdate?.(data.__id, { text: value });
  };

  return (
    <div
      onClick={startEdit}
      className="rounded-2xl border border-[var(--text3)]/20 bg-black/10 backdrop-blur-sm px-3 py-2 max-w-[420px]"
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0.35 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0.35 }} />

      {editing ? (
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) commit();
            if (e.key === "Escape") setEditing(false);
          }}
          className="w-full min-h-[70px] text-sm text-[var(--text1)] bg-transparent outline-none resize-none"
        />
      ) : (
        <div className="text-sm text-[var(--text1)] whitespace-pre-wrap">
          {data.text || "Zone de texte (clique pour modifier)"}
        </div>
      )}
    </div>
  );
}

export const nodeTypes = { group: GroupNode, card: CardNode, note: NoteNode };
