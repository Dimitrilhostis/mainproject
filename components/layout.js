// components/layout.jsx
"use client";


export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex bg-beige-100">

      {/* Zone principale : on centre toujours le contenu */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        {children}
      </div>
    </div>
  );
}
