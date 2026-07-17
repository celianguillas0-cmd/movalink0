import { ImageResponse } from "next/og";

// Icône Movalink : carré sombre plein cadre (compatible "maskable"),
// marque "M" + petit wordmark "movalink" dessous, comme le logo officiel.
// Le texte n'est ajouté qu'à partir de 96px : en dessous (favicon 32px),
// il serait illisible.
export function movalinkIcon(size: number, rounded = 0) {
  const withText = size >= 96;
  const markSize = Math.round(size * (withText ? 0.4 : 0.52));
  const fontSize = Math.max(10, Math.round(size * 0.082));
  const letterSpacing = Math.round(fontSize * 0.32);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090b",
          borderRadius: rounded,
          gap: Math.round(size * 0.055),
        }}
      >
        <svg width={markSize} height={markSize} viewBox="0 0 100 100" fill="#ffffff">
          <path d="M0 0L26 0L50 32L74 0L100 0L50 66Z" />
          <path d="M0 8L26 42L26 100L0 100Z" />
          <path d="M100 8L74 42L74 100L100 100Z" />
        </svg>
        {withText && (
          <div
            style={{
              fontSize,
              letterSpacing,
              // Compense l'espacement ajouté après la dernière lettre
              paddingLeft: letterSpacing,
              color: "#ffffff",
              fontWeight: 500,
            }}
          >
            movalink
          </div>
        )}
      </div>
    ),
    { width: size, height: size }
  );
}
