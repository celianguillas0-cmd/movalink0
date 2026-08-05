"use client";

import { useEffect, useRef } from "react";

/**
 * Traînée de fumée qui suit le curseur.
 *
 * Qualité : les bouffées sont émises le long du trajet réel du curseur
 * (interpolation entre deux images) pour qu'un mouvement rapide ne laisse
 * jamais de trous. Chaque bouffée monte, grossit, tourne et dérive selon un
 * champ de turbulence — ce qui donne le mouvement organique de la vraie fumée
 * plutôt qu'un simple dégradé qui suit la souris.
 *
 * Performance : le sprite (dégradé radial doux) est pré-rendu une seule fois
 * hors écran, puis dessiné avec transformations. Aucun dégradé n'est recréé
 * pendant l'animation, ce qui laisse la boucle à 60 img/s même avec 200
 * particules. L'animation se met en pause quand l'onglet est masqué.
 */

interface Puff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0 → 1
  decay: number;
  size: number;
  growth: number;
  rot: number;
  rotSpeed: number;
  seed: number;
  alpha: number;
}

const MAX_PUFFS = 220;
const SPRITE_SIZE = 128;
// Distance (px) entre deux bouffées le long du trajet du curseur. Faible
// devant leur taille : c'est ce recouvrement qui soude la traînée.
const EMIT_SPACING = 4;
// Au-delà, on considère que le curseur a « sauté » plutôt que glissé.
const MAX_STEP = 260;

function buildSprite(color: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = SPRITE_SIZE;
  const g = c.getContext("2d");
  if (!g) return c;
  const r = SPRITE_SIZE / 2;
  // Décroissance quasi gaussienne, sans cœur net : une bouffée seule est à
  // peine visible, c'est leur superposition qui construit le volume. Un
  // dégradé plus franc donnerait des pastilles bien distinctes, pas un nuage.
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, `${color}ff`);
  grad.addColorStop(0.15, `${color}d0`);
  grad.addColorStop(0.3, `${color}90`);
  grad.addColorStop(0.45, `${color}55`);
  grad.addColorStop(0.6, `${color}2e`);
  grad.addColorStop(0.75, `${color}14`);
  grad.addColorStop(0.9, `${color}05`);
  grad.addColorStop(1, `${color}00`);
  g.fillStyle = grad;
  g.beginPath();
  g.arc(r, r, r, 0, Math.PI * 2);
  g.fill();
  return c;
}

// Normalise une couleur (#rgb / #rrggbb) en #rrggbb utilisable en hex 8 chiffres.
function normalizeHex(color: string): string {
  const v = color.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  }
  return "#ffffff";
}

