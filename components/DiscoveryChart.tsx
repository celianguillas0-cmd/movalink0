"use client";

import { useEffect, useState } from "react";
import { DISCOVERY_OPTIONS } from "@/lib/types";

interface Stats {
  counts: Record<string, number>;
  others: { text: string; at: string }[];
}

// Palette catégorielle validée (dataviz) : 8 teintes + gris pour « Autre ».
// Couleur = entité (jamais le rang). Clair/sombre gérés en variables CSS.
const PALETTE_CSS = `
.dchart{--dc-1:#2a78d6;--dc-2:#eb6834;--dc-3:#1baf7a;--dc-4:#eda100;--dc-5:#e87ba4;--dc-6:#008300;--dc-7:#4a3aa7;--dc-8:#e34948;--dc-other:#9ca3af;--dc-surface:#ffffff;}
.dark .dchart{--dc-1:#3987e5;--dc-2:#d95926;--dc-3:#199e70;--dc-4:#c98500;--dc-5:#d55181;--dc-6:#008300;--dc-7:#9085e9;--dc-8:#e66767;--dc-other:#6b7280;--dc-surface:#171717;}
`;

function colorVar(key: string, index: number): string {
  return key === "other" ? "var(--dc-other)" : `var(--dc-${index + 1})`;
}

function arcPath(
  cx: number,
  cy: number,
  rO: number,
  rI: number,
  a0: number,
  a1: number
): string {
  const pt = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = pt(rO, a0);
  const [x1, y1] = pt(rO, a1);
  const [x2, y2] = pt(rI, a1);
  const [x3, y3] = pt(rI, a0);
  return `M${x0},${y0} A${rO},${rO} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${rI},${rI} 0 ${large} 0 ${x3},${y3} Z`;
}

export default function DiscoveryChart() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin/discovery")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setStats)
      .catch(() => setError(true));
  }, []);

  if (error || !stats) return null;

  // Parts dans l'ordre fixe des options (couleur = entité), non vides.
  const items = DISCOVERY_OPTIONS.map((o, i) => ({
    key: o.key,
    label: o.label,
    color: colorVar(o.key, i),
    count: stats.counts[o.key] ?? 0,
  })).filter((it) => it.count > 0);

  const total = items.reduce((s, it) => s + it.count, 0);

  const card: React.CSSProperties = {
    background: "var(--card-bg)",
    border: "1px solid var(--card-border)",
    borderRadius: 14,
    padding: 18,
    marginBottom: 28,
  };

  return (
    <div className="dchart" style={card}>
      <style>{PALETTE_CSS}</style>
      <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 2px" }}>
        Comment ils ont découvert Movalink
      </p>
      <p style={{ fontSize: 12, color: "var(--foreground-muted)", margin: "0 0 16px" }}>
        {total} réponse{total > 1 ? "s" : ""} au sondage
      </p>

      {total === 0 ? (
        <p style={{ fontSize: 13, color: "var(--foreground-muted)", margin: 0 }}>
          Aucune réponse pour l&apos;instant.
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "center",
          }}
        >
          {/* Camembert (donut) */}
          <svg
            width={190}
            height={190}
            viewBox="0 0 190 190"
            role="img"
            aria-label="Répartition des sources de découverte"
            style={{ flexShrink: 0 }}
          >
            {(() => {
              const cx = 95;
              const cy = 95;
              const rO = 88;
              const rI = 52;
              let acc = -Math.PI / 2;
              const single = items.length === 1;
              return items.map((it) => {
                const frac = it.count / total;
                const a0 = acc;
                const a1 = acc + frac * Math.PI * 2;
                acc = a1;
                if (single) {
                  // Anneau plein : deux demi-arcs pour éviter a0==a1.
                  return (
                    <g key={it.key}>
                      <path d={arcPath(cx, cy, rO, rI, -Math.PI / 2, Math.PI / 2)} fill={it.color} />
                      <path d={arcPath(cx, cy, rO, rI, Math.PI / 2, (3 * Math.PI) / 2)} fill={it.color} />
                    </g>
                  );
                }
                const mid = (a0 + a1) / 2;
                const lr = (rO + rI) / 2;
                const lx = cx + lr * Math.cos(mid);
                const ly = cy + lr * Math.sin(mid);
                const pct = Math.round(frac * 100);
                return (
                  <g key={it.key}>
                    <path
                      d={arcPath(cx, cy, rO, rI, a0, a1)}
                      fill={it.color}
                      stroke="var(--dc-surface)"
                      strokeWidth={2}
                    />
                    {frac >= 0.08 && (
                      <text
                        x={lx}
                        y={ly}
                        fill="#fff"
                        fontSize={11}
                        fontWeight={700}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {pct}%
                      </text>
                    )}
                  </g>
                );
              });
            })()}
            <text
              x={95}
              y={88}
              textAnchor="middle"
              fontSize={26}
              fontWeight={800}
              fill="var(--foreground)"
            >
              {total}
            </text>
            <text
              x={95}
              y={108}
              textAnchor="middle"
              fontSize={11}
              fill="var(--foreground-muted)"
            >
              réponses
            </text>
          </svg>

          {/* Légende (sert aussi de « table view » : identité jamais par couleur seule) */}
          <ul style={{ listStyle: "none", margin: 0, padding: 0, minWidth: 200, flex: 1 }}>
            {items
              .slice()
              .sort((a, b) => b.count - a.count)
              .map((it) => {
                const pct = Math.round((it.count / total) * 100);
                return (
                  <li
                    key={it.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "4px 0",
                      fontSize: 13,
                    }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        background: it.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1 }}>{it.label}</span>
                    <span style={{ color: "var(--foreground-muted)", fontVariantNumeric: "tabular-nums" }}>
                      {it.count} · {pct}%
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
      )}

      {/* Précisions libres « Autre » */}
      {stats.others.length > 0 && (
        <div style={{ marginTop: 18, borderTop: "1px solid var(--card-border)", paddingTop: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 600, margin: "0 0 8px" }}>
            Précisions « Autre » ({stats.others.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
            {stats.others.map((o, i) => (
              <div key={i} style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                <span style={{ color: "var(--foreground)" }}>“{o.text}”</span>{" "}
                — {new Date(o.at).toLocaleDateString("fr-FR")}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
