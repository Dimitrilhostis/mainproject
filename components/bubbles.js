// components/BubbleBackground.jsx

import React, { useMemo } from "react";

export default function BubbleBackground({ count = 500 }) {
  // useMemo calcule bubblesData une seule fois, au montage
  const bubblesData = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const size     = 20 + Math.random() * 80;    // 20–100px
      const left     = `${Math.random() * 100}%`;  // 0–100%
      const duration = 40 + Math.random() * 40;    // 40–80s
      const delay    = -Math.random() * duration;  // démarrage réparti
      const alpha    = 0.1 + Math.random() * 0.2;  // opacité

      return { size, left, duration, delay, alpha };
    });
  }, [count]);

  return (
    <div className="bubbles">
      {bubblesData.map((b, i) => (
        <span
          key={i}
          style={{
            width:             `${b.size}px`,
            height:            `${b.size}px`,
            left:              b.left,
            background:        `rgba(255,255,255,${b.alpha})`,
            "--anim-duration": `${b.duration}s`,
            "--anim-delay":    `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
