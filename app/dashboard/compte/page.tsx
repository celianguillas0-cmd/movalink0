"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  cardClass,
  inputClass,
  labelClass,
  pageSubtitleClass,
  pageTitleClass,
  primaryBtnClass,
  smallBtnClass,
} from "@/lib/ui";
import {
  clearCachedMe,
  fetchMe,
  getCachedMe,
  setCachedMe,
} from "@/lib/me-client";
import { Plan, Profile, PublicUser } from "@/lib/types";

const PLAN_SUMMARY: Record<Plan, string> = {
  free: "5 liens · 5 jeux · 3 effets · Stats 7 jours",
  pro: "15 liens · 15 jeux · 6 effets · Stats 30 jours · Sans badge",
  elite: "50 liens · 50 jeux · 8 effets · Stats 1 an · Support prioritaire",
};

const PLAN_LABELS: Record<Plan, string> = {
  free: "Gratuit",
  pro: "Pro",
  elite: "Elite",
};

type Tab = "compte" | "parametres";

export default function ComptePage() {
  const router = useRouter();
  const cached = getCachedMe();
  const [user, setUser] = useState<PublicUser | null>(cached?.user ?? null);
  const [profile, setProfile] = useState<Profile | null>(
    cached?.profile ?? null
  );
  const [tab, setTab] = useState<Tab>("compte");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchMe().then(({ me, unauthorized }) => {
      if (!alive) return;
      if (unauthorized) {
        router.push("/login");
        return;
      }
      if (me) {
        setUser(me.user);
        setProfile(me.profile);
      }
    });
    return () => {
      alive = false;
    };
  }, [router]);

  const uploadAvatar = async (file: File) => {
    if (!profile) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload impossible.");
        return;
      }
      const updated = { ...profile, avatarUrl: data.url };
      const save = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (save.ok) {
        setProfile(updated);
        setCachedMe({ profile: updated });
        setMessage("Avatar mis à jour.");
      }
    } catch {
      setError("Upload impossible. Réessaie.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChanging(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setMessage("Mot de passe modifié.");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      setError("Connexion impossible. Réessaie.");
    } finally {
      setChanging(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearCachedMe();
    router.push("/");
  };

  const deleteAccount = async () => {
    setDeleting(true);
    const res = await fetch("/api/account", { method: "DELETE" });
    if (res.ok) {
      clearCachedMe();
      router.push("/login?deleted=1");
    } else {
      setDeleting(false);
      setError("Suppression impossible. Réessaie.");
    }
  };

  if (!user || !profile) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="h-6 w-32 bg-gray-100 dark:bg-zinc-800 rounded-full animate-pulse" />
          <div className="h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
          <div className="h-48 bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const initials = profile.displayName.slice(0, 2).toUpperCase();

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={pageTitleClass}>Compte</h1>
          <p className={pageSubtitleClass}>Gère tes informations et préférences.</p>
        </motion.div>

        {(message || error) && (
          <p
            className={`mb-4 rounded-lg border px-3.5 py-2.5 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
                : "border-gray-200 bg-white text-gray-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            }`}
          >
            {error || message}
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex bg-gray-100 dark:bg-zinc-800 rounded-xl p-1 mb-6"
        >
          {(["compte", "parametres"] as Tab[]).map((t) => (
            <motion.button
              key={t}
              onClick={() => setTab(t)}
              whileHover={{ scale: tab !== t ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all relative ${
                tab === t
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"
              }`}
            >
              {tab === t && (
                <motion.div
                  layoutId="compteTabBg"
                  className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-lg shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {t === "compte" ? "Mon compte" : "Paramètres"}
              </span>
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {tab === "compte" && (
            <motion.div
              key="compte"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`${cardClass} mb-4`}>
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100 dark:border-zinc-800">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadAvatar(f);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    title="Changer d'avatar"
                    className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-zinc-700"
                  >
                    {profile.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatarUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-gray-100 text-lg font-bold text-gray-400 dark:bg-zinc-800 dark:text-zinc-500">
                        {initials}
                      </span>
                    )}
                    {uploading && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] font-medium text-white">
                        ...
                      </span>
                    )}
                  </button>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {profile.displayName}
                    </p>
                    <p className="truncate text-xs text-gray-400 dark:text-zinc-500">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500">
                      movalink.vercel.app/{user.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Plan {PLAN_LABELS[user.plan]}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500">
                      {PLAN_SUMMARY[user.plan]}
                    </p>
                  </div>
                  {user.plan !== "elite" && (
                    <a
                      href="/dashboard/premium"
                      className="shrink-0 rounded-lg bg-zinc-900 dark:bg-white px-3 py-1.5 text-xs font-semibold text-white dark:text-zinc-900 transition-opacity hover:opacity-90"
                    >
                      Upgrade
                    </a>
                  )}
                </div>
              </div>

              <form onSubmit={changePassword} className={`${cardClass} flex flex-col gap-4`}>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Changer de mot de passe
                </p>
                <div>
                  <label htmlFor="currentPassword" className={labelClass}>
                    Mot de passe actuel
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className={labelClass}>
                    Nouveau mot de passe (8 caractères minimum)
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={changing}
                  className={`${smallBtnClass} self-start`}
                >
                  {changing ? "Modification..." : "Modifier"}
                </button>
              </form>
            </motion.div>
          )}

          {tab === "parametres" && (
            <motion.div
              key="parametres"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`${cardClass} mb-4`}>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Session
                </p>
                <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">
                  Connecté en tant que {user.email}
                </p>
                <button type="button" onClick={logout} className={`${smallBtnClass} mt-3`}>
                  Se déconnecter
                </button>
              </div>

              <div className="rounded-xl border border-red-200 bg-white p-5 dark:border-red-900 dark:bg-zinc-900">
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  Zone dangereuse
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-zinc-500">
                  Supprime ton compte, ta page publique et toutes tes données.
                  Action immédiate et irréversible (conforme RGPD).
                </p>
                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  className="mt-3 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                >
                  Supprimer mon compte
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {deleteOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
              onClick={() => setDeleteOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  Supprimer définitivement ton compte ?
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                  Ta page publique, tes liens, tes statistiques et toutes tes
                  données seront effacés immédiatement. Cette action est
                  irréversible.
                </p>
                <p className="mt-4 text-xs font-medium text-gray-500 dark:text-zinc-400">
                  Tape <span className="font-bold">SUPPRIMER</span> pour confirmer :
                </p>
                <input
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  className={`${inputClass} mt-1.5`}
                  placeholder="SUPPRIMER"
                />
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteOpen(false)}
                    className={`${smallBtnClass} flex-1 !py-2.5`}
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    disabled={deleteConfirm !== "SUPPRIMER" || deleting}
                    onClick={deleteAccount}
                    className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  >
                    {deleting ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
