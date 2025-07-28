// components/Loader.jsx
"use client";

export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-6 border-[var(--text)] border-t-[var(--green3)] rounded-full"></div>
    </div>
  );
}
