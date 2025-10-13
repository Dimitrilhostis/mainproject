"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ImBook } from 'react-icons/im';
import { LuCrown } from 'react-icons/lu';
import { CiClock1 } from 'react-icons/ci';
import { PiPath } from 'react-icons/pi';
import { IoSettingsSharp } from 'react-icons/io5';
import { useState, useEffect } from 'react';

const sections = [
  { label: 'Accueil', href: '/' },
  { label: 'Programmes', href: '/programs' },
  { label: 'Roadmaps', href: '/roadmaps' },
  { label: 'E‑books', href: '/ebooks' },
  { label: 'Outils', href: '/timer' },
  { label: 'Paramètres', href: '/settings' }
];

const navItems = [
  { href: '/roadmaps', icon: <ImBook size={24} />, label: 'Services' },
  { href: '/ebooks', icon: <PiPath size={24} />, label: 'Services' },
  { href: '/programs', icon: <LuCrown size={24} />, label: 'Programmes' },
  { href: '/timer', icon: <CiClock1 size={24} />, label: 'Timer' },
  { href: '/settings', icon: <IoSettingsSharp size={24} />, label: 'Paramètres' }
];

export default function Header({scroll_x=200, time_s=3}) {
  const router = useRouter();
  const pathname = usePathname();
  const goTo = (href) => () => router.push(href);
  const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > scroll_x);
  onScroll(); // pour initialiser au chargement
  window.addEventListener('scroll', onScroll);
  console.log("Header threshold:", scroll_x);
  return () => window.removeEventListener('scroll', onScroll);
}, [scroll_x]);

  return (
    <>
      {/* Desktop header */}
      <header 
      className={`
    fixed top-0 w-full z-50 hidden md:block transition-colors duration-${time_s}00
    ${scrolled
      ? 'bg-[var(--background)] border-b border-[var(--details-dark)]'
      : 'bg-transparent border-b border-transparent'}
  `}
      >
      
        <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
          <div className="text-2xl font-bold text-[var(--green2)]">The Smart Way</div>
          <ul className="flex space-x-6">
            {sections.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <li key={href}>
                  <button
                    onClick={goTo(href)}
                    className={`hover:underline ${
                      isActive
                        ? 'text-[var(--green2)] font-semibold'
                        : 'text-[var(--text1)]'
                    }`}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-[var(--background)] border-[var(--details-dark)] shadow-inner flex justify-around py-2 md:hidden">
        {navItems.map(({ href, icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} aria-label={label}>
              <div
                className={`flex items-center justify-center p-2 rounded-full transition-colors duration-200 ${
                  isActive
                    ? 'bg-[var(--green2)]/20'
                    : 'hover:bg-[var(--light-dark)]'
                }`}
              >
                <span className={`${isActive ? 'text-[var(--green2)]' : 'text-[var(--text2)]'}`}>{icon}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
