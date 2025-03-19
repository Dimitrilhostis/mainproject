'use client';

import { cn } from '@lib/utils';

export default function Button({ variant = 'default', className, ...props }) {
  const variants = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-gray-500 text-gray-500 hover:bg-gray-100',
  };

  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-all',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
