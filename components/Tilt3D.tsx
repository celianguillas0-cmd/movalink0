"use client";

import { useRef } from "react";

// Inclinaison 3D haute qualité : l'élément enfant pivote vers le point actif
// (curseur au survol sur ordinateur, doigt maintenu appuyé sur mobile) avec
// perspective, léger zoom, ombre portée dynamique et reflet spéculaire qui suit
// le point. Le rendu (transform/glare) est piloté par CSS (globals.css, .tilt3d)
// via des variables — donc fluide et GPU. Désactivé si « réduire les animations ».
export default function Tilt3D({
  children,
  max = 14,
}: {
  children: React.ReactNode;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const reduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const setFromPoint = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el || reduced()) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const px = (clientX - r.left) / r.width; // 0..1
    const py = (clientY - r.top) / r.height; // 0..1
    el.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--tilt", "1");
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--tilt", "0");
  };

  return (
    <div
      ref={ref}
      className="tilt3d"
      onMouseMove={(e) => setFromPoint(e.clientX, e.clientY)}
      onMouseLeave={reset}
      onTouchStart={(e) => {
        const t = e.touches[0];
        if (t) setFromPoint(t.clientX, t.clientY);
      }}
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (t) setFromPoint(t.clientX, t.clientY);
      }}
      onTouchEnd={reset}
      onTouchCancel={reset}
    >
      {children}
    </div>
  );
}
