"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plan } from "@/lib/types";

const PLAN_LABELS: Record<Plan, string> = { free: "Gratuit", pro: "Pro", elite: "Elite" };
const PLAN_ACCENT: Record<Plan, string> = { free: "#71717a", pro: "#818cf8", elite: "#eab308" };
const PLAN_BG: Record<Plan, string> = {
  free: "rgba(113,113,122,0.12)",
  pro: "rgba(129,140,248,0.12)",
  elite: "rgba(234,179,8,0.12)",
};

interface SavedSlot { id: string; name: string; savedAt: string }
interface FoundUser {
  user: { id: string; email: string; username: string; plan: Plan; isAdmin?: boolean; isBanned?: boolean; createdAt: string };
  profile: { displayName: string; avatarUrl?: string } | null;
  stats: { totalViews: number; totalClicks: number };
  savedSlots: SavedSlot[];
}
interface GlobalStats { total: number; free: number; pro: number; elite: number }
interface UserEntry { id: string; username: string; email: string; plan: Plan; createdAt: string; isBanned?: boolean }

const STAT_CARDS = [
  { key: "total" as const, label: "Utilisateurs", icon: "👥", color: "var(--accent)" },
  { key: "free" as const, label: "Gratuit", icon: "🆓", color: "#71717a" },
  { key: "pro" as const, label: "Pro", icon: "⚡", color: "#818cf8" },
  { key: "elite" as const, label: "Elite", icon: "👑", color: "#eab308" },
];

