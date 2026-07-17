"use client";

import { useRef, useState } from "react";
import { Decoration, defaultDecoration } from "@/lib/types";

const labelClass =
  "block text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1.5";
const smallBtnClass =
  "rounded-lg border border-gray-200 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-zinc-300 transition-colors hover:border-gray-400 dark:hover:border-zinc-500 disabled:opacity-40";

export default function DecorationEditor({
  decoration,
  onChange,
  accent,
  fontFamily,
  onError,
}: {
  decoration: Decoration | null;
  onChange: (d: Decoration | null) => void;
  accent: string;
  fontFamily?: string;
  onError: (msg: string) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const patch = (p: Partial<Decoration>) => {
    if (!decoration) return;
    onChange({ ...decoration, ...p });
  };

  const startDrag = (e: React.PointerEvent) => {
    if (!decoration || !canvasRef.current) return;
    e.preventDefault();
    setDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!dragging || !decoration || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    patch({
      x: Math.min(100, Math.max(0, Math.round(x))),
      y: Math.min(100, Math.max(0, Math.round(y))),
    });
  };

  const endDrag = (e: React.PointerEvent) => {
    setDragging(false);
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {
      // capture déjà relâchée
    }
  };

  void onError;

  return (
    <div>
      <p className={labelClass}>Pseudo en filigrane</p>

      <div className="mb-3 flex gap-2">
        <button
          type="button"
          className={smallBtnClass}
          onClick={() =>
            onChange(
              decoration?.kind === "text"
                ? decoration
                : defaultDecoration("text")
            )
          }
        >
          Ajouter mon pseudo
        </button>
        {decoration && (
          <button
            type="button"
            className={smallBtnClass}
            onClick={() => onChange(null)}
          >
            Retirer
          </button>
        )}
      </div>

      {!decoration ? (
        <p className="text-xs text-gray-400 dark:text-zinc-500">
          Affiche ton pseudo en filigrane, puis glisse-le sur l'aperçu pour le
          placer, et utilise les curseurs pour la taille, la rotation et la
          transparence.
        </p>
      ) : (
        <>
          {/* Aperçu de placement (glisser pour déplacer) */}
          <div
            ref={canvasRef}
            className="relative mx-auto aspect-[9/16] w-40 overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-700"
            style={{
              background: `radial-gradient(ellipse at top, ${accent}33, #18181b 60%)`,
              touchAction: "none",
            }}
            onPointerMove={onMove}
          >
            <div
              onPointerDown={startDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className="absolute cursor-move select-none"
              style={{
                left: `${decoration.x}%`,
                top: `${decoration.y}%`,
                transform: `translate(-50%, -50%) rotate(${decoration.rotation}deg)`,
                opacity: decoration.opacity / 100,
              }}
            >
              {decoration.kind === "image" && decoration.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={decoration.url}
                  alt=""
                  draggable={false}
                  style={{
                    width: `${decoration.size * 1.1}px`,
                    height: "auto",
                    maxWidth: "none",
                    pointerEvents: "none",
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: `${decoration.size * 0.28}px`,
                    color: decoration.color,
                    fontFamily,
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                    lineHeight: 1,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    pointerEvents: "none",
                  }}
                >
                  {decoration.text || "PSEUDO"}
                </span>
              )}
            </div>
            <span className="pointer-events-none absolute bottom-1 left-0 right-0 text-center text-[9px] text-white/50">
              glisse pour placer
            </span>
          </div>

          {/* Champ texte si pseudo */}
          {decoration.kind === "text" && (
            <div className="mt-3 flex gap-2">
              <input
                value={decoration.text}
                maxLength={40}
                placeholder="Ton pseudo"
                onChange={(e) => patch({ text: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
              />
              <input
                type="color"
                value={decoration.color}
                onChange={(e) => patch({ color: e.target.value })}
                aria-label="Couleur du pseudo"
                className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-transparent dark:border-zinc-700"
              />
            </div>
          )}

          {/* Curseurs */}
          <div className="mt-4 flex flex-col gap-3">
            <label className="text-xs text-gray-500 dark:text-zinc-400">
              Taille : {decoration.size}
              <input
                type="range"
                min={10}
                max={160}
                value={decoration.size}
                onChange={(e) => patch({ size: Number(e.target.value) })}
                className="mt-1 w-full accent-zinc-900 dark:accent-white"
              />
            </label>
            <label className="text-xs text-gray-500 dark:text-zinc-400">
              Rotation : {decoration.rotation}°
              <input
                type="range"
                min={-180}
                max={180}
                value={decoration.rotation}
                onChange={(e) => patch({ rotation: Number(e.target.value) })}
                className="mt-1 w-full accent-zinc-900 dark:accent-white"
              />
            </label>
            <label className="text-xs text-gray-500 dark:text-zinc-400">
              Opacité : {decoration.opacity}%
              <input
                type="range"
                min={0}
                max={100}
                value={decoration.opacity}
                onChange={(e) => patch({ opacity: Number(e.target.value) })}
                className="mt-1 w-full accent-zinc-900 dark:accent-white"
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}
