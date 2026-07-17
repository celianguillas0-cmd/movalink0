// Fond signature façon rivtools : grille de points + pattern hexagonal
// avec dégradés indigo et amas d'hexagones concentriques dans les coins.

function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = ((-30 + i * 60) * Math.PI) / 180;
    pts.push(
      `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`
    );
  }
  return pts.join(" ");
}

function HexCluster({ cx, cy, radii }: { cx: number; cy: number; radii: number[] }) {
  const widths = [1.5, 1.2, 1, 0.9, 0.8];
  const opacities = [0.55, 0.65, 0.7, 0.75, 0.8];
  return (
    <>
      {radii.map((r, i) =>
        i === radii.length - 1 ? (
          <polygon
            key={r}
            points={hexPoints(cx, cy, r)}
            style={{ fill: "var(--hex-fill)", stroke: "var(--hex-stroke)" }}
            strokeWidth={widths[i] ?? 0.8}
            opacity={opacities[i] ?? 0.8}
          />
        ) : (
          <polygon
            key={r}
            points={hexPoints(cx, cy, r)}
            fill="none"
            style={{ stroke: "var(--hex-stroke)" }}
            strokeWidth={widths[i] ?? 1}
            opacity={opacities[i] ?? 0.7}
          />
        )
      )}
      <circle cx={cx} cy={cy} r="4" style={{ fill: "var(--hex-stroke)" }} opacity="0.9" />
    </>
  );
}

export default function HexBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden>
      <div className="dotgrid absolute inset-0" />
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="ml-hg" x="0" y="0" width="69.28" height="60" patternUnits="userSpaceOnUse">
            <polygon points="34.64,10 34.64,30 17.32,40 0,30 0,10 17.32,0" fill="none" strokeWidth="0.75" style={{ stroke: "var(--hex-stroke)" }} />
            <polygon points="69.28,10 69.28,30 51.96,40 34.64,30 34.64,10 51.96,0" fill="none" strokeWidth="0.75" style={{ stroke: "var(--hex-stroke)" }} />
            <polygon points="17.32,40 17.32,60 0,70 -17.32,60 -17.32,40 0,30" fill="none" strokeWidth="0.75" style={{ stroke: "var(--hex-stroke)" }} />
            <polygon points="51.96,40 51.96,60 34.64,70 17.32,60 17.32,40 34.64,30" fill="none" strokeWidth="0.75" style={{ stroke: "var(--hex-stroke)" }} />
            <polygon points="86.60,40 86.60,60 69.28,70 51.96,60 51.96,40 69.28,30" fill="none" strokeWidth="0.75" style={{ stroke: "var(--hex-stroke)" }} />
          </pattern>
          <radialGradient id="ml-gtr" cx="90%" cy="-5%" r="50%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.07)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)" />
          </radialGradient>
          <radialGradient id="ml-gbl" cx="0%" cy="105%" r="50%">
            <stop offset="0%" stopColor="rgba(99,102,241,0.06)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0)" />
          </radialGradient>
          <radialGradient id="ml-gc" cx="50%" cy="50%" r="40%">
            <stop offset="0%" stopColor="rgba(140,145,180,0.04)" />
            <stop offset="100%" stopColor="rgba(140,145,180,0)" />
          </radialGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#ml-hg)" />
        <rect width="1200" height="800" fill="url(#ml-gtr)" />
        <rect width="1200" height="800" fill="url(#ml-gbl)" />
        <rect width="1200" height="800" fill="url(#ml-gc)" />
        <HexCluster cx={1090} cy={52} radii={[130, 98, 68, 42, 20]} />
        <HexCluster cx={62} cy={752} radii={[105, 80, 55, 33, 16]} />
      </svg>
    </div>
  );
}
