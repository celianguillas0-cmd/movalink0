"use client";

import { useRef } from "react";

// Inclinaison 3D haute qualité : l'élément enfant pivote vers le curseur avec
// perspective, un léger zoom, une ombre portée dynamique et un reflet
// spéculaire qui suit la souris. Le rendu (transform/glare) est piloté par CSS
// (voir globals.css, .tilt3d) via des variables — donc fluide et GPU. Désactivé
// sur tactile (pas de survol) et en cas de « réduire les animations ».
export default function Tilt3D({
  children,
  max = 14,
}: {
  children: React.ReactNode;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1
    el.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--tilt", "1");
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--tilt", "0");
  };

  return (
    <div ref={ref} className="tilt3d" onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}
