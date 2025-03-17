import { Search, PlusCircle, Heart } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-xl font-bold">Let You Cook</h1>
      <div className="flex gap-4">
        <button><Search size={24} /></button>
        <button><PlusCircle size={24} /></button>
        <button><Heart size={24} /></button>
      </div>
    </header>
  );
}
