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

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const counts: Partial<Record<EffectId, number>> = {
        stars: 90,
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
      };
      const count = counts[effect] ?? 110;
      particles = makeParticles(count, canvas.width, canvas.height);
      columns = Array.from(
        { length: Math.ceil(canvas.width / 16) },
        () => Math.random() * canvas.height
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
          }
          // Recyclage des particules : les braises remontent, les autres tombent.
          if (effect === "embers") {
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

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <CanvasEffect effect={effect} accent={accent} emojiChar={emojiChar} />
    </div>
  );
}
