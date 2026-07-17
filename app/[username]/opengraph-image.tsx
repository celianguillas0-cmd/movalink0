import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/store";
import { RESERVED_USERNAMES } from "@/lib/slug";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Profil Movalink";

// Image de partage (Discord, X, WhatsApp...) générée à partir du profil :
// avatar, pseudo et couleur d'accent. C'est la vitrine de chaque lien partagé.
export default async function OgImage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username: raw } = await params;
  const username = decodeURIComponent(raw).toLowerCase();
  const profile = RESERVED_USERNAMES.has(username)
    ? null
    : await getProfile(username).catch(() => null);

  const accent = profile?.theme.accent ?? "#6366f1";
  const displayName = profile?.displayName ?? "Movalink";
  const initial = displayName.slice(0, 1).toUpperCase();

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
          background: `radial-gradient(ellipse at top, ${accent}33, #09090b 65%)`,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {profile?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt=""
            width={160}
            height={160}
            style={{
              borderRadius: 9999,
              border: `6px solid ${accent}`,
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: 9999,
              border: `6px solid ${accent}`,
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 72,
              fontWeight: 700,
            }}
          >
            {initial}
          </div>
        )}
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 28 }}>
          {displayName}
        </div>
        {profile && (
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
            {`@${profile.username}`}
          </div>
        )}
        {profile?.bio ? (
          <div
            style={{
              fontSize: 26,
              color: "rgba(255,255,255,0.75)",
              marginTop: 18,
              maxWidth: 820,
              textAlign: "center",
            }}
          >
            {profile.bio.slice(0, 90)}
          </div>
        ) : null}
        <div
          style={{
            position: "absolute",
            bottom: 34,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              background: "#ffffff",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 100 100" fill="#09090b">
              <path d="M0 0L26 0L50 32L74 0L100 0L50 66Z" />
              <path d="M0 8L26 42L26 100L0 100Z" />
              <path d="M100 8L74 42L74 100L100 100Z" />
            </svg>
          </div>
          {`movalink.vercel.app${profile ? `/${profile.username}` : ""}`}
        </div>
      </div>
    ),
    size
  );
}
