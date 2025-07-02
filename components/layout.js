// components/layout.jsx
"use client";


export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-violet-100">

      {/* Zone principale : on centre toujours le contenu */}
      <div className="flex-1 flex bg-violet-100">
        {children}
      </div>
    </div>
  );
}
