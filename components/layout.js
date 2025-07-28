import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen transition-colors duration-300">
      {children}
    </div>
  );
}