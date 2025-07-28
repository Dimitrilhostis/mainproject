"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import PropTypes from 'prop-types';
import { useRouter, usePathname } from 'next/navigation';

export default function Header({
  sections = [
    { label: 'Accueil', id: 'hero', href: '/' },
    { label: 'Programmes', id: 'programs', href: '/programs' },
    { label: 'Roadmaps', id: 'roadmap', href: '/roadmaps' },
    { label: 'E‑books', id: 'ebooks', href: '/ebooks' },
    { label: 'Outils', id: 'outils', href: '/timer' },
    { label: 'Settings', id: 'settings', href: '/settings' }
  ]
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // ← hook pour la route active

  const goToPage = (href) => () => {
    router.push(href);
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-colors duration-300
        ${scrolled 
          ? 'bg-[var(--background)] bg-opacity-90 border-b border-[var(--details-dark)]' 
          : 'bg-transparent'
        }
      `}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="text-2xl font-bold text-[var(--green2)]">The Smart Way</div>

        {/* Menu desktop */}
        <ul className="hidden lg:flex space-x-6">
          {sections.map(({ label, id, href }) => {
            const isActive = pathname === href;
            return (
              <li key={id}>
                <button
                  onClick={goToPage(href)}
                  className={`
                    hover:underline
                    ${isActive 
                      ? 'text-[var(--green2)] font-semibold' 
                      : 'text-[var(--text1)]'
                    }
                  `}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Bouton mobile */}
        <button
          className="lg:hidden p-2 focus:outline-none"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Menu mobile full-screen */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-[var(--background)] bg-opacity-95 flex flex-col items-center justify-center space-y-6 z-40">
          <button
            className="absolute top-4 right-4 p-2 focus:outline-none"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>

          {sections.map(({ label, id, href }) => {
            const isActive = pathname === href;
            return (
              <button
                key={id}
                onClick={goToPage(href)}
                className={`
                  text-2xl font-medium hover:underline
                  ${isActive 
                    ? 'text-[var(--green2)]' 
                    : 'text-[var(--text1)]'
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

Header.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      id:    PropTypes.string.isRequired,
      href:  PropTypes.string.isRequired
    })
  )
};
