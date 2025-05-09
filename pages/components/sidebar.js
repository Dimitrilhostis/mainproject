"use client";

import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';
import { LuCrown } from 'react-icons/lu';
import { IoSettingsSharp } from 'react-icons/io5';

// Utilisation :
// <SideBar
//   itemsTop={[{ label, href, icon }, ...]}
//   itemsBottom={[{ label, href, icon }, ...]}
//   minWidth={60}
//   maxWidth={400}
//   defaultWidth={250}
// />

const defaultMinWidth = 60;
const defaultMaxWidth = 400;
const defaultWidth = 250;
const collapseThreshold = 80;

export default function SideBar({
  itemsTop = [
      { label: 'Accueil', href: '/', icon: <FaHome /> },
      { label: 'Discover', href: '/discover', icon: <IoIosSearch /> },
      { label: 'Mes programmes', href: '/programs', icon: <LuCrown /> },
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

  const startResize = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarRef.current.getBoundingClientRect().width;

    document.body.style.cursor = 'col-resize';
    resizerRef.current.classList.add('bg-gray-300');

    const doDrag = (evt) => {
      let newWidth = startWidth + evt.clientX - startX;
      if (newWidth < minWidth) newWidth = minWidth;
      if (newWidth > maxWidth) newWidth = maxWidth;
      setWidth(newWidth);
    };

    const stopDrag = () => {
      document.body.style.cursor = 'default';
      resizerRef.current.classList.remove('bg-gray-300');
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
      {/* Items du haut */}
      <nav>
        <ul className="flex flex-col mt-2">
          {itemsTop.map(({ label, href, icon }) => (
            <li key={href} className="mt-2">
              <Link
                href={href}
                title={collapsed ? label : undefined}
                className={
                  collapsed
                    ? 'flex items-center justify-center w-12 h-12 mx-auto transition-all duration-100 ease-out bg-gray-200 rounded hover:bg-gray-300'
                    : 'flex items-center gap-x-4 w-full p-3 transition-all duration-100 ease-out bg-gray-200 rounded hover:bg-gray-300'
                }
              >
                <span className="text-gray-700 text-xl">{icon}</span>
                {!collapsed && (
                  <span className="text-gray-900 font-medium truncate">{label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Items du bas */}
      {itemsBottom.length > 0 && (
        <nav>
          <ul className="flex flex-col mb-2">
            {itemsBottom.map(({ label, href, icon }) => (
              <li key={href} className="mb-2">
                <Link
                  href={href}
                  title={collapsed ? label : undefined}
                  className={
                    collapsed
                      ? 'flex items-center justify-center w-12 h-12 mx-auto transition-all duration-100 ease-out bg-gray-200 rounded hover:bg-gray-300'
                      : 'flex items-center gap-x-4 w-full p-3 transition-all duration-100 ease-out bg-gray-200 rounded hover:bg-gray-300'
                  }
                >
                  <span className="text-gray-700 text-xl">{icon}</span>
                  {!collapsed && (
                    <span className="text-gray-900 font-medium truncate">{label}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Resizer */}
      <div
        ref={resizerRef}
        onMouseDown={startResize}
        className="absolute top-0 right-0 bottom-0 w-1.5 cursor-col-resize z-10 bg-transparent hover:bg-gray-300"
      />
    </aside>
  );
}

SideBar.propTypes = {
  itemsTop: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
    })
  ),
  itemsBottom: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
    })
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
