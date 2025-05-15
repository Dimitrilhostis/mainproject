// components/MobileNav.jsx
"use client";

import Link from "next/link";
import { FaHome } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import { LuCrown } from 'react-icons/lu';
import { IoSettingsSharp } from 'react-icons/io5';
import { CiClock1 } from "react-icons/ci";

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-inner flex justify-around py-2 md:hidden">
      <Link href="/programs"><LuCrown size={24} /></Link>
      <Link href="/discover"><IoIosSearch size={24} /></Link>
      <Link href="/"><FaHome size={24} /></Link>
      <Link href="/timer"><CiClock1 size={24} /></Link>
      <Link href="/settings"><IoSettingsSharp size={24} /></Link>
    </nav>
  );
}
