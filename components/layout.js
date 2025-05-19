// components/layout.jsx
"use client";


export default function Layout({ children }) {
  return (
    <div className="min-h-screen min-w-screen flex bg-beige-100">

      {/* Zone principale : on centre toujours le contenu */}
      <div className="flex-1 flex items-center justify-center bg-violet-100">
        {children}
      </div>
    </div>
  );
}
