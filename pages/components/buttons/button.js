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
  bgColor,
  textColor,
  width,
  height,
  children,
  onClick,
  className,
}) => {
  // Base styles: rounded corners, slight shadow, centered content, transition.
  const baseClasses = 'py-1 px-2 m-1 inline-flex items-center justify-center rounded-lg shadow-sm transition-opacity duration-100 hover:opacity-90';

  // Dynamic size using bracket notation for arbitrary values.
  const sizeClasses = [
    width ? `w-[${width}]` : '',
    height ? `h-[${height}]` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const colorClasses = [bgColor, textColor].filter(Boolean).join(' ');

  const combined = [baseClasses, sizeClasses, colorClasses, className]
    .filter(Boolean)
    .join(' ');

  if (href) {
    return (
      <Link href={href} className={combined}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combined}>
      {children}
    </button>
  );
};

Button.propTypes = {
  href: PropTypes.string,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Button.defaultProps = {
  href: '/',
  bgColor: 'bg-blue-500',
  textColor: 'text-white',
  width: 'w-30',
  height: 'h-10',
  onClick: undefined,
  className: '',
};

export default Button;
