"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchMe, getCachedMe } from "@/lib/me-client";
import {
  cardClass,
  inputClass,
  labelClass,
  pageTitleClass,
  pageSubtitleClass,
  primaryBtnClass,
  smallBtnClass,
} from "@/lib/ui";
import { LinkGroup, Profile, PublicUser, SavedProfileSlot, PLAN_LIMITS } from "@/lib/types";
import { newId } from "@/lib/slug";

type Tab = "password" | "schedule" | "groups";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(iso: string) {
  // datetime-local input expects "YYYY-MM-DDTHH:mm"
  return iso.slice(0, 16);
}

function toIso(local: string) {
  return local ? new Date(local).toISOString() : "";
}

// ─── section: Mot de passe ──────────────────────────────────────────────────

function PasswordSection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (p: Partial<Profile>) => Promise<void>;
}) {
  const [enabled, setEnabled] = useState(!!profile.pagePassword);
  const [pw, setPw] = useState(profile.pagePassword ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const save = async () => {
    setSaving(true);
    setMsg("");
    await onSave({ pagePassword: enabled ? pw.trim() || undefined : undefined });
    setMsg("Enregistré.");
    setSaving(false);
    setTimeout(() => setMsg(""), 2500);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Protéger la page par mot de passe</p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400">
            Les visiteurs devront saisir un mot de passe avant de voir ton profil.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEnabled((v) => !v)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${enabled ? "bg-indigo-500" : "bg-gray-200 dark:bg-zinc-700"}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>

      {enabled && (
        <div>
          <label className={labelClass}>Mot de passe</label>
          <input
            type="text"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Ex: monstreamofoff2024"
            className={inputClass}
            maxLength={64}
          />
          <p className="mt-1.5 text-[11px] text-gray-400 dark:text-zinc-500">
            Le mot de passe est visible en clair ici — évite un mot de passe important.
          </p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || (enabled && !pw.trim())}
          className={primaryBtnClass}
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        {msg && <span className="text-xs text-emerald-500">{msg}</span>}
      </div>
    </div>
  );
}

// ─── section: Pages programmées ─────────────────────────────────────────────

function ScheduleSection({
  slots,
  isPro,
}: {
  slots: SavedProfileSlot[];
  isPro: boolean;
}) {
  const [local, setLocal] = useState<SavedProfileSlot[]>(slots);
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState<Record<string, string>>({});

  const now = new Date();

  const save = async (slot: SavedProfileSlot) => {
    setSaving(slot.id);
    await fetch("/api/saved-profiles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: slot.id,
        scheduledAt: slot.scheduledAt || null,
        activeUntil: slot.activeUntil || null,
      }),
    });
    setSaving(null);
    setMsg((m) => ({ ...m, [slot.id]: "Enregistré." }));
    setTimeout(() => setMsg((m) => ({ ...m, [slot.id]: "" })), 2500);
  };

  const patch = (id: string, fields: Partial<SavedProfileSlot>) =>
    setLocal((s) => s.map((sl) => (sl.id === id ? { ...sl, ...fields } : sl)));

  if (!isPro) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 dark:border-zinc-700 px-5 py-8 text-center">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Fonctionnalité Pro / Elite</p>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mb-4">
          Les pages programmées nécessitent un plan Pro ou Elite.
        </p>
        <a href="/dashboard/premium" className="text-xs font-semibold text-indigo-500 hover:underline">
          Voir les plans →
        </a>
      </div>
    );
  }

  if (local.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        Aucune page sauvegardée. Sauvegarde d'abord une page depuis{" "}
        <a href="/dashboard/mapage" className="font-medium text-indigo-500 hover:underline">Ma page</a>.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray-500 dark:text-zinc-400">
        Définis quand chaque page sauvegardée doit s'activer automatiquement sur ton profil public.
        Une seule page peut être active à la fois (la première dont la plage correspond).
      </p>
      {local.map((slot) => {
        const isActive =
          slot.scheduledAt &&
          new Date(slot.scheduledAt) <= now &&
          (!slot.activeUntil || new Date(slot.activeUntil) > now);
        return (
          <div key={slot.id} className={`${cardClass} flex flex-col gap-4`}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{slot.name}</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500">
                  Sauvegardée le {new Date(slot.savedAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
              {isActive && (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-500">
                  Active maintenant
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Activer à partir du</label>
                <input
                  type="datetime-local"
                  value={slot.scheduledAt ? fmt(slot.scheduledAt) : ""}
                  onChange={(e) => patch(slot.id, { scheduledAt: e.target.value ? toIso(e.target.value) : undefined })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Désactiver à partir du (optionnel)</label>
                <input
                  type="datetime-local"
                  value={slot.activeUntil ? fmt(slot.activeUntil) : ""}
                  onChange={(e) => patch(slot.id, { activeUntil: e.target.value ? toIso(e.target.value) : undefined })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => save(slot)}
                disabled={saving === slot.id}
                className={primaryBtnClass}
              >
                {saving === slot.id ? "Enregistrement…" : "Appliquer"}
              </button>
              {slot.scheduledAt && (
                <button
                  type="button"
                  onClick={() => {
                    patch(slot.id, { scheduledAt: undefined, activeUntil: undefined });
                    save({ ...slot, scheduledAt: undefined, activeUntil: undefined });
                  }}
                  className={smallBtnClass}
                >
                  Retirer la programmation
                </button>
              )}
              {msg[slot.id] && <span className="text-xs text-emerald-500">{msg[slot.id]}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── section: Groupes de liens ──────────────────────────────────────────────

function GroupsSection({
  profile,
  onSave,
}: {
  profile: Profile;
  onSave: (p: Partial<Profile>) => Promise<void>;
}) {
  const [groups, setGroups] = useState<LinkGroup[]>(profile.linkGroups ?? []);
  const [links, setLinks] = useState(profile.links);
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const save = useCallback(
    async (g: LinkGroup[], l: typeof links) => {
      setSaving(true);
      setMsg("");
      await onSave({ linkGroups: g, links: l });
      setMsg("Enregistré.");
      setSaving(false);
      setTimeout(() => setMsg(""), 2500);
    },
    [onSave]
  );

  const addGroup = async () => {
    const label = newLabel.trim();
    if (!label) return;
    const g = [...groups, { id: newId(), label }];
    setGroups(g);
    setNewLabel("");
    await save(g, links);
  };

  const deleteGroup = async (id: string) => {
    const g = groups.filter((gr) => gr.id !== id);
    const l = links.map((lk) => (lk.groupId === id ? { ...lk, groupId: undefined } : lk));
    setGroups(g);
    setLinks(l);
    await save(g, l);
  };

  const renameGroup = async (id: string, label: string) => {
    const g = groups.map((gr) => (gr.id === id ? { ...gr, label } : gr));
    setGroups(g);
    setEditingId(null);
    await save(g, links);
  };

  const assignLink = async (linkId: string, groupId: string | null) => {
    const l = links.map((lk) =>
      lk.id === linkId ? { ...lk, groupId: groupId ?? undefined } : lk
    );
    setLinks(l);
    await save(groups, l);
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-gray-500 dark:text-zinc-400">
        Crée des groupes pour organiser tes liens en sections sur ta page publique.
      </p>

      {/* Existing groups */}
      {groups.length > 0 && (
        <div className="flex flex-col gap-3">
          {groups.map((group) => {
            const groupLinks = links.filter((l) => l.groupId === group.id);
            return (
              <div key={group.id} className={`${cardClass} flex flex-col gap-3`}>
                <div className="flex items-center gap-2">
                  {editingId === group.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const val = (e.currentTarget.elements.namedItem("label") as HTMLInputElement).value.trim();
                        if (val) renameGroup(group.id, val);
                      }}
                      className="flex flex-1 gap-2"
                    >
                      <input
                        name="label"
                        defaultValue={group.label}
                        autoFocus
                        className={`${inputClass} flex-1`}
                        maxLength={40}
                      />
                      <button type="submit" className={primaryBtnClass}>OK</button>
                      <button type="button" onClick={() => setEditingId(null)} className={smallBtnClass}>✕</button>
                    </form>
                  ) : (
                    <>
                      <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {group.label}
                      </span>
                      <button type="button" onClick={() => setEditingId(group.id)} className={smallBtnClass}>
                        Renommer
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteGroup(group.id)}
                        className="rounded-lg border border-red-200 dark:border-red-900 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-40"
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                </div>

                {/* Link assignment */}
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-500 dark:text-zinc-400">
                    Liens dans ce groupe ({groupLinks.length})
                  </p>
                  {links.length === 0 ? (
                    <p className="text-xs text-gray-400 dark:text-zinc-500">Aucun lien sur ta page.</p>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      {links.map((lk) => (
                        <label key={lk.id} className="flex cursor-pointer items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={lk.groupId === group.id}
                            onChange={(e) =>
                              assignLink(lk.id, e.target.checked ? group.id : null)
                            }
                            className="h-3.5 w-3.5 accent-indigo-500 rounded"
                          />
                          <span className="truncate text-xs text-gray-700 dark:text-zinc-200">
                            {lk.icon && <span className="mr-1">{lk.icon}</span>}
                            {lk.label}
                          </span>
                          {lk.groupId && lk.groupId !== group.id && (
                            <span className="ml-auto shrink-0 text-[10px] text-gray-400 dark:text-zinc-500">
                              ({groups.find((g) => g.id === lk.groupId)?.label ?? "autre groupe"})
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add group */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addGroup()}
          placeholder="Nom du groupe (ex: Socials, Gaming…)"
          className={`${inputClass} flex-1`}
          maxLength={40}
        />
        <button
          type="button"
          onClick={addGroup}
          disabled={saving || !newLabel.trim()}
          className={primaryBtnClass}
        >
          Ajouter
        </button>
      </div>

      {msg && <span className="text-xs text-emerald-500">{msg}</span>}
    </div>
  );
}

// ─── page principale ─────────────────────────────────────────────────────────

export default function AvancePage() {
  const router = useRouter();
  const cached = getCachedMe();
  const [user, setUser] = useState<PublicUser | null>(cached?.user ?? null);
  const [profile, setProfile] = useState<Profile | null>(cached?.profile ?? null);
  const [slots, setSlots] = useState<SavedProfileSlot[]>([]);
  const [tab, setTab] = useState<Tab>("password");

  useEffect(() => {
    let alive = true;
    fetchMe().then(({ me, unauthorized }) => {
      if (!alive) return;
      if (unauthorized) { router.push("/login"); return; }
      if (me) { setUser(me.user); setProfile(me.profile); }
    });
    fetch("/api/saved-profiles")
      .then((r) => r.json())
      .then((d) => { if (alive && d.slots) setSlots(d.slots); })
      .catch(() => {});
    return () => { alive = false; };
  }, [router]);

  const saveProfile = useCallback(async (patch: Partial<Profile>) => {
    if (!profile) return;
    const updated = { ...profile, ...patch };
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setProfile(updated);
  }, [profile]);

  if (!user || !profile) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="h-6 w-40 bg-gray-100 dark:bg-zinc-800 rounded-full animate-pulse" />
          <div className="h-48 bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const isPro = PLAN_LIMITS[user.plan].savedProfiles > 0;

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "password", label: "Mot de passe", icon: "🔒" },
    { id: "schedule", label: "Programmation", icon: "📅" },
    { id: "groups", label: "Groupes", icon: "🗂️" },
  ];

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={pageTitleClass}>Paramètres avancés</h1>
          <p className={pageSubtitleClass}>Mot de passe, programmation et organisation de tes liens.</p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all ${
                tab === t.id
                  ? "bg-white dark:bg-zinc-800 shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className={cardClass}
        >
          {tab === "password" && (
            <PasswordSection profile={profile} onSave={saveProfile} />
          )}
          {tab === "schedule" && (
            <ScheduleSection slots={slots} isPro={isPro} />
          )}
          {tab === "groups" && (
            <GroupsSection profile={profile} onSave={saveProfile} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