export default function CursorTrail({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Respecte le réglage système « animations réduites ».
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const sprite = buildSprite(normalizeHex(color));
    const puffs: Puff[] = [];

    // Sur mobile (pointeur grossier), on allège : moins de bouffées et une
    // résolution plafonnée, car le remplissage de gros sprites translucides
    // est ce qui coûte le plus cher sur GPU de téléphone.
    const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    const maxPuffs = coarse ? 130 : MAX_PUFFS;
    const maxDpr = coarse ? 1.5 : 2;

    let raf = 0;
    let dpr = 1;
    let w = 0;
    let h = 0;
    // Position du curseur : dernière connue et précédente (pour interpoler).
    let px = -1;
    let py = -1;
    let hasPointer = false;
    let carry = 0; // reliquat de distance entre deux émissions
    let last = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const spawn = (x: number, y: number, vx: number, vy: number) => {
      if (puffs.length >= maxPuffs) return;
      const speed = Math.hypot(vx, vy);
      puffs.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        // La bouffée hérite d'une fraction de l'élan du curseur, puis freine :
        // c'est ce qui étire la traînée dans le sens du mouvement.
        vx: vx * 0.16 + (Math.random() - 0.5) * 0.32,
        vy: vy * 0.16 + (Math.random() - 0.5) * 0.32,
        life: 0,
        // Les bouffées d'un geste rapide vivent un peu moins longtemps :
        // la traînée reste lisible au lieu de saturer l'écran.
        decay: 0.009 + Math.random() * 0.006 + Math.min(speed, 40) * 0.00012,
        // Large dès la naissance : à 4 px d'écart, les bouffées se recouvrent
        // massivement et fusionnent en un panache continu.
        size: 26 + Math.random() * 16,
        // Expansion mesurée : trop rapide, la fumée se dilue avant d'être vue.
        growth: 18 + Math.random() * 16,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.9,
        seed: Math.random() * 1000,
        // Transparente à l'unité : c'est l'accumulation qui donne la densité,
        // jamais une bouffée isolée.
        alpha: 0.3 + Math.random() * 0.14,
      });
    };

    const emitAlong = (x: number, y: number) => {
      if (!hasPointer) {
        px = x;
        py = y;
        hasPointer = true;
        return;
      }
      const dx = x - px;
      const dy = y - py;
      const dist = Math.hypot(dx, dy);
      // Saut brusque (curseur qui revient dans la page, geste très rapide) :
      // on repositionne sans tracer, sinon une longue ligne de bouffées
      // saturerait d'un coup le budget de particules.
      if (dist > MAX_STEP) {
        px = x;
        py = y;
        carry = 0;
        return;
      }
      if (dist > 0) {
        // Vitesse instantanée, transmise aux bouffées.
        const vx = dx;
        const vy = dy;
        let travelled = carry;
        while (travelled + EMIT_SPACING <= dist) {
          travelled += EMIT_SPACING;
          const t = travelled / dist;
          spawn(px + dx * t, py + dy * t, vx, vy);
        }
        carry = travelled - dist;
      }
      px = x;
      py = y;
    };

    const emitAt = (clientX: number, clientY: number) => {
      const rect = parent.getBoundingClientRect();
      emitAlong(clientX - rect.left, clientY - rect.top);
    };

    // Souris / stylet. Le tactile est traité à part : pendant un défilement le
    // navigateur annule les événements « pointer » alors que les « touch »
    // continuent — sans ça la traînée se couperait dès que la page défile.
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      emitAt(e.clientX, e.clientY);
    };
    const onPointerLeave = () => {
      hasPointer = false;
    };

    // Doigt : la traînée suit le glissement, y compris pendant le défilement.
    // Écouteurs passifs et aucun preventDefault — le scroll reste intact.
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      // On repart de la position du doigt sans tracer : pas de trait entre
      // l'ancien point et l'endroit où l'écran est touché.
      hasPointer = false;
      carry = 0;
      emitAt(t.clientX, t.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) emitAt(t.clientX, t.clientY);
    };
    const onTouchEnd = () => {
      hasPointer = false;
    };

    parent.addEventListener("pointermove", onPointerMove, { passive: true });
    parent.addEventListener("pointerleave", onPointerLeave, { passive: true });
    parent.addEventListener("touchstart", onTouchStart, { passive: true });
    parent.addEventListener("touchmove", onTouchMove, { passive: true });
    parent.addEventListener("touchend", onTouchEnd, { passive: true });
    parent.addEventListener("touchcancel", onTouchEnd, { passive: true });

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      // Delta normalisé sur 60 img/s, borné pour éviter un saut après une
      // mise en pause (onglet masqué, thread bloqué).
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;

      ctx.clearRect(0, 0, w, h);
      if (!puffs.length) return;

      ctx.globalCompositeOperation = "source-over";
      const time = now * 0.001;

      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life += p.decay * dt;
        if (p.life >= 1) {
          puffs.splice(i, 1);
          continue;
        }

        // Turbulence : deux sinusoïdes déphasées font onduler la fumée comme
        // un courant d'air, sans le coût d'un vrai bruit de Perlin.
        const tx = Math.sin(p.y * 0.022 + time * 1.1 + p.seed) * 0.2;
        const ty = Math.cos(p.x * 0.022 + time * 0.9 + p.seed) * 0.14;

        p.vx = (p.vx + tx * dt) * 0.94;
        // Flottabilité : la fumée monte, de plus en plus vite en s'allégeant.
        p.vy = (p.vy + (ty - 0.30 - p.life * 0.34) * dt) * 0.94;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.rotSpeed * 0.01 * dt;

        // Apparition rapide puis dissipation douce. L'exposant 1.5 garde la
        // traînée bien présente derrière le curseur avant de s'effacer.
        const fadeIn = Math.min(p.life / 0.1, 1);
        const fadeOut = 1 - p.life;
        const alpha = p.alpha * fadeIn * fadeOut * Math.sqrt(fadeOut);
        if (alpha <= 0.002) continue;

        const size = p.size + p.growth * p.life;
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      ctx.globalAlpha = 1;
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      parent.removeEventListener("pointermove", onPointerMove);
      parent.removeEventListener("pointerleave", onPointerLeave);
      parent.removeEventListener("touchstart", onTouchStart);
      parent.removeEventListener("touchmove", onTouchMove);
      parent.removeEventListener("touchend", onTouchEnd);
      parent.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20"
      aria-hidden
    />
  );
}
