"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import { LuCrown } from 'react-icons/lu';
import { CiClock1 } from 'react-icons/ci';
import { IoSettingsSharp } from 'react-icons/io5';

const navItems = [
  { href: '/', icon: <FaHome size={24} />, label: 'Accueil' },
  { href: '/discover', icon: <IoIosSearch size={24} />, label: 'Discover' },
  { href: '/programs', icon: <LuCrown size={24} />, label: 'Programmes' },
  { href: '/timer', icon: <CiClock1 size={24} />, label: 'Timer' },
  { href: '/settings', icon: <IoSettingsSharp size={24} />, label: 'Paramètres' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white border-gray-200 shadow-inner flex justify-around py-2 md:hidden">
      {navItems.map(({ href, icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link key={href} href={href} aria-label={label}>
            <div
              className={`flex items-center justify-center p-2 rounded-full transition-colors duration-200 ${
                isActive ? 'bg-violet-400/20' : 'hover:bg-violet-100'
              }`}
            >
              <span className={`${isActive ? 'text-violet-400' : 'text-gray-500'}`}>{icon}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
