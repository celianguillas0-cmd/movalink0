"use client";

import { useEffect, useRef } from "react";

// ─── Suivi tactile global ────────────────────────────────────────────────────
// Sur mobile, les événements tactiles restent « capturés » par l'élément où le
// doigt s'est posé : glisser vers un autre bouton ne déclencherait rien. On
// installe donc UN seul écouteur au niveau du document qui cherche l'élément
// réellement sous le doigt (elementFromPoint) — le doigt se comporte alors
// exactement comme un curseur qui survole les éléments en glissant.
let installed = false;
let active: HTMLElement | null = null;

function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

function applyTilt(el: HTMLElement, clientX: number, clientY: number) {
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return;
  const max = Number(el.dataset.tiltMax) || 14;
  const px = (clientX - r.left) / r.width; // 0..1
  const py = (clientY - r.top) / r.height; // 0..1
  el.style.setProperty("--rx", `${(0.5 - py) * max}deg`);
  el.style.setProperty("--ry", `${(px - 0.5) * max}deg`);
  el.style.setProperty("--mx", `${px * 100}%`);
  el.style.setProperty("--my", `${py * 100}%`);
  el.style.setProperty("--tilt", "1");
}

function resetTilt(el: HTMLElement) {
  el.style.setProperty("--rx", "0deg");
  el.style.setProperty("--ry", "0deg");
  el.style.setProperty("--tilt", "0");
}

function installTouchTracking() {
  if (installed || typeof document === "undefined") return;
  installed = true;

  const track = (e: TouchEvent) => {
    if (reducedMotion()) return;
    const t = e.touches[0];
    if (!t) return;
    const under = document.elementFromPoint(t.clientX, t.clientY);
    const tilt = (under?.closest(".tilt3d") ?? null) as HTMLElement | null;
    if (tilt !== active) {
      if (active) resetTilt(active);
      active = tilt;
    }
    if (tilt) applyTilt(tilt, t.clientX, t.clientY);
  };

  const end = () => {
    if (active) resetTilt(active);
    active = null;
  };

  // Passifs : on n'empêche jamais le défilement de la page.
  document.addEventListener("touchstart", track, { passive: true });
  document.addEventListener("touchmove", track, { passive: true });
  document.addEventListener("touchend", end, { passive: true });
  document.addEventListener("touchcancel", end, { passive: true });
}

// ─── Composant ───────────────────────────────────────────────────────────────
// Inclinaison 3D haute qualité : l'élément pivote vers le point actif (curseur
// au survol sur ordinateur, doigt qui glisse sur mobile) avec perspective,
// léger zoom, ombre portée dynamique et reflet spéculaire suivant ce point.
// Le rendu est piloté par CSS via des variables (globals.css, .tilt3d) — donc
// fluide et accéléré par le GPU.
export default function Tilt3D({
  children,
  max = 14,
}: {
  children: React.ReactNode;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    installTouchTracking();
  }, []);

  return (
    <div
      ref={ref}
      className="tilt3d"
      data-tilt-max={max}
      onMouseMove={(e) => {
        if (reducedMotion()) return;
        if (ref.current) applyTilt(ref.current, e.clientX, e.clientY);
      }}
      onMouseLeave={() => {
        if (ref.current) resetTilt(ref.current);
      }}
    >
      {children}
    </div>
  );
}
