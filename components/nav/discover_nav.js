"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

export default function DiscoverNav() {
  const path = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs = [
    { label: "Programmes",   href: "/discover" },
    { label: "Exercices",    href: "/discover/exercises" },
    { label: "Préparations", href: "/discover/preparations" },
  ];

  const isActive = (href) => {
    if (href === "/discover") {
      return path === href;
    }
    return path === href || path.startsWith(`${href}/`);
  };

  return (
    <nav className="w-full bg-white">
      {/* BARRE PRINCIPALE */}
      <div className="flex items-center h-16 px-4 md:px-6 lg:px-8">
        {/* ← BOUTON HAMBURGER (mobile) placé à gauche */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            aria-label="Ouvrir le menu mobile"
          >
            <FiMenu className="h-6 w-6" />
          </button>
        </div>

        {/* ← MENU DESKTOP (visible à partir de md), aligné à gauche */}
        <ul className="hidden md:flex md:flex-shrink-0 md:w-[500px]">
          {tabs.map((t) => (
            <li key={t.href} className="flex-1">
              <Link href={t.href}>
                <span
                  className={
                    "block text-center px-4 py-3 font-medium rounded-md " +
                    (isActive(t.href)
                      ? "bg-purple-500 text-white"
                      : "text-gray-700 hover:bg-purple-100 hover:text-gray-900")
                  }
                >
                  {t.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* ← Espace vide pour pousser tout le reste vers la gauche */}
        <div className="flex-1"></div>
      </div>

      {/* MENU MOBILE PLEIN ÉCRAN (visible si mobileOpen) */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-white">
          {/* Barre de fermeture */}
          <div className="flex items-center h-16 px-4">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-label="Fermer le menu mobile"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          {/* Liens mobiles, alignés à gauche */}
          <div className="px-4 py-2 space-y-2">
            {tabs.map((t) => (
              <Link key={t.href} href={t.href}>
                <span
                  onClick={() => setMobileOpen(false)}
                  className={
                    "block text-center w-full px-4 py-3 font-medium rounded-md text-base " +
                    (isActive(t.href)
                      ? "bg-purple-600 text-white"
                      : "text-gray-700 hover:bg-purple-100 hover:text-gray-900")
                  }
                >
                  {t.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