export default function AdminPage() {
  const router = useRouter();
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [found, setFound] = useState<FoundUser | null>(null);
  const [searchError, setSearchError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [userList, setUserList] = useState<UserEntry[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [planFilter, setPlanFilter] = useState<Plan | "all">("all");

  async function loadStats() {
    setStatsLoading(true);
    const r = await fetch("/api/admin/stats");
    if (r.status === 403) { router.push("/dashboard"); return; }
    if (r.ok) setGlobalStats(await r.json());
    setStatsLoading(false);
  }

  async function search() {
    setSearchError(""); setFound(null); setSaveMsg(null);
    if (!emailInput.trim()) return;
    setSearching(true);
    const r = await fetch(`/api/admin/user?email=${encodeURIComponent(emailInput.trim())}`);
    if (r.status === 403) { router.push("/dashboard"); return; }
    if (r.status === 404) { setSearchError("Aucun utilisateur trouvé avec cet email."); setSearching(false); return; }
    if (!r.ok) { setSearchError("Erreur serveur."); setSearching(false); return; }
    setFound(await r.json());
    setSearching(false);
  }

  async function changePlan(plan: Plan) {
    if (!found) return;
    setSaving(true); setSaveMsg(null);
    const r = await fetch("/api/admin/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: found.user.email, plan }),
    });
    const data = await r.json();
    if (r.ok) {
      setFound((f) => f ? { ...f, user: data.user } : f);
      setSaveMsg({ text: `Plan mis à jour → ${PLAN_LABELS[plan]}`, ok: true });
      loadStats();
    } else setSaveMsg({ text: data.error ?? "Erreur.", ok: false });
    setSaving(false);
  }

  async function toggleAdmin() {
    if (!found) return;
    setSaving(true); setSaveMsg(null);
    const r = await fetch("/api/admin/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: found.user.email, isAdmin: !found.user.isAdmin }),
    });
    const data = await r.json();
    if (r.ok) {
      setFound((f) => f ? { ...f, user: data.user } : f);
      setSaveMsg({ text: data.user.isAdmin ? "Accès admin accordé." : "Accès admin retiré.", ok: true });
    } else setSaveMsg({ text: data.error ?? "Erreur.", ok: false });
    setSaving(false);
  }

  async function toggleBan() {
    if (!found) return;
    setSaving(true); setSaveMsg(null);
    const r = await fetch("/api/admin/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: found.user.email, isBanned: !found.user.isBanned }),
    });
    const data = await r.json();
    if (r.ok) {
      setFound((f) => f ? { ...f, user: data.user } : f);
      setUserList((l) => l.map((u) => u.id === data.user.id ? { ...u, isBanned: data.user.isBanned } : u));
      setSaveMsg({ text: data.user.isBanned ? "Compte suspendu." : "Suspension levée.", ok: !data.user.isBanned });
    } else setSaveMsg({ text: data.error ?? "Erreur.", ok: false });
    setSaving(false);
  }

  async function loadUserList() {
    setListLoading(true);
    const r = await fetch("/api/admin/users");
    if (r.ok) setUserList((await r.json()).users);
    setListLoading(false);
  }

  useEffect(() => { loadStats(); loadUserList(); }, []);

  const initials = (found?.profile?.displayName ?? found?.user.username ?? "?").slice(0, 2).toUpperCase();

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "36px 20px 60px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: "rgba(99,102,241,0.12)",
          border: "1px solid rgba(99,102,241,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>⚙️</div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Panneau Admin</h1>
          <p style={{ fontSize: 12, color: "var(--foreground-muted)", margin: 0 }}>Accès restreint</p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 28 }}>
        {STAT_CARDS.map((s) => (
          <div key={s.key} style={{
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: 14,
            padding: "16px 14px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 10, right: 12,
              fontSize: 18, opacity: 0.3,
            }}>{s.icon}</div>
            <p style={{ fontSize: 28, fontWeight: 800, margin: "0 0 2px", color: s.color, lineHeight: 1 }}>
              {statsLoading ? <span style={{ opacity: 0.3 }}>—</span> : (globalStats?.[s.key] ?? 0)}
            </p>
            <p style={{ fontSize: 11, color: "var(--foreground-muted)", margin: 0, fontWeight: 500 }}>{s.label}</p>
            {/* Bottom accent line */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: s.color, opacity: 0.3 }} />
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: 16,
        padding: "20px",
        marginBottom: 16,
      }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground-muted)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Rechercher
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4, fontSize: 14 }}>🔍</span>
            <input
              style={{
                width: "100%",
                padding: "10px 14px 10px 36px",
                background: "var(--input-bg)",
                border: "1px solid var(--card-border)",
                borderRadius: 10,
                fontSize: 13,
                color: "var(--foreground)",
                outline: "none",
                boxSizing: "border-box",
              }}
              type="email"
              placeholder="email@exemple.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
          </div>
          <button
            onClick={search}
            disabled={searching}
            style={{
              padding: "10px 20px",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: searching ? "wait" : "pointer",
              whiteSpace: "nowrap",
              opacity: searching ? 0.7 : 1,
            }}
          >
            {searching ? "…" : "Chercher"}
          </button>
        </div>
        {searchError && (
          <div style={{
            marginTop: 10, padding: "8px 12px",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8, fontSize: 12, color: "#ef4444",
          }}>
            {searchError}
          </div>
        )}
      </div>

      {/* Liste des utilisateurs */}
      <div style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 16,
      }}>
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--card-border)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground-muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Tous les profils
            </p>
            <p style={{ fontSize: 11, color: "var(--foreground-muted)", margin: "2px 0 0", opacity: 0.6 }}>
              Comptes créés depuis le déploiement de l'index
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["all", "free", "pro", "elite"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setPlanFilter(f)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 8,
                  border: `1px solid ${planFilter === f ? (f === "all" ? "var(--accent)" : PLAN_ACCENT[f as Plan]) : "var(--card-border)"}`,
                  background: planFilter === f ? (f === "all" ? "rgba(99,102,241,0.12)" : PLAN_BG[f as Plan]) : "transparent",
                  color: planFilter === f ? (f === "all" ? "var(--accent)" : PLAN_ACCENT[f as Plan]) : "var(--foreground-muted)",
                  fontSize: 11, fontWeight: 600, cursor: "pointer",
                }}
              >
                {f === "all" ? "Tous" : PLAN_LABELS[f as Plan]}
              </button>
            ))}
          </div>
        </div>

        {listLoading ? (
          <div style={{ padding: "24px", textAlign: "center", color: "var(--foreground-muted)", fontSize: 13 }}>
            Chargement…
          </div>
        ) : userList.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", color: "var(--foreground-muted)", fontSize: 13 }}>
            Aucun utilisateur indexé — les nouveaux comptes apparaîtront ici.
          </div>
        ) : (
          <div style={{ maxHeight: 380, overflowY: "auto" }}>
            {userList
              .filter((u) => planFilter === "all" || u.plan === planFilter)
              .map((u, i, arr) => (
                <div
                  key={u.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "11px 20px",
                    borderBottom: i < arr.length - 1 ? "1px solid var(--card-border)" : "none",
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "var(--nav-btn-bg)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                  }}>
                    {u.username.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      @{u.username}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--foreground-muted)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {u.email}
                    </p>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                    background: PLAN_BG[u.plan], color: PLAN_ACCENT[u.plan],
                    border: `1px solid ${PLAN_ACCENT[u.plan]}40`,
                    textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0,
                  }}>
                    {PLAN_LABELS[u.plan]}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--foreground-muted)", flexShrink: 0 }}>
                    {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                  <button
                    onClick={() => { setEmailInput(u.email); }}
                    style={{
                      padding: "4px 10px", borderRadius: 7,
                      border: "1px solid var(--card-border)",
                      background: "transparent", color: "var(--foreground-muted)",
                      fontSize: 11, cursor: "pointer", flexShrink: 0,
                    }}
                  >
                    Gérer
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* User result */}
      {found && (
        <div style={{
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: 16,
          overflow: "hidden",
        }}>
          {/* User header */}
          <div style={{
            padding: "20px",
            borderBottom: "1px solid var(--card-border)",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              background: "var(--nav-btn-bg)",
              flexShrink: 0, overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 700,
              border: "2px solid var(--card-border)",
            }}>
              {found.profile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={found.profile.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>
                  {found.profile?.displayName ?? found.user.username}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                  background: PLAN_BG[found.user.plan],
                  color: PLAN_ACCENT[found.user.plan],
                  border: `1px solid ${PLAN_ACCENT[found.user.plan]}40`,
                  textTransform: "uppercase", letterSpacing: "0.05em",
                }}>
                  {PLAN_LABELS[found.user.plan]}
                </span>
                {found.user.isAdmin && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                    background: "rgba(99,102,241,0.12)", color: "#818cf8",
                    border: "1px solid rgba(99,102,241,0.25)",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>Admin</span>
                )}
                {found.user.isBanned && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                    background: "rgba(239,68,68,0.12)", color: "#ef4444",
                    border: "1px solid rgba(239,68,68,0.25)",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>Banni</span>
                )}
              </div>
              <p style={{ fontSize: 12, color: "var(--foreground-muted)", margin: "3px 0 0" }}>
                @{found.user.username} · {found.user.email}
              </p>
            </div>
            <a
              href={`/${found.user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12, padding: "7px 14px",
                border: "1px solid var(--card-border)",
                borderRadius: 8, color: "var(--foreground-muted)",
                textDecoration: "none", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              Page <span style={{ opacity: 0.6 }}>↗</span>
            </a>
          </div>

          {/* Mini stats */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3,1fr)",
            borderBottom: "1px solid var(--card-border)",
          }}>
            {[
              { icon: "👁", label: "Vues", value: found.stats.totalViews },
              { icon: "🖱", label: "Clics", value: found.stats.totalClicks },
              { icon: "📅", label: "Inscrit", value: new Date(found.user.createdAt).toLocaleDateString("fr-FR") },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "14px 16px",
                borderRight: i < 2 ? "1px solid var(--card-border)" : "none",
                textAlign: "center",
              }}>
                <p style={{ fontSize: 16, fontWeight: 700, margin: "0 0 2px" }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "var(--foreground-muted)", margin: 0 }}>{s.icon} {s.label}</p>
              </div>
            ))}
          </div>

          {/* Plan selector */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--card-border)" }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--foreground-muted)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Changer le plan
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {(["free", "pro", "elite"] as Plan[]).map((p) => {
                const active = found.user.plan === p;
                return (
                  <button
                    key={p}
                    disabled={saving || active}
                    onClick={() => changePlan(p)}
                    style={{
                      flex: 1,
                      padding: "9px 0",
                      background: active ? PLAN_BG[p] : "transparent",
                      border: `1.5px solid ${active ? PLAN_ACCENT[p] : "var(--card-border)"}`,
                      borderRadius: 10,
                      fontSize: 12, fontWeight: 700,
                      color: active ? PLAN_ACCENT[p] : "var(--foreground-muted)",
                      cursor: active ? "default" : "pointer",
                      transition: "all .15s",
                    }}
                  >
                    {PLAN_LABELS[p]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ban toggle */}
          <div style={{
            padding: "14px 20px", borderBottom: "1px solid var(--card-border)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: found.user.isBanned ? "#ef4444" : undefined }}>
                Suspension du compte
              </p>
              <p style={{ fontSize: 12, color: "var(--foreground-muted)", margin: "2px 0 0" }}>
                Bloque la connexion immédiatement
              </p>
            </div>
            <button disabled={saving} onClick={toggleBan} style={{
              width: 48, height: 26, borderRadius: 13, border: "none",
              background: found.user.isBanned ? "#ef4444" : "rgba(113,113,122,0.3)",
              cursor: saving ? "wait" : "pointer", position: "relative", transition: "background .2s", flexShrink: 0,
            }}>
              <span style={{
                position: "absolute", top: 3, left: found.user.isBanned ? 25 : 3,
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left .2s",
              }} />
            </button>
          </div>

          {/* Admin toggle */}
          <div style={{
            padding: "14px 20px",
            borderBottom: found.savedSlots?.length > 0 ? "1px solid var(--card-border)" : "none",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Accès administrateur</p>
              <p style={{ fontSize: 12, color: "var(--foreground-muted)", margin: "2px 0 0" }}>
                Accès au panneau admin
              </p>
            </div>
            <button disabled={saving} onClick={toggleAdmin} style={{
              width: 48, height: 26, borderRadius: 13, border: "none",
              background: found.user.isAdmin ? "var(--accent)" : "rgba(113,113,122,0.3)",
              cursor: saving ? "wait" : "pointer", position: "relative", transition: "background .2s", flexShrink: 0,
            }}>
              <span style={{
                position: "absolute", top: 3, left: found.user.isAdmin ? 25 : 3,
                width: 20, height: 20, borderRadius: "50%", background: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left .2s",
              }} />
            </button>
          </div>

          {/* Pages sauvegardées */}
          {found.savedSlots?.length > 0 && (
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--card-border)" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--foreground-muted)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Pages sauvegardées ({found.savedSlots.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {found.savedSlots.map((slot) => (
                  <div key={slot.id} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 12px", borderRadius: 8,
                    background: "var(--input-bg)", border: "1px solid var(--card-border)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13 }}>💾</span>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{slot.name || "Sans nom"}</span>
                    </div>
                    <span style={{ fontSize: 11, color: "var(--foreground-muted)" }}>
                      {new Date(slot.savedAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save message */}
          {saveMsg && (
            <div style={{
              margin: "0 20px 16px",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 12,
              background: saveMsg.ok ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${saveMsg.ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
              color: saveMsg.ok ? "#22c55e" : "#ef4444",
            }}>
              {saveMsg.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
