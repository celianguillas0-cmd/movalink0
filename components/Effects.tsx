"use client";

import { useEffect, useRef } from "react";
import { EffectId } from "@/lib/types";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  // Champs optionnels pour les effets à cycle de vie (ondes, etc.).
  r?: number;
  life?: number;
}

function makeParticles(count: number, w: number, h: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.6,
    vy: 0.4 + Math.random() * 1.2,
    size: 1 + Math.random() * 3,
    phase: Math.random() * Math.PI * 2,
  }));
}

function CanvasEffect({
  effect,
  accent,
  emojiChar = "🔥",
}: {
  effect: EffectId;
  accent: string;
  emojiChar?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let columns: number[] = [];
    const glyphs = "01アイウエオカキクケコサシスセソ<>#$%&";

    // État des effets autonomes (gérés hors de la boucle de particules).
    const fwRockets: { x: number; y: number; vy: number; ty: number; hue: number }[] = [];
    const fwSparks: { x: number; y: number; vx: number; vy: number; life: number; hue: number }[] = [];
    let fwTimer = 0;
    let bolt: { x: number; y: number }[][] = [];
    let boltLife = 0;
    let boltCooldown = 30;
    let eqBars: number[] = []; // hauteurs lissées des barres de l'égaliseur
    // Couleur d'accent + opacité (hex 8 chiffres, supporté par le canvas).
    const acc = (a: number) =>
      accent + Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const counts: Partial<Record<EffectId, number>> = {
        stars: 90,
        constellation: 60,
        sakura: 45,
        fireflies: 45,
        embers: 70,
        confetti: 90,
        bubbles: 40,
        leaves: 40,
        hearts: 26,
        meteors: 12,
        storm: 130,
        emoji: 32,
        matrix: 0,
        glitter: 85,
        orbs: 22,
        starfall: 70,
        phenix: 75,
        galaxy: 120,
        diamonds: 45,
        hyperspace: 150,
        vortex: 140,
        bokeh: 26,
        lanterns: 16,
        goldDust: 130,
        butterflies: 14,
        ripple: 7,
        fireworks: 0,
        lightning: 0,
        auroraWaves: 0,
        waves: 0,
        dna: 0,
        equalizer: 0,
        blackhole: 170,
        jellyfish: 9,
        balloons: 12,
        pixels: 90,
        mesh: 0,
        silk: 0,
        gradientWaves: 0,
        dotGrid: 0,
        topography: 0,
        godRays: 0,
        mist: 0,
        neonTubes: 0,
      };
      const count = counts[effect] ?? 110;
      particles = makeParticles(count, canvas.width, canvas.height);
      columns = Array.from(
        { length: Math.ceil(canvas.width / 16) },
        () => Math.random() * canvas.height
      );
      eqBars = Array.from(
        { length: Math.max(12, Math.floor(canvas.width / 22)) },
        () => Math.random()
      );
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let t = 0;
    let flash = 0; // éclairs de l'effet "storm"
    const draw = () => {
      const { width: w, height: h } = canvas;
      t += 1;

      if (effect === "matrix") {
        // Estompe la frame précédente en la rendant progressivement transparente
        // (destination-out) au lieu de peindre du noir : le fond reste visible
        // derrière la pluie de caractères.
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
        ctx.font = "13px monospace";
        ctx.fillStyle = accent;
        columns.forEach((y, i) => {
          const char = glyphs[Math.floor(Math.random() * glyphs.length)];
          ctx.fillText(char, i * 16, y);
          columns[i] = y > h + Math.random() * 400 ? 0 : y + 14;
        });
      } else if (effect === "fireworks") {
        // Feux d'artifice : des fusées montent puis explosent en gerbes
        // d'étincelles colorées qui retombent sous l'effet de la gravité.
        // On estompe la frame précédente (destination-out) pour les traînées.
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";

        fwTimer -= 1;
        if (fwTimer <= 0) {
          fwRockets.push({
            x: w * (0.15 + Math.random() * 0.7),
            y: h,
            vy: -(6 + Math.random() * 3),
            ty: h * (0.12 + Math.random() * 0.33),
            hue: Math.floor(Math.random() * 360),
          });
          fwTimer = 18 + Math.random() * 30;
        }
        for (let i = fwRockets.length - 1; i >= 0; i--) {
          const r = fwRockets[i];
          r.y += r.vy;
          ctx.save();
          ctx.shadowBlur = 8;
          ctx.shadowColor = `hsl(${r.hue}, 90%, 65%)`;
          ctx.fillStyle = `hsl(${r.hue}, 90%, 80%)`;
          ctx.beginPath();
          ctx.arc(r.x, r.y, 1.9, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          if (r.y <= r.ty) {
            const n = 46 + Math.floor(Math.random() * 26);
            for (let k = 0; k < n; k++) {
              const a = (Math.PI * 2 * k) / n + Math.random() * 0.12;
              const sp = 1.4 + Math.random() * 3.6;
              fwSparks.push({
                x: r.x,
                y: r.y,
                vx: Math.cos(a) * sp,
                vy: Math.sin(a) * sp,
                life: 1,
                hue: r.hue + (Math.random() * 40 - 20),
              });
            }
            fwRockets.splice(i, 1);
          }
        }
        for (let i = fwSparks.length - 1; i >= 0; i--) {
          const s = fwSparks[i];
          s.vy += 0.045;
          s.vx *= 0.99;
          s.vy *= 0.99;
          s.x += s.vx;
          s.y += s.vy;
          s.life -= 0.012;
          if (s.life <= 0) {
            fwSparks.splice(i, 1);
            continue;
          }
          ctx.save();
          ctx.globalAlpha = Math.max(0, s.life);
          ctx.shadowBlur = 6;
          ctx.shadowColor = `hsl(${s.hue}, 90%, 60%)`;
          ctx.fillStyle = `hsl(${s.hue}, 90%, 70%)`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.7, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else if (effect === "lightning") {
        // Éclairs : un éclair fractal (tronc + ramifications) frappe par
        // intermittence, accompagné d'un bref flash lumineux.
        ctx.clearRect(0, 0, w, h);
        boltCooldown -= 1;
        if (boltCooldown <= 0) {
          bolt = [];
          const steps = 14;
          const main: { x: number; y: number }[] = [];
          let x = w * (0.2 + Math.random() * 0.6);
          let y = 0;
          for (let s = 0; s <= steps; s++) {
            main.push({ x, y });
            y += h / steps;
            x += (Math.random() - 0.5) * (w * 0.08);
          }
          bolt.push(main);
          const branches = 2 + Math.floor(Math.random() * 2);
          for (let b = 0; b < branches; b++) {
            const idx = 3 + Math.floor(Math.random() * (steps - 6));
            const base = main[idx];
            const seg: { x: number; y: number }[] = [{ x: base.x, y: base.y }];
            let bx = base.x;
            let by = base.y;
            const dir = Math.random() < 0.5 ? -1 : 1;
            const bsteps = 4 + Math.floor(Math.random() * 4);
            for (let s = 0; s < bsteps; s++) {
              bx += dir * (10 + Math.random() * 32);
              by += 10 + Math.random() * 30;
              seg.push({ x: bx, y: by });
            }
            bolt.push(seg);
          }
          boltLife = 7;
          boltCooldown = 45 + Math.floor(Math.random() * 140);
        }
        if (boltLife > 0) {
          const intensity = boltLife / 7;
          ctx.fillStyle = `rgba(200, 220, 255, ${0.12 * intensity})`;
          ctx.fillRect(0, 0, w, h);
          ctx.save();
          ctx.strokeStyle = `rgba(235, 242, 255, ${0.9 * intensity})`;
          ctx.lineWidth = 2;
          ctx.lineJoin = "round";
          ctx.shadowBlur = 16;
          ctx.shadowColor = "rgba(150, 190, 255, 0.9)";
          for (const seg of bolt) {
            ctx.beginPath();
            seg.forEach((pt, i) =>
              i ? ctx.lineTo(pt.x, pt.y) : ctx.moveTo(pt.x, pt.y)
            );
            ctx.stroke();
          }
          ctx.restore();
          boltLife -= 1;
        }
      } else if (effect === "auroraWaves") {
        // Aurore polaire : rideaux de lumière colorée qui ondulent et se
        // superposent, façon aurores boréales.
        ctx.clearRect(0, 0, w, h);
        const bands = 4;
        for (let b = 0; b < bands; b++) {
          const hue = (t * 0.4 + b * 60) % 360;
          const baseY = h * (0.22 + b * 0.13);
          const amp = 24 + b * 10;
          ctx.beginPath();
          ctx.moveTo(0, baseY);
          for (let x = 0; x <= w; x += 12) {
            const y =
              baseY +
              Math.sin(x / 140 + t / 40 + b) * amp +
              Math.sin(x / 60 - t / 55 + b * 2) * (amp * 0.4);
            ctx.lineTo(x, y);
          }
          ctx.lineTo(w, baseY + 130);
          ctx.lineTo(0, baseY + 130);
          ctx.closePath();
          const grad = ctx.createLinearGradient(0, baseY - amp, 0, baseY + 130);
          grad.addColorStop(0, `hsla(${hue}, 90%, 65%, 0.26)`);
          grad.addColorStop(1, `hsla(${hue}, 90%, 65%, 0)`);
          ctx.fillStyle = grad;
          ctx.fill();
        }
      } else if (effect === "waves") {
        // Vagues : houle océanique en plusieurs couches qui défilent.
        ctx.clearRect(0, 0, w, h);
        const layers = 3;
        for (let l = 0; l < layers; l++) {
          const baseY = h - h * 0.1 - l * (h * 0.06);
          const amp = 10 + l * 6;
          const speed = t / (30 - l * 6);
          ctx.beginPath();
          ctx.moveTo(0, h);
          ctx.lineTo(0, baseY);
          for (let x = 0; x <= w; x += 10) {
            const y =
              baseY +
              Math.sin(x / 90 + speed + l) * amp +
              Math.sin(x / 40 - speed) * (amp * 0.3);
            ctx.lineTo(x, y);
          }
          ctx.lineTo(w, h);
          ctx.closePath();
          ctx.fillStyle = `hsla(205, 80%, ${45 + l * 6}%, ${0.18 + l * 0.12})`;
          ctx.fill();
        }
      } else if (effect === "dna") {
        // ADN : double hélice en rotation, brins cyan et magenta, barreaux.
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2;
        const amp = Math.min(w * 0.18, 120);
        const step = 26;
        for (let y = -10; y < h + 10; y += step) {
          const phase = y / 60 + t / 30;
          const x1 = cx + Math.sin(phase) * amp;
          const x2 = cx + Math.sin(phase + Math.PI) * amp;
          const d1 = (Math.cos(phase) + 1) / 2;
          const d2 = (Math.cos(phase + Math.PI) + 1) / 2;
          ctx.strokeStyle = "rgba(255,255,255,0.14)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();
          const node = (nx: number, depth: number, hue: number) => {
            ctx.globalAlpha = 0.4 + depth * 0.6;
            ctx.fillStyle = `hsl(${hue}, 85%, ${55 + depth * 15}%)`;
            ctx.beginPath();
            ctx.arc(nx, y, 2 + depth * 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          };
          node(x1, d1, 190);
          node(x2, d2, 330);
        }
      } else if (effect === "equalizer") {
        // Égaliseur : barres de spectre néon qui pulsent en bas de page.
        ctx.clearRect(0, 0, w, h);
        const n = eqBars.length;
        const gap = 3;
        const bw = (w - gap * (n + 1)) / n;
        for (let i = 0; i < n; i++) {
          const target =
            0.12 +
            0.88 * Math.abs(Math.sin(t / 18 + i * 0.6) * Math.cos(t / 30 + i));
          eqBars[i] += (target - eqBars[i]) * 0.2;
          const bh = eqBars[i] * h * 0.5;
          const x = gap + i * (bw + gap);
          const y = h - bh;
          const hue = (i / n) * 300 + t * 0.5;
          const grad = ctx.createLinearGradient(0, h, 0, y);
          grad.addColorStop(0, `hsla(${hue}, 90%, 55%, 0.9)`);
          grad.addColorStop(1, `hsla(${hue + 40}, 90%, 68%, 0.9)`);
          ctx.fillStyle = grad;
          ctx.shadowBlur = 12;
          ctx.shadowColor = `hsl(${hue}, 90%, 60%)`;
          ctx.fillRect(x, y, bw, bh);
        }
        ctx.shadowBlur = 0;
      } else if (effect === "mesh") {
        // Dégradé fluide : blobs pastel flous qui dérivent (esthétique
        // moderne façon Stripe/Linear).
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < 5; i++) {
          const hue = (t * 0.3 + i * 62) % 360;
          const bx = w * (0.5 + 0.42 * Math.sin(t / 90 + i * 1.7));
          const by = h * (0.5 + 0.42 * Math.cos(t / 110 + i * 2.3));
          const R = Math.min(w, h) * (0.5 + 0.15 * Math.sin(t / 70 + i));
          const g = ctx.createRadialGradient(bx, by, 0, bx, by, R);
          g.addColorStop(0, `hsla(${hue}, 85%, 68%, 0.28)`);
          g.addColorStop(1, `hsla(${hue}, 85%, 68%, 0)`);
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }
      } else if (effect === "silk") {
        // Soie : rubans translucides monochromes (couleur d'accent) qui
        // ondulent avec douceur.
        ctx.clearRect(0, 0, w, h);
        for (let r = 0; r < 5; r++) {
          const baseY = h * (0.16 + r * 0.16);
          const amp = 18 + r * 6;
          ctx.beginPath();
          ctx.moveTo(0, baseY);
          for (let x = 0; x <= w; x += 14) {
            const y =
              baseY +
              Math.sin(x / 160 + t / 50 + r) * amp +
              Math.sin(x / 80 - t / 70 + r) * (amp * 0.3);
            ctx.lineTo(x, y);
          }
          ctx.lineTo(w, baseY + 70);
          ctx.lineTo(0, baseY + 70);
          ctx.closePath();
          const g = ctx.createLinearGradient(0, baseY - amp, 0, baseY + 70);
          g.addColorStop(0, acc(0.16));
          g.addColorStop(1, acc(0));
          ctx.fillStyle = g;
          ctx.fill();
        }
      } else if (effect === "gradientWaves") {
        // Ondulation : bandes d'accent superposées qui glissent lentement.
        ctx.clearRect(0, 0, w, h);
        const bands = 5;
        for (let bnd = 0; bnd < bands; bnd++) {
          const baseY = (bnd / bands) * h;
          ctx.beginPath();
          ctx.moveTo(0, baseY);
          for (let x = 0; x <= w; x += 12) {
            const y = baseY + Math.sin(x / 120 + t / 45 + bnd * 0.8) * 20;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.fillStyle = acc(0.05 + (bnd / bands) * 0.05);
          ctx.fill();
        }
      } else if (effect === "dotGrid") {
        // Grille de points : trame tech qui dérive doucement, plus dense et
        // scintillante au centre (vignette).
        ctx.clearRect(0, 0, w, h);
        const gap = 26;
        const ox = (t * 0.15) % gap;
        const oy = (t * 0.1) % gap;
        for (let x = -gap; x < w + gap; x += gap) {
          for (let y = -gap; y < h + gap; y += gap) {
            const px = x + ox;
            const py = y + oy;
            const d = Math.hypot(px - w / 2, py - h / 2);
            const fade = Math.max(0, 1 - d / (Math.max(w, h) * 0.6));
            const tw = 0.5 + 0.5 * Math.sin(t / 30 + x * 0.05 + y * 0.05);
            ctx.fillStyle = acc(0.06 + fade * 0.32 * tw);
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (effect === "topography") {
        // Topographie : courbes de niveau concentriques ondulantes qui
        // s'étendent, façon carte topographique minimaliste.
        ctx.clearRect(0, 0, w, h);
        const cx = w / 2;
        const cy = h / 2;
        const rings = 16;
        const spacing = Math.max(w, h) / rings;
        ctx.lineWidth = 1.2;
        for (let i = 0; i < rings; i++) {
          const r = i * spacing + ((t * 0.4) % spacing);
          ctx.beginPath();
          for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
            const wob =
              Math.sin(a * 3 + i * 0.5 + t / 60) * 8 +
              Math.sin(a * 5 - t / 80) * 4;
            const rr = r + wob;
            const x = cx + Math.cos(a) * rr;
            const y = cy + Math.sin(a) * rr;
            if (a === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          const fade = 1 - r / Math.max(w, h);
          ctx.strokeStyle = acc(0.05 + Math.max(0, fade) * 0.22);
          ctx.stroke();
        }
      } else if (effect === "godRays") {
        // Rayons de lumière : faisceaux doux tombant du haut, additifs et
        // légèrement vacillants (rendu cinématographique).
        ctx.clearRect(0, 0, w, h);
        const ox = w * 0.5;
        const oy = -h * 0.15;
        const rays = 9;
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < rays; i++) {
          const ang =
            -Math.PI / 2 + (i - rays / 2) * 0.14 + Math.sin(t / 120 + i) * 0.02;
          const len = Math.hypot(w, h) * 1.2;
          const spread = 26;
          const ex = ox + Math.cos(ang) * len;
          const ey = oy + Math.sin(ang) * len;
          const perp = ang + Math.PI / 2;
          const dx = Math.cos(perp) * spread;
          const dy = Math.sin(perp) * spread;
          const flick = 0.1 + 0.08 * Math.abs(Math.sin(t / 40 + i));
          const g = ctx.createLinearGradient(ox, oy, ex, ey);
          g.addColorStop(0, acc(flick));
          g.addColorStop(1, acc(0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(ox - dx, oy - dy);
          ctx.lineTo(ox + dx, oy + dy);
          ctx.lineTo(ex + dx, ey + dy);
          ctx.lineTo(ex - dx, ey - dy);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      } else if (effect === "neonTubes") {
        // Tubes néon flexibles : longs rubans de silicone lumineux qui
        // serpentent lentement. Chacun est peint en trois passes — halo diffus,
        // gaine colorée, cœur incandescent — et scintille par à-coups comme un
        // vrai néon.
        ctx.clearRect(0, 0, w, h);
        const tubes = 5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (let k = 0; k < tubes; k++) {
          const hue = (k * 67 + t * 0.15) % 360;
          const baseY = h * (0.14 + k * 0.18);
          const amp = 26 + k * 9;
          const speed = t / (55 + k * 12);
          // Scintillement : brèves chutes d'intensité, aléatoires mais stables.
          const flick =
            0.82 + 0.18 * Math.sin(t / 3 + k * 5) * Math.sin(t / 17 + k);
          const trace = () => {
            ctx.beginPath();
            for (let x = -20; x <= w + 20; x += 10) {
              const y =
                baseY +
                Math.sin(x / 150 + speed + k) * amp +
                Math.sin(x / 63 - speed * 1.4 + k * 2) * (amp * 0.32);
              if (x === -20) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
          };
          ctx.save();
          // 1) halo diffus autour du tube
          ctx.globalCompositeOperation = "lighter";
          ctx.shadowBlur = 26;
          ctx.shadowColor = `hsl(${hue}, 100%, 60%)`;
          ctx.strokeStyle = `hsla(${hue}, 100%, 58%, ${0.28 * flick})`;
          ctx.lineWidth = 13;
          trace();
          ctx.stroke();
          // 2) gaine colorée
          ctx.shadowBlur = 14;
          ctx.strokeStyle = `hsla(${hue}, 100%, 62%, ${0.85 * flick})`;
          ctx.lineWidth = 6;
          trace();
          ctx.stroke();
          // 3) cœur incandescent
          ctx.shadowBlur = 6;
          ctx.shadowColor = `hsl(${hue}, 100%, 85%)`;
          ctx.strokeStyle = `hsla(${hue}, 100%, 92%, ${0.95 * flick})`;
          ctx.lineWidth = 1.8;
          trace();
          ctx.stroke();
          ctx.restore();
        }
      } else if (effect === "mist") {
        // Brume : nappes de brouillard douces qui glissent latéralement.
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < 6; i++) {
          const y = h * (0.15 + i * 0.14);
          const x = ((t * (0.3 + i * 0.1) + i * 200) % (w + 400)) - 200;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 260);
          g.addColorStop(0, `rgba(255,255,255,${0.05 + (i % 2) * 0.02})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h);
        }
      } else {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
          if (effect === "snow") {
            p.x += Math.sin(t / 60 + p.phase) * 0.4;
            p.y += p.vy * 0.7;
            ctx.fillStyle = "rgba(255,255,255,0.75)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
            ctx.fill();
          } else if (effect === "rain" || effect === "storm") {
            p.y += p.vy * (effect === "storm" ? 9 : 6);
            p.x += p.vx * (effect === "storm" ? 2 : 1);
            ctx.strokeStyle = "rgba(174, 194, 224, 0.5)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.vx * 2, p.y + 12);
            ctx.stroke();
          } else if (effect === "stars") {
            const alpha = 0.3 + 0.7 * Math.abs(Math.sin(t / 40 + p.phase));
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
          } else if (effect === "constellation") {
            // Constellation : étoiles qui dérivent lentement ; les lignes qui
            // les relient sont tracées après la boucle (voir plus bas).
            p.x += p.vx * 0.5;
            p.y += (p.vy - 1) * 0.5;
            const alpha = 0.55 + 0.45 * Math.abs(Math.sin(t / 55 + p.phase));
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.5 + 0.4, 0, Math.PI * 2);
            ctx.fill();
          } else if (effect === "sakura") {
            p.x += Math.sin(t / 50 + p.phase) * 0.8 + 0.3;
            p.y += p.vy * 0.5;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(t / 40 + p.phase);
            ctx.fillStyle = "rgba(255, 183, 197, 0.8)";
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 1.6, p.size, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (effect === "confetti") {
            p.y += p.vy * 2.2;
            p.x += Math.sin(t / 40 + p.phase) * 0.9;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.phase + t / 18);
            ctx.fillStyle = `hsl(${Math.floor(p.phase * 57) % 360}, 85%, 60%)`;
            ctx.fillRect(-p.size, -p.size * 1.6, p.size * 2, p.size * 3.2);
            ctx.restore();
          } else if (effect === "embers") {
            p.y -= (0.5 + p.vy) * 0.9;
            p.x += Math.sin(t / 50 + p.phase) * 0.5;
            const life = 0.35 + 0.65 * Math.abs(Math.sin(t / 55 + p.phase));
            ctx.save();
            ctx.shadowBlur = 9;
            ctx.shadowColor = accent;
            ctx.globalAlpha = life;
            ctx.fillStyle = accent;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (effect === "fireflies") {
            p.x += Math.sin(t / 60 + p.phase) * 0.6;
            p.y += Math.cos(t / 75 + p.phase) * 0.45;
            const glow = 0.15 + 0.85 * Math.abs(Math.sin(t / 30 + p.phase));
            ctx.save();
            ctx.shadowBlur = 12;
            ctx.shadowColor = accent;
            ctx.globalAlpha = glow;
            ctx.fillStyle = "#fff6b0";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.85, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (effect === "bubbles") {
            p.y -= p.vy * 0.9;
            p.x += Math.sin(t / 45 + p.phase) * 0.5;
            ctx.save();
            ctx.strokeStyle = "rgba(255,255,255,0.4)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
            ctx.stroke();
            // reflet
            ctx.fillStyle = "rgba(255,255,255,0.35)";
            ctx.beginPath();
            ctx.arc(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (effect === "leaves") {
            p.x += Math.sin(t / 40 + p.phase) * 1.1 + 0.4;
            p.y += p.vy * 0.6;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(t / 30 + p.phase);
            ctx.fillStyle = `hsla(${20 + Math.floor((p.phase * 57) % 30)}, 75%, 50%, 0.85)`;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 1.8, p.size * 0.9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (effect === "hearts") {
            p.y -= p.vy * 0.6;
            p.x += Math.sin(t / 55 + p.phase) * 0.6;
            const s = p.size * 1.6;
            const alpha = 0.35 + 0.5 * Math.abs(Math.sin(t / 40 + p.phase));
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = "#ff5d8f";
            ctx.beginPath();
            ctx.moveTo(0, s * 0.6);
            ctx.bezierCurveTo(-s, -s * 0.3, -s * 0.4, -s, 0, -s * 0.3);
            ctx.bezierCurveTo(s * 0.4, -s, s, -s * 0.3, 0, s * 0.6);
            ctx.fill();
            ctx.restore();
          } else if (effect === "emoji") {
            p.x += Math.sin(t / 55 + p.phase) * 0.5;
            p.y += p.vy * 1.1;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(Math.sin(t / 40 + p.phase) * 0.5);
            ctx.font = `${12 + p.size * 5}px serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(emojiChar, 0, 0);
            ctx.restore();
          } else if (effect === "meteors") {
            p.y += p.vy * 7;
            p.x -= p.vy * 5;
            const len = 34 + p.size * 8;
            const grad = ctx.createLinearGradient(p.x, p.y, p.x + len * 0.7, p.y - len);
            grad.addColorStop(0, "rgba(255,255,255,0.9)");
            grad.addColorStop(1, "rgba(255,255,255,0)");
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + len * 0.7, p.y - len);
            ctx.stroke();
          } else if (effect === "glitter") {
            // Paillettes : petits losanges scintillants (accent + doré) qui tombent.
            p.x += Math.sin(t / 50 + p.phase) * 0.3;
            p.y += p.vy * 0.5;
            const tw = 0.15 + 0.85 * Math.abs(Math.sin(t / 12 + p.phase));
            const s = p.size * 0.9;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(Math.PI / 4);
            ctx.globalAlpha = tw;
            ctx.fillStyle = p.phase > Math.PI ? "#ffd970" : accent;
            ctx.fillRect(-s / 2, -s / 2, s, s);
            ctx.restore();
          } else if (effect === "orbs") {
            // Orbes : boules lumineuses colorées qui flottent vers le haut.
            p.y -= p.vy * 0.5;
            p.x += Math.sin(t / 70 + p.phase) * 0.6;
            const glow = 0.2 + 0.5 * Math.abs(Math.sin(t / 50 + p.phase));
            const hue = Math.floor((p.phase * 57) % 360);
            ctx.save();
            ctx.globalAlpha = glow;
            ctx.shadowBlur = 18;
            ctx.shadowColor = `hsl(${hue}, 80%, 65%)`;
            ctx.fillStyle = `hsl(${hue}, 80%, 65%)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (effect === "starfall") {
            // Pluie d'étoiles : traits verticaux brillants qui tombent.
            p.y += p.vy * 3;
            p.x += p.vx * 0.5;
            const len = 8 + p.size * 4;
            const grad = ctx.createLinearGradient(p.x, p.y - len, p.x, p.y);
            grad.addColorStop(0, "rgba(255,255,255,0)");
            grad.addColorStop(1, "rgba(255,255,255,0.9)");
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - len);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            ctx.fillStyle = "rgba(255,255,255,0.95)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else if (effect === "phenix") {
            // Phénix : plume de feu qui s'élève (orange/or/rouge, lueur, braises).
            p.y -= (0.6 + p.vy) * 1.1;
            p.x += Math.sin(t / 40 + p.phase) * 0.9;
            const life = 0.3 + 0.7 * Math.abs(Math.sin(t / 45 + p.phase));
            const hue = 15 + Math.floor((p.phase * 20) % 40); // 15-55 : rouge→or
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;
            ctx.globalAlpha = life;
            ctx.fillStyle = `hsl(${hue}, 100%, 60%)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.95, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (effect === "galaxy") {
            // Galaxie : étoiles colorées en rotation lente autour du centre.
            const cx = w / 2;
            const cy = h / 2;
            const dx = p.x - cx;
            const dy = p.y - cy;
            const a = 0.004;
            p.x = cx + (dx * Math.cos(a) - dy * Math.sin(a));
            p.y = cy + (dx * Math.sin(a) + dy * Math.cos(a));
            const alpha = 0.3 + 0.7 * Math.abs(Math.sin(t / 40 + p.phase));
            const hue = Math.floor((p.phase * 57) % 360);
            ctx.fillStyle = `hsla(${hue}, 80%, 72%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
          } else if (effect === "diamonds") {
            // Diamants : gemmes scintillantes multicolores qui tombent.
            p.x += Math.sin(t / 50 + p.phase) * 0.3;
            p.y += p.vy * 0.8;
            const s = p.size * 1.3;
            const tw = 0.4 + 0.6 * Math.abs(Math.sin(t / 20 + p.phase));
            const hue = Math.floor((p.phase * 40) % 360);
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.globalAlpha = tw;
            ctx.fillStyle = `hsl(${hue}, 90%, 75%)`;
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.lineTo(s * 0.7, 0);
            ctx.lineTo(0, s);
            ctx.lineTo(-s * 0.7, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          } else if (effect === "hyperspace") {
            // Hyperespace : les étoiles filent depuis le centre en accélérant,
            // laissant une traînée orientée vers le point de fuite.
            const cx = w / 2;
            const cy = h / 2;
            const dx = p.x - cx;
            const dy = p.y - cy;
            const dist = Math.hypot(dx, dy) || 0.001;
            p.x += dx * 0.045;
            p.y += dy * 0.045;
            const alpha = Math.min(1, dist / (Math.min(w, h) * 0.5));
            ctx.strokeStyle = `rgba(255,255,255,${0.15 + alpha * 0.75})`;
            ctx.lineWidth = 0.6 + alpha * 1.6;
            ctx.beginPath();
            ctx.moveTo(cx + dx * 0.92, cy + dy * 0.92);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
            if (p.x < -30 || p.x > w + 30 || p.y < -30 || p.y > h + 30) {
              const a = Math.random() * Math.PI * 2;
              const rr = Math.random() * 24;
              p.x = cx + Math.cos(a) * rr;
              p.y = cy + Math.sin(a) * rr;
            }
          } else if (effect === "vortex") {
            // Vortex : les particules colorées spiralent vers le centre puis
            // ressurgissent en périphérie (tunnel tourbillonnant).
            const cx = w / 2;
            const cy = h / 2;
            const dx = p.x - cx;
            const dy = p.y - cy;
            let dist = Math.hypot(dx, dy) || 0.001;
            const ang = Math.atan2(dy, dx) + 0.02 + 1.4 / dist;
            dist -= 0.35;
            if (dist < 4) dist = 40 + Math.random() * Math.min(w, h) * 0.5;
            p.x = cx + Math.cos(ang) * dist;
            p.y = cy + Math.sin(ang) * dist;
            const hue = Math.floor((p.phase * 57) % 360);
            const alpha = 0.25 + 0.55 * Math.abs(Math.sin(t / 40 + p.phase));
            ctx.fillStyle = `hsla(${hue}, 80%, 68%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
          } else if (effect === "bokeh") {
            // Bokeh : larges halos colorés flous qui montent doucement, façon
            // flou d'arrière-plan photographique.
            p.y -= p.vy * 0.35;
            p.x += Math.sin(t / 90 + p.phase) * 0.4;
            const hue = Math.floor((p.phase * 57) % 360);
            const R = p.size * 6 + 8;
            const a = 0.1 + 0.1 * Math.abs(Math.sin(t / 70 + p.phase));
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R);
            grad.addColorStop(0, `hsla(${hue}, 80%, 72%, ${a})`);
            grad.addColorStop(1, `hsla(${hue}, 80%, 72%, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
            ctx.fill();
          } else if (effect === "lanterns") {
            // Lanternes : lampions chauds qui s'élèvent lentement en ondulant,
            // avec halo lumineux vacillant.
            p.y -= 0.3 + p.vy * 0.3;
            p.x += Math.sin(t / 80 + p.phase) * 0.5;
            const flick = 0.7 + 0.3 * Math.abs(Math.sin(t / 15 + p.phase));
            const s = p.size * 2 + 4;
            ctx.save();
            ctx.shadowBlur = 22;
            ctx.shadowColor = "rgba(255, 170, 60, 0.9)";
            ctx.globalAlpha = flick;
            ctx.fillStyle = "rgba(255, 185, 85, 0.95)";
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, s * 0.62, s * 0.82, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (effect === "goldDust") {
            // Poussière d'or : fines particules dorées scintillantes qui
            // tourbillonnent vers le haut.
            p.y -= (0.2 + p.vy * 0.5) * 0.6;
            p.x += Math.sin(t / 40 + p.phase) * 0.9;
            const tw = 0.2 + 0.8 * Math.abs(Math.sin(t / 10 + p.phase * 3));
            ctx.save();
            ctx.globalAlpha = tw;
            ctx.shadowBlur = 6;
            ctx.shadowColor = "#ffcf5a";
            ctx.fillStyle = "#ffe08a";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (effect === "butterflies") {
            // Papillons : ailes colorées qui battent (échelle modulée) le long
            // d'une trajectoire errante.
            p.x += Math.sin(t / 70 + p.phase) * 0.9 + 0.4;
            p.y += Math.cos(t / 55 + p.phase) * 0.7;
            const flap = Math.abs(Math.sin(t / 6 + p.phase));
            const s = p.size * 2 + 3;
            const hue = Math.floor((p.phase * 80) % 360);
            const wingW = s * (0.3 + 0.7 * flap);
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(Math.sin(t / 70 + p.phase) * 0.4);
            ctx.fillStyle = `hsla(${hue}, 85%, 66%, 0.9)`;
            ctx.beginPath();
            ctx.ellipse(-wingW * 0.6, 0, wingW, s, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(wingW * 0.6, 0, wingW, s, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(40, 30, 50, 0.9)";
            ctx.beginPath();
            ctx.ellipse(0, 0, s * 0.14, s * 0.9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (effect === "ripple") {
            // Ondes : anneaux concentriques qui s'étendent et s'estompent, comme
            // des gouttes sur l'eau ; réapparaissent ailleurs en fin de vie.
            if (p.life === undefined || p.life <= 0) {
              p.x = Math.random() * w;
              p.y = Math.random() * h;
              p.r = 0;
              p.life = 1;
              p.phase = Math.random() * Math.PI * 2;
            }
            p.r = (p.r ?? 0) + 0.9;
            p.life -= 0.011;
            const a = Math.max(0, p.life) * 0.5;
            ctx.strokeStyle = `rgba(255,255,255,${a})`;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r ?? 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = `rgba(255,255,255,${a * 0.5})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, (p.r ?? 0) * 0.6, 0, Math.PI * 2);
            ctx.stroke();
          } else if (effect === "blackhole") {
            // Trou noir : les particules spiralent vers le cœur en accélérant
            // et resurgissent en périphérie ; le cœur est dessiné après la
            // boucle (disque d'accrétion + horizon des événements).
            const cx = w / 2;
            const cy = h / 2;
            const dx = p.x - cx;
            const dy = p.y - cy;
            let dist = Math.hypot(dx, dy) || 0.001;
            const ang = Math.atan2(dy, dx) + 3 / dist;
            dist -= 0.6 + 60 / dist;
            const rmax = Math.hypot(w, h) / 2;
            if (dist < 18) {
              p.x = cx + Math.cos(Math.random() * Math.PI * 2) * rmax * (0.6 + Math.random() * 0.5);
              p.y = cy + Math.sin(Math.random() * Math.PI * 2) * rmax * (0.6 + Math.random() * 0.5);
            } else {
              p.x = cx + Math.cos(ang) * dist;
              p.y = cy + Math.sin(ang) * dist;
            }
            const near = 1 - Math.min(1, dist / rmax);
            ctx.fillStyle = `hsla(${25 + near * 25}, 100%, 60%, ${0.25 + near * 0.65})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
          } else if (effect === "jellyfish") {
            // Méduses : ombelles translucides qui pulsent et remontent, avec
            // des tentacules ondulants.
            p.y -= 0.3 + p.vy * 0.25;
            p.x += Math.sin(t / 70 + p.phase) * 0.5;
            const pulse = 0.5 + 0.5 * Math.sin(t / 22 + p.phase);
            const s = p.size * 3 + 8;
            const hue = Math.floor((p.phase * 57) % 360);
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.shadowBlur = 14;
            ctx.shadowColor = `hsl(${hue}, 80%, 65%)`;
            const bw = s * (0.8 + pulse * 0.25);
            const bh = s * (0.7 - pulse * 0.15);
            ctx.fillStyle = `hsla(${hue}, 80%, 72%, 0.5)`;
            ctx.beginPath();
            ctx.ellipse(0, 0, bw, bh, 0, Math.PI, 0);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = `hsla(${hue}, 80%, 78%, 0.4)`;
            ctx.lineWidth = 1.2;
            const tent = 5;
            for (let k = 0; k < tent; k++) {
              const tx = -bw * 0.6 + (k / (tent - 1)) * bw * 1.2;
              ctx.beginPath();
              ctx.moveTo(tx * 0.8, bh * 0.2);
              for (let seg = 1; seg <= 4; seg++) {
                const ty = bh * 0.2 + seg * (s * 0.5);
                const sway = Math.sin(t / 18 + p.phase + k + seg) * 4;
                ctx.lineTo(tx * 0.8 + sway, ty);
              }
              ctx.stroke();
            }
            ctx.restore();
          } else if (effect === "balloons") {
            // Ballons : baudruches colorées qui s'élèvent avec ficelle, nœud et
            // reflet.
            p.y -= 0.4 + p.vy * 0.3;
            p.x += Math.sin(t / 60 + p.phase) * 0.6;
            const s = p.size * 2.5 + 6;
            const hue = Math.floor((p.phase * 80) % 360);
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.strokeStyle = "rgba(255,255,255,0.25)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, s);
            ctx.quadraticCurveTo(
              Math.sin(t / 30 + p.phase) * 4,
              s + s * 0.9,
              Math.sin(t / 25 + p.phase) * 2,
              s + s * 1.6
            );
            ctx.stroke();
            ctx.fillStyle = `hsl(${hue}, 75%, 60%)`;
            ctx.beginPath();
            ctx.ellipse(0, 0, s * 0.8, s, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-2, s);
            ctx.lineTo(2, s);
            ctx.lineTo(0, s + 4);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.35)";
            ctx.beginPath();
            ctx.ellipse(-s * 0.3, -s * 0.35, s * 0.18, s * 0.28, -0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else if (effect === "pixels") {
            // Pixels : petits carrés rétro 8-bit scintillants qui tombent, alignés
            // sur une grille.
            p.y += p.vy * 0.9;
            p.x += Math.sin(t / 50 + p.phase) * 0.2;
            const grid = 6;
            const px = Math.round(p.x / grid) * grid;
            const py = Math.round(p.y / grid) * grid;
            const tw = 0.4 + 0.6 * Math.abs(Math.sin(t / 12 + p.phase));
            const hue = Math.floor((p.phase * 57) % 360);
            ctx.globalAlpha = tw;
            ctx.fillStyle = `hsl(${hue}, 85%, 62%)`;
            ctx.fillRect(px, py, grid - 1, grid - 1);
            ctx.globalAlpha = 1;
          }
          // Recyclage des particules : les braises/phénix remontent, les autres
          // tombent. La galaxie tourne en boucle : pas de recyclage.
          if (
            effect === "galaxy" ||
            effect === "hyperspace" ||
            effect === "vortex" ||
            effect === "ripple" ||
            effect === "blackhole"
          ) {
            // position gérée dans la branche de l'effet, rien à recycler ici
          } else {
            if (effect === "embers" || effect === "phenix") {
              if (p.y < -20) {
                p.y = h + 10;
                p.x = Math.random() * w;
              }
            } else if (p.y > h + 20) {
              p.y = -10;
              p.x = Math.random() * w;
            } else if (p.y < -20) {
              p.y = h + 10;
            }
            if (p.x > w + 20) p.x = -10;
            if (p.x < -20) p.x = w + 10;
          }
        }

        // Constellation : relier chaque paire d'étoiles proches par une ligne
        // dont l'opacité décroît avec la distance (réseau type ciel étoilé).
        if (effect === "constellation") {
          const maxDist = 130;
          ctx.lineWidth = 1;
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const a = particles[i];
              const b = particles[j];
              const dx = a.x - b.x;
              const dy = a.y - b.y;
              const dist = Math.hypot(dx, dy);
              if (dist < maxDist) {
                ctx.strokeStyle = `rgba(255,255,255,${0.2 * (1 - dist / maxDist)})`;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
              }
            }
          }
        }

        // Trou noir : cœur sombre + halo du disque d'accrétion, par-dessus les
        // particules qui semblent y disparaître.
        if (effect === "blackhole") {
          const cx = w / 2;
          const cy = h / 2;
          const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 62);
          core.addColorStop(0, "rgba(0,0,0,1)");
          core.addColorStop(0.62, "rgba(0,0,0,0.92)");
          core.addColorStop(0.85, "rgba(255,150,40,0.5)");
          core.addColorStop(1, "rgba(255,150,40,0)");
          ctx.fillStyle = core;
          ctx.beginPath();
          ctx.arc(cx, cy, 62, 0, Math.PI * 2);
          ctx.fill();
        }

        // Éclairs de l'orage : flash blanc bref et aléatoire.
        if (effect === "storm") {
          if (flash === 0 && Math.random() < 0.006) flash = 4;
          if (flash > 0) {
            ctx.fillStyle = `rgba(255,255,255,${0.05 * flash})`;
            ctx.fillRect(0, 0, w, h);
            flash -= 1;
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [effect, accent]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}

export default function EffectLayer({
  effect,
  accent,
  emojiChar,
}: {
  effect: EffectId;
  accent: string;
  emojiChar?: string;
}) {
  if (effect === "none") return null;

  if (effect === "plasma") {
    return (
      <div className="fx-plasma pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <style>{`.fx-plasma::before { background: radial-gradient(circle at 30% 30%, ${accent}, transparent 60%); } .fx-plasma::after { background: radial-gradient(circle at 70% 70%, ${accent}, transparent 55%); }`}</style>
      </div>
    );
  }

  if (effect === "aurora") {
    return (
      <div
        className="fx-aurora pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(115deg, transparent 0%, ${accent}55 30%, transparent 50%, ${accent}33 70%, transparent 100%)`,
        }}
        aria-hidden
      />
    );
  }

  if (effect === "nebula") {
    return (
      <div
        className="fx-aurora pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `radial-gradient(55% 55% at 22% 28%, ${accent}66, transparent 60%), radial-gradient(50% 50% at 80% 38%, #a855f755, transparent 60%), radial-gradient(65% 65% at 55% 82%, #6366f155, transparent 60%), radial-gradient(40% 40% at 40% 55%, #ec489944, transparent 60%)`,
        }}
        aria-hidden
      />
    );
  }

  if (effect === "glitch") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="fx-glitch absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,0.25) 2px 3px), linear-gradient(90deg, ${accent}22, transparent 30%, transparent 70%, #00ffff22)`,
          }}
        />
        <div
          className="fx-glitch-band absolute left-0 right-0 h-8 opacity-40"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}55, transparent)` }}
        />
      </div>
    );
  }

  if (effect === "vhs") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0 1px, transparent 1px 3px)",
          }}
        />
        <div
          className="fx-vhs-roll absolute left-0 right-0 h-16 opacity-25"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(255,255,255,0.35), transparent)",
          }}
        />
      </div>
    );
  }

  if (effect === "synthwave") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {/* Horizon lumineux */}
        <div
          className="absolute inset-x-0 bottom-[38%] h-40 opacity-50"
          style={{
            background: `radial-gradient(60% 100% at 50% 100%, ${accent}88, transparent 70%)`,
          }}
        />
        {/* Grille en perspective qui défile */}
        <div
          className="absolute inset-x-[-40%] bottom-0 h-[42%] opacity-45"
          style={{
            backgroundImage: `linear-gradient(${accent}66 1.5px, transparent 1.5px), linear-gradient(90deg, ${accent}66 1.5px, transparent 1.5px)`,
            backgroundSize: "48px 48px",
            transform: "perspective(260px) rotateX(62deg)",
            transformOrigin: "top center",
            maskImage: "linear-gradient(180deg, transparent, black 25%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent, black 25%)",
          }}
        />
      </div>
    );
  }

  if (effect === "smoke") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="fx-smoke absolute inset-[-15%] opacity-50"
          style={{
            backgroundImage: `radial-gradient(40% 40% at 30% 65%, ${accent}55, transparent 70%), radial-gradient(38% 38% at 70% 35%, rgba(210,210,230,0.28), transparent 72%), radial-gradient(30% 30% at 55% 55%, ${accent}33, transparent 70%)`,
          }}
        />
      </div>
    );
  }

  if (effect === "spotlight") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="fx-spotlight absolute inset-[-20%] opacity-45"
          style={{
            background: `conic-gradient(from 90deg at 50% -10%, transparent 0deg, ${accent}66 20deg, transparent 40deg, transparent 320deg, ${accent}66 340deg, transparent 360deg)`,
            maskImage: "linear-gradient(180deg, black, transparent 80%)",
            WebkitMaskImage: "linear-gradient(180deg, black, transparent 80%)",
          }}
        />
      </div>
    );
  }

  if (effect === "rainbow") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="fx-rainbow absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(115deg, #ff004c, #ff8a00, #ffe600, #00e07a, #00b3ff, #7a5cff, #ff004c)",
            backgroundSize: "300% 300%",
          }}
        />
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <CanvasEffect effect={effect} accent={accent} emojiChar={emojiChar} />
    </div>
  );
}
