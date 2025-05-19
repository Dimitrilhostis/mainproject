"use client";

import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import { LuCrown } from 'react-icons/lu';
import { IoSettingsSharp } from 'react-icons/io5';
import { CiClock1 } from 'react-icons/ci';

// Sidebar component with resizable width and active icon highlighting
const defaultMinWidth = 60;
const defaultMaxWidth = 250;
const defaultWidth = 60;
const collapseThreshold = 80;

export default function SideBar({
  itemsTop = [
    { label: 'Accueil', href: '/', icon: <FaHome /> },
    { label: 'Discover', href: '/discover', icon: <IoIosSearch /> },
    { label: 'Mes programmes', href: '/programs', icon: <LuCrown /> },
    { label: 'Timer', href: '/timer', icon: <CiClock1 /> },
  ],
  itemsBottom = [
    { label: 'Paramètres', href: '/settings', icon: <IoSettingsSharp /> },
  ],
  minWidth = defaultMinWidth,
  maxWidth = defaultMaxWidth,
  defaultWidth: initWidth = defaultWidth,
}) {
  const [width, setWidth] = useState(initWidth);
  const sidebarRef = useRef(null);
  const resizerRef = useRef(null);
  const pathname = usePathname();

  // Start resize handler
  const startResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarRef.current.getBoundingClientRect().width;
    document.body.style.cursor = 'col-resize';
    resizerRef.current.classList.add('bg-purple-500');

    const doDrag = (evt) => {
      let newWidth = startWidth + evt.clientX - startX;
      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;
      setWidth(newWidth);
    };

    const stopDrag = () => {
      document.body.style.cursor = 'default';
      resizerRef.current.classList.remove('bg-purple-500');
      window.removeEventListener('mousemove', doDrag);
      window.removeEventListener('mouseup', stopDrag);
    };

    window.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', stopDrag);
  };

  const collapsed = width < collapseThreshold;

  return (
    <aside
      ref={sidebarRef}
      className="relative h-screen flex flex-col justify-between px-2 bg-gray-50 border-r border-gray-200 shadow-lg overflow-hidden transition-[width] duration-100 ease-out"
      style={{ width: `${width}px` }}
    >
      {/* Top Nav Items */}
      <nav>
        <ul className="flex flex-col mt-2">
          {itemsTop.map(({ label, href, icon }) => {
            const isActive = pathname === href;
            const baseClasses = collapsed
              ? 'flex items-center justify-center w-12 h-12 mx-auto transition-all duration-100 ease-out rounded'
              : 'flex items-center gap-x-4 w-full p-3 transition-all duration-100 ease-out rounded';
            const bgClass = isActive ? 'bg-violet-400 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700';
            return (
              <li key={href} className="mt-2">
                <Link
                  href={href}
                  title={collapsed ? label : undefined}
                  className={`${baseClasses} ${bgClass}`}
                >
                  <span className="text-xl">{icon}</span>
                  {!collapsed && <span className="font-medium truncate">{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Nav Items */}
      {itemsBottom.length > 0 && (
        <nav>
          <ul className="flex flex-col mb-2">
            {itemsBottom.map(({ label, href, icon }) => {
              const isActive = pathname === href;
              const baseClasses = collapsed
                ? 'flex items-center justify-center w-12 h-12 mx-auto transition-all duration-100 ease-out rounded'
                : 'flex items-center gap-x-4 w-full p-3 transition-all duration-100 ease-out rounded';
              const bgClass = isActive ? 'bg-violet-400 hover:bg-violet-500 text-white' : 'bg-gray-200 hover:bg-violet-300 text-gray-700';
              return (
                <li key={href} className="mb-2">
                  <Link
                    href={href}
                    title={collapsed ? label : undefined}
                    className={`${baseClasses} ${bgClass}`}
                  >
                    <span className="text-xl">{icon}</span>
                    {!collapsed && <span className="font-medium truncate">{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* Resizer */}
      <div
        ref={resizerRef}
        onMouseDown={startResize}
        className="absolute top-0 right-0 bottom-0 w-1.5 cursor-col-resize z-10 bg-transparent hover:bg-violet-200"
      />
    </aside>
  );
}

SideBar.propTypes = {
  itemsTop: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, href: PropTypes.string.isRequired, icon: PropTypes.element.isRequired })
  ),
  itemsBottom: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string.isRequired, href: PropTypes.string.isRequired, icon: PropTypes.element.isRequired })
  ),
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  defaultWidth: PropTypes.number,
};

SideBar.defaultProps = {
  itemsTop: [],
  itemsBottom: [],
  minWidth: defaultMinWidth,
  maxWidth: defaultMaxWidth,
  defaultWidth,
};
