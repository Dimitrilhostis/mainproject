{/* VideoZone.jsx */}
import React from "react";

export default function VideoZone({ src, poster, height="w-full", width="h-80" }) {
  return (
    <div className={`mx-auto ${width}`}>
      <video
        src={src}
        poster={poster}
        controls               // affiche play/pause, volume, fullscreen…
        preload="metadata"     // charge juste les métadonnées au début
        className={`object-cover rounded-lg shadow-lg ${height} ${width}`}
      >
        Désolé, votre navigateur ne supporte pas la vidéo.
      </video>
    </div>
  );
}
