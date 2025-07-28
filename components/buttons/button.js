import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

/**
 * Button component.
 *
 * Props:
 * - href: optional, if provided renders an <Link> tag, otherwise a <button>.
 * - bgColor: Tailwind background color class (e.g. 'bg-blue-500').
 * - textColor: Tailwind text color class (e.g. 'text-white').
 * - width: CSS width value (e.g. '150px' or '10rem'), applied via Tailwind bracket notation.
 * - height: CSS height value (e.g. '40px'), applied via Tailwind bracket notation.
 * - children: button text or elements.
 * - onClick: click handler (only for <button>).
 */

const Button = ({
  href,
  children,
  onClick,
}) => {

  if (href) {
    return (
      <Link href={href} className="bg-[var(--green1)] hover:bg-[var(--green2)] text-[var(--text)] font-semibold py-3 px-6 rounded-full">
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="bg-[var(--green1)] hover:bg-[var(--green2)] text-[var(--text)] font-semibold py-3 px-6 rounded-full">
      {children}
    </button>
  );
};

Button.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default Button;
