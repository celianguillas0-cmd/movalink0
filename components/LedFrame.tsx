"use client";

import { ButtonStyleId, LedMode } from "@/lib/types";

// Arrondi (px) du bouton selon son style, pour que le ruban LED épouse
// exactement sa forme. Doit rester aligné sur linkButtonProps.
const RADIUS: Record<ButtonStyleId, number> = {
  pill: 9999,
  square: 0,
  underline: 0,
  shadow: 8,
  rounded: 12,
  outline: 12,
  glass: 12,
  neon: 12,
  gradient: 12,
  bevel: 12,
};

// Ruban LED illuminé autour d'un bouton, façon bande LED du commerce :
// un halo diffus (la lumière qui déborde) doublé d'un liseré net au bord.
// Les modes et la couleur sont pilotés en CSS (globals.css, .led).
export default function LedFrame({
  mode,
  color,
  speed,
  buttonStyle,
  children,
}: {
  mode: LedMode;
  color: string;
  speed: number; // durée d'un cycle, en dixièmes de seconde
  buttonStyle: ButtonStyleId;
  children: React.ReactNode;
}) {
  if (mode === "off") return <>{children}</>;
  return (
    <div
      className="led"
      data-mode={mode}
      style={
        {
          "--led-color": color,
          "--led-radius": `${RADIUS[buttonStyle] ?? 12}px`,
          "--led-speed": `${Math.max(1, speed) / 10}s`,
        } as React.CSSProperties
      }
    >
      <span className="led-glow" aria-hidden>
        <i />
      </span>
      <span className="led-ring" aria-hidden />
      {children}
    </div>
  );
}
