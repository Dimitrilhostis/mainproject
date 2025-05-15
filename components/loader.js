// components/Loader.jsx
"use client";

export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-8 border-gray-300 border-t-gray-800 rounded-full"></div>
    </div>
  );
}
