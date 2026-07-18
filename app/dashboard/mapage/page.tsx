"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ProfileView from "@/components/ProfileView";
import DecorationEditor from "@/components/DecorationEditor";
import { SOCIAL_LABELS } from "@/components/Icons";
import {
  cardClass,
  inputClass,
  labelClass,
  pageSubtitleClass,
  pageTitleClass,
  primaryBtnClass,
  smallBtnClass,
} from "@/lib/ui";
import { newId } from "@/lib/slug";
import { fetchMe, getCachedMe, setCachedMe } from "@/lib/me-client";
import { presetTheme, THEME_PRESETS } from "@/lib/presets";
import {
  ACCENT_PRESETS,
  AVATAR_FRAME_LABELS,
  AVATAR_SHAPE_LABELS,
  AvatarFrameId,
  AvatarShape,
  BG_TYPE_LABELS,
  BgType,
  BUTTON_STYLE_LABELS,
  ButtonStyleId,
  CARD_ALIGN_LABELS,
  CARD_INTRO_LABELS,
  CardAlign,
  CardIntro,
  CURSOR_LABELS,
  CursorId,
  EFFECT_LABELS,
  EffectId,
  FONT_META,
  FontId,
  FULLCUSTOM_DEFAULTS,
  LAYOUT_DEFAULTS,
  LinkGroup,
  NAME_EFFECT_LABELS,
  NameEffect,
  PLAN_LIMITS,
  PlanLimits,
  Profile,
  PublicUser,
  SavedProfileSlot,
  SocialLinks,
  THEME_DEFAULTS,
} from "@/lib/types";

type Tab = "profil" | "liens" | "reseaux" | "jeux" | "apparence" | "avance";

const TABS: { id: Tab; label: string }[] = [
  { id: "profil", label: "Profil" },
  { id: "liens", label: "Liens" },
  { id: "reseaux", label: "Réseaux" },
  { id: "jeux", label: "Jeux" },
  { id: "apparence", label: "Style" },
  { id: "avance", label: "Avancé" },
];

// ─── Helpers for scheduled pages ────────────────────────────────────────────
function fmt(iso: string) { return iso.slice(0, 16); }
function toIso(local: string) { return local ? new Date(local).toISOString() : ""; }

// ─── Advanced sub-sections ───────────────────────────────────────────────────

function PasswordSection({ profile, onSave }: { profile: Profile; onSave: (p: Partial<Profile>) => Promise<void> }) {
  const [enabled, setEnabled] = useState(!!profile.pagePassword);
  const [pw, setPw] = useState(profile.pagePassword ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const save = async () => {
    setSaving(true); setMsg("");
    // Send "" to explicitly clear (undefined would be omitted by JSON.stringify
    // and the server would fall back to keeping the old password).
    await onSave({ pagePassword: enabled ? pw.trim() : "" });
    setMsg("Enregistré."); setSaving(false);
    setTimeout(() => setMsg(""), 2500);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Protéger la page par mot de passe</p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400">Les visiteurs devront saisir un mot de passe avant de voir ton profil.</p>
        </div>
        <button type="button" onClick={() => setEnabled((v) => !v)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${enabled ? "bg-indigo-500" : "bg-gray-200 dark:bg-zinc-700"}`}>
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>
      {enabled && (
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400">Mot de passe</label>
          <input type="text" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Ex: monstreamofoff2024"
            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
            maxLength={64} />
          <p className="mt-1.5 text-[11px] text-gray-400 dark:text-zinc-500">Le mot de passe est visible en clair ici — évite un mot de passe important.</p>
        </div>
      )}
      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={saving || (enabled && !pw.trim())}
          className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-white dark:text-zinc-900">
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        {msg && <span className="text-xs text-emerald-500">{msg}</span>}
      </div>
    </div>
  );
}

function ScheduleSection({ slots, isPro }: { slots: SavedProfileSlot[]; isPro: boolean }) {
  const [local, setLocal] = useState<SavedProfileSlot[]>(slots);
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState<Record<string, string>>({});
  const now = new Date();

  const save = async (slot: SavedProfileSlot) => {
    setSaving(slot.id);
    await fetch("/api/saved-profiles", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: slot.id, scheduledAt: slot.scheduledAt || null, activeUntil: slot.activeUntil || null }),
    });
    setSaving(null);
    setMsg((m) => ({ ...m, [slot.id]: "Enregistré." }));
    setTimeout(() => setMsg((m) => ({ ...m, [slot.id]: "" })), 2500);
  };

  const patch = (id: string, fields: Partial<SavedProfileSlot>) =>
    setLocal((s) => s.map((sl) => (sl.id === id ? { ...sl, ...fields } : sl)));

  if (!isPro) return (
    <div className="rounded-xl border border-dashed border-gray-200 dark:border-zinc-700 px-5 py-8 text-center">
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Fonctionnalité Pro / Elite</p>
      <p className="text-xs text-gray-500 dark:text-zinc-400 mb-4">Les pages programmées nécessitent un plan Pro ou Elite.</p>
      <a href="/dashboard/premium" className="text-xs font-semibold text-indigo-500 hover:underline">Voir les plans →</a>
    </div>
  );

  if (local.length === 0) return (
    <p className="text-sm text-gray-500 dark:text-zinc-400">
      Aucune page sauvegardée. Sauvegarde d'abord une page depuis{" "}
      <a href="/dashboard/mapage" className="font-medium text-indigo-500 hover:underline">Ma page</a>.
    </p>
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray-500 dark:text-zinc-400">Définis quand chaque page sauvegardée doit s'activer automatiquement. Une seule page peut être active à la fois.</p>
      {local.map((slot) => {
        const isActive = slot.scheduledAt && new Date(slot.scheduledAt) <= now && (!slot.activeUntil || new Date(slot.activeUntil) > now);
        return (
          <div key={slot.id} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{slot.name}</p>
                <p className="text-xs text-gray-400 dark:text-zinc-500">Sauvegardée le {new Date(slot.savedAt).toLocaleDateString("fr-FR")}</p>
              </div>
              {isActive && <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-500">Active maintenant</span>}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400">Activer à partir du</label>
                <input type="datetime-local" value={slot.scheduledAt ? fmt(slot.scheduledAt) : ""}
                  onChange={(e) => patch(slot.id, { scheduledAt: e.target.value ? toIso(e.target.value) : undefined })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-800" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400">Désactiver à partir du (optionnel)</label>
                <input type="datetime-local" value={slot.activeUntil ? fmt(slot.activeUntil) : ""}
                  onChange={(e) => patch(slot.id, { activeUntil: e.target.value ? toIso(e.target.value) : undefined })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-800" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => save(slot)} disabled={saving === slot.id}
                className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-white dark:text-zinc-900">
                {saving === slot.id ? "Enregistrement…" : "Appliquer"}
              </button>
              {slot.scheduledAt && (
                <button type="button" onClick={() => { patch(slot.id, { scheduledAt: undefined, activeUntil: undefined }); save({ ...slot, scheduledAt: undefined, activeUntil: undefined }); }}
                  className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 dark:border-zinc-700 dark:text-zinc-300">
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

function GroupsSection({ profile, onSave }: { profile: Profile; onSave: (p: Partial<Profile>) => Promise<void> }) {
  const [groups, setGroups] = useState<LinkGroup[]>(profile.linkGroups ?? []);
  const [links, setLinks] = useState(profile.links);
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const save = useCallback(async (g: LinkGroup[], l: typeof links) => {
    setSaving(true); setMsg("");
    await onSave({ linkGroups: g, links: l });
    setMsg("Enregistré."); setSaving(false);
    setTimeout(() => setMsg(""), 2500);
  }, [onSave]);

  const addGroup = async () => {
    const label = newLabel.trim();
    if (!label) return;
    const g = [...groups, { id: Math.random().toString(36).slice(2), label }];
    setGroups(g); setNewLabel("");
    await save(g, links);
  };

  const deleteGroup = async (id: string) => {
    const g = groups.filter((gr) => gr.id !== id);
    const l = links.map((lk) => (lk.groupId === id ? { ...lk, groupId: undefined } : lk));
    setGroups(g); setLinks(l);
    await save(g, l);
  };

  const renameGroup = async (id: string, label: string) => {
    const g = groups.map((gr) => (gr.id === id ? { ...gr, label } : gr));
    setGroups(g); setEditingId(null);
    await save(g, links);
  };

  const assignLink = async (linkId: string, groupId: string | null) => {
    const l = links.map((lk) => lk.id === linkId ? { ...lk, groupId: groupId ?? undefined } : lk);
    setLinks(l);
    await save(groups, l);
  };

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-gray-500 dark:text-zinc-400">Crée des groupes pour organiser tes liens en sections sur ta page publique.</p>
      {groups.length > 0 && (
        <div className="flex flex-col gap-3">
          {groups.map((group) => {
            const groupLinks = links.filter((l) => l.groupId === group.id);
            return (
              <div key={group.id} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  {editingId === group.id ? (
                    <form onSubmit={(e) => { e.preventDefault(); const val = (e.currentTarget.elements.namedItem("label") as HTMLInputElement).value.trim(); if (val) renameGroup(group.id, val); }} className="flex flex-1 gap-2">
                      <input name="label" defaultValue={group.label} autoFocus
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" maxLength={40} />
                      <button type="submit" className="rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">OK</button>
                      <button type="button" onClick={() => setEditingId(null)} className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 dark:border-zinc-700 dark:text-zinc-300">✕</button>
                    </form>
                  ) : (
                    <>
                      <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{group.label}</span>
                      <button type="button" onClick={() => setEditingId(group.id)} className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 dark:border-zinc-700 dark:text-zinc-300">Renommer</button>
                      <button type="button" onClick={() => deleteGroup(group.id)} className="rounded-xl border border-red-200 dark:border-red-900 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">Supprimer</button>
                    </>
                  )}
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-500 dark:text-zinc-400">Liens dans ce groupe ({groupLinks.length})</p>
                  {links.length === 0 ? <p className="text-xs text-gray-400 dark:text-zinc-500">Aucun lien sur ta page.</p> : (
                    <div className="flex flex-col gap-1.5">
                      {links.map((lk) => (
                        <label key={lk.id} className="flex cursor-pointer items-center gap-2.5">
                          <input type="checkbox" checked={lk.groupId === group.id}
                            onChange={(e) => assignLink(lk.id, e.target.checked ? group.id : null)}
                            className="h-3.5 w-3.5 accent-indigo-500 rounded" />
                          <span className="truncate text-xs text-gray-700 dark:text-zinc-200">
                            {lk.icon && <span className="mr-1">{lk.icon}</span>}{lk.label}
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
      <div className="flex gap-2">
        <input type="text" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addGroup()}
          placeholder="Nom du groupe (ex: Socials, Gaming…)"
          className="flex-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
          maxLength={40} />
        <button type="button" onClick={addGroup} disabled={saving || !newLabel.trim()}
          className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-white dark:text-zinc-900">
          Ajouter
        </button>
      </div>
      {msg && <span className="text-xs text-emerald-500">{msg}</span>}
    </div>
  );
}

const SOCIAL_KEYS = Object.keys(SOCIAL_LABELS) as (keyof SocialLinks)[];

const PLAN_RANK: Record<"free" | "pro" | "elite", number> = {
  free: 0,
  pro: 1,
  elite: 2,
};

// Curseur de réglage numérique (largeur, arrondi, etc.).
function Slider({
  label,
  value,
  min,
  max,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block text-xs text-gray-500 dark:text-zinc-400">
      {label} : {value}
      {unit}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-zinc-900 dark:accent-white"
      />
    </label>
  );
}

function LockIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className="shrink-0"
      aria-hidden
    >
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 018 0v3" />
    </svg>
  );
}

// Champ couleur compact avec libellé.
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-2 text-xs text-gray-500 dark:text-zinc-400">
      {label}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-10 shrink-0 cursor-pointer rounded-lg border border-gray-200 bg-transparent dark:border-zinc-700"
      />
    </label>
  );
}

// Grille d'options gated par plan. Les options non autorisées restent
// CLIQUABLES (aperçu seulement) mais affichent un cadenas : elles ne
// s'enregistrent pas, c'est un teaser pour donner envie du Premium.
function OptionGrid<T extends string>({
  label,
  options,
  allowed,
  value,
  labels,
  columns = 4,
  onSelect,
  previewFont,
}: {
  label: string;
  options: T[];
  allowed: T[];
  value: T;
  labels: Record<T, string>;
  columns?: number;
  onSelect: (v: T, locked: boolean) => void;
  previewFont?: (v: T) => string | undefined;
}) {
  const hasLocked = options.some((o) => !allowed.includes(o));
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((opt) => {
          const ok = allowed.includes(opt);
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              title={ok ? labels[opt] : `${labels[opt]} — aperçu Premium`}
              onClick={() => onSelect(opt, !ok)}
              style={previewFont ? { fontFamily: previewFont(opt) } : undefined}
              className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                selected
                  ? ok
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                    : "border-indigo-500 bg-indigo-500 text-white"
                  : ok
                    ? "border-gray-200 text-gray-600 hover:border-gray-400 dark:border-zinc-700 dark:text-zinc-300"
                    : "border-dashed border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 dark:border-zinc-700 dark:text-zinc-500"
              }`}
            >
              {!ok && <LockIcon />}
              {labels[opt]}
            </button>
          );
        })}
      </div>
      {hasLocked && (
        <p className="mt-2 flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-500">
          <LockIcon /> Aperçu Premium — non enregistré.{" "}
          <Link href="/dashboard/premium" className="underline">
            Débloque avec Pro ou Elite
          </Link>
          .
        </p>
      )}
    </div>
  );
}

const SOCIAL_PLACEHOLDERS: Record<keyof SocialLinks, string> = {
  discord: "pseudo Discord ou lien d'invitation serveur",
  twitch: "pseudo ou URL de ta chaîne",
  youtube: "handle (@toi) ou URL",
  x: "pseudo ou URL",
  tiktok: "pseudo ou URL",
  instagram: "pseudo ou URL",
  snapchat: "pseudo ou URL",
  telegram: "pseudo ou URL (t.me)",
  reddit: "pseudo (sans u/) ou URL",
  skool: "nom de communauté ou URL",
  whatsapp: "numéro international (ex : 33612…)",
  threads: "pseudo ou URL",
  facebook: "pseudo ou URL",
  pinterest: "pseudo ou URL",
  linkedin: "pseudo (in/…) ou URL",
  spotify: "pseudo ou URL de profil",
  soundcloud: "pseudo ou URL",
  patreon: "pseudo ou URL",
  github: "pseudo ou URL",
  steam: "ID de vanity URL ou lien de profil",
  kick: "pseudo ou URL",
};

// Upload d'un fichier audio (musique de fond).
function AudioUpload({
  onUploaded,
  onError,
}: {
  onUploaded: (url: string) => void;
  onError: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,audio/mp3,audio/ogg,audio/wav,audio/webm"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setUploading(true);
          onError("");
          try {
            const form = new FormData();
            form.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: form });
            const data = await res.json();
            if (!res.ok) onError(data.error ?? "Upload impossible.");
            else onUploaded(data.url);
          } catch {
            onError("Upload impossible. Réessaie.");
          } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
          }
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={smallBtnClass}
      >
        {uploading ? "Envoi..." : "Importer une musique (MP3, 8 Mo max)"}
      </button>
    </>
  );
}

function SlotRow({
  slot,
  loading,
  onLoad,
  onDelete,
  onRename,
}: {
  slot: SavedProfileSlot;
  loading: boolean;
  onLoad: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(slot.name);
  const date = new Date(slot.savedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "2-digit" });

  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-100 dark:border-zinc-800 px-3 py-2">
      {editing ? (
        <input
          value={name}
          autoFocus
          maxLength={60}
          className={`${inputClass} flex-1 py-1 text-sm`}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => { onRename(name); setEditing(false); }}
          onKeyDown={(e) => { if (e.key === "Enter") { onRename(name); setEditing(false); } if (e.key === "Escape") { setName(slot.name); setEditing(false); } }}
        />
      ) : (
        <button type="button" className="flex-1 text-left" onDoubleClick={() => setEditing(true)}>
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{slot.name}</p>
          <p className="text-xs text-gray-400 dark:text-zinc-500">{date}</p>
        </button>
      )}
      <button
        type="button"
        onClick={onLoad}
        className={smallBtnClass}
      >
        Charger
      </button>
      <button
        type="button"
        disabled={loading}
        onClick={onDelete}
        className="rounded-lg border border-red-200 dark:border-red-900 px-3 py-1.5 text-xs font-medium text-red-500 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-40"
      >
        {loading ? "…" : "✕"}
      </button>
    </div>
  );
}

function MaPageEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cached = getCachedMe();
  const [user, setUser] = useState<PublicUser | null>(cached?.user ?? null);
  const [profile, setProfile] = useState<Profile | null>(
    cached?.profile ?? null
  );
  const [limits, setLimits] = useState<PlanLimits | null>(
    cached?.limits ?? null
  );
  const [tab, setTab] = useState<Tab>(() => {
    if (searchParams.get("add") === "lien") return "liens";
    const t = searchParams.get("tab");
    return TABS.some((x) => x.id === t) ? (t as Tab) : "profil";
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  // Miroir de `dirty` lisible dans le callback de revalidation (closure).
  const dirtyRef = useRef(false);
  // Aperçu d'options Premium verrouillées : visibles dans l'aperçu mais
  // jamais enregistrées (teaser). Réinitialisé au chargement.
  const [preview, setPreview] = useState<Partial<Profile["theme"]>>({});
  // Aperçu : sur desktop à droite, sur mobile collant en haut (rétractable).
  // On ne rend qu'une seule instance à la fois (évite deux animations canvas).
  const [isDesktop, setIsDesktop] = useState(true);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(true);
  const [previewMobile, setPreviewMobile] = useState(true);
  const dragIdx = useRef<number | null>(null);
  const addHandled = useRef(false);
  // Ref stable vers le profil courant — utilisé dans les handlers d'unload
  // (les closures d'addEventListener ne voient pas les states React).
  const profileRef = useRef<Profile | null>(null);
  const savingRef = useRef(false);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Emplacements de pages sauvegardées
  const [slots, setSlots] = useState<SavedProfileSlot[]>([]);
  const [slotsOpen, setSlotsOpen] = useState(false);
  const [newSlotName, setNewSlotName] = useState("");
  const [savingSlot, setSavingSlot] = useState(false);
  const [loadingSlot, setLoadingSlot] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Précharge toutes les polices Google pour que la grille de sélection et
  // l'aperçu affichent chaque police dans son vrai style.
  useEffect(() => {
    const families = Object.values(FONT_META)
      .map((m) => m.google)
      .filter((g): g is string => Boolean(g));
    const id = "ml-all-fonts";
    if (document.getElementById(id) || families.length === 0) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?" +
      families.map((g) => `family=${g}`).join("&") +
      "&display=swap";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    fetchMe().then(({ me, unauthorized }) => {
      if (unauthorized) {
        router.push("/login");
        return;
      }
      if (!me) return;
      setUser(me.user);
      setLimits(me.limits);
      let p: Profile = me.profile;
      if (
        searchParams.get("add") === "lien" &&
        !addHandled.current &&
        p.links.length < me.limits.links
      ) {
        addHandled.current = true;
        p = { ...p, links: [...p.links, { id: newId(), label: "", url: "" }] };
      }
      setProfile((current) => (dirtyRef.current ? current : p));
    });
    fetch("/api/saved-profiles").then((r) => r.ok ? r.json() : null).then((d) => {
      if (d?.slots) setSlots(d.slots);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Maintenir les refs en phase avec les states (closure-safe pour les handlers).
  useEffect(() => { profileRef.current = profile; }, [profile]);
  useEffect(() => { savingRef.current = saving; }, [saving]);

  // Sauvegarde silencieuse via sendBeacon (fiable en cas de fermeture de page).
  const beaconSave = () => {
    if (!dirtyRef.current || !profileRef.current || savingRef.current) return;
    try {
      const blob = new Blob([JSON.stringify(profileRef.current)], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/profile", blob);
      dirtyRef.current = false;
    } catch { /* silent */ }
  };

  // Autosave sur : fermeture onglet/fenêtre, changement d'onglet navigateur,
  // et démontage du composant (navigation vers une autre page de l'app).
  useEffect(() => {
    const onBefore = () => beaconSave();
    const onVis = () => { if (document.visibilityState === "hidden") beaconSave(); };
    window.addEventListener("beforeunload", onBefore);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      beaconSave(); // navigation in-app (démontage)
      window.removeEventListener("beforeunload", onBefore);
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (patch: Partial<Profile>) => {
    setProfile((p) => (p ? { ...p, ...patch } : p));
    setDirty(true);
    dirtyRef.current = true;
    setMessage("");
    // Debounce : sauvegarde 1,2 s après la dernière modification.
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => autoSave(), 1200);
  };

  // Sélection d'une option de thème gated : si autorisée on l'enregistre
  // (et on efface l'aperçu de cette clé) ; si verrouillée on la met seulement
  // en aperçu (non enregistrée).
  const selectTheme = <K extends keyof Profile["theme"]>(
    key: K,
    value: Profile["theme"][K],
    locked: boolean
  ) => {
    if (locked) {
      setPreview((pv) => ({ ...pv, [key]: value }));
    } else {
      setPreview((pv) => {
        const next = { ...pv };
        delete next[key];
        return next;
      });
      if (profile) {
        update({ theme: { ...profile.theme, [key]: value } });
      }
    }
  };

  // Sauvegarde automatique (debounce + changement d'onglet + unload).
  // Lit depuis profileRef pour éviter les closures périmées dans les timers.
  const autoSave = async () => {
    const p = profileRef.current;
    if (!p || !dirtyRef.current || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      const data = await res.json();
      if (!res.ok) return; // silencieux en autosave
      profileRef.current = data.profile;
      setProfile(data.profile);
      setDirty(false);
      dirtyRef.current = false;
      setCachedMe({ profile: data.profile });
      setMessage("✓ Enregistré automatiquement");
    } catch { /* silencieux */ } finally {
      setSaving(false);
      savingRef.current = false;
    }
  };

  // Sauvegarde manuelle (bouton "Enregistrer").
  const save = async () => {
    if (!profile) return;
    // Annule le debounce en cours pour éviter une double sauvegarde.
    if (autosaveTimer.current) { clearTimeout(autosaveTimer.current); autosaveTimer.current = null; }
    savingRef.current = true;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Sauvegarde impossible.");
        return;
      }
      profileRef.current = data.profile;
      setProfile(data.profile);
      setDirty(false);
      dirtyRef.current = false;
      setCachedMe({ profile: data.profile });
      setMessage("Modifications enregistrées.");
    } catch {
      setError("Sauvegarde impossible. Réessaie.");
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  };

  // Changement d'onglet interne : déclenche une sauvegarde si des
  // modifications sont en attente, puis bascule l'onglet immédiatement.
  const switchTab = (newTab: Tab) => {
    if (dirty && !saving) save();
    setTab(newTab);
  };

  // Sauvegarde immédiate pour les sections avancées (mot de passe, groupes).
  const saveAdvanced = useCallback(async (patch: Partial<Profile>) => {
    if (!profile) return;
    const updated = { ...profile, ...patch };
    if (autosaveTimer.current) { clearTimeout(autosaveTimer.current); autosaveTimer.current = null; }
    setProfile(updated);
    profileRef.current = updated;
    setDirty(false);
    dirtyRef.current = false;
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setCachedMe({ profile: updated });
  }, [profile]);

  const saveSlot = async () => {
    if (!profile || !newSlotName.trim()) return;
    setSavingSlot(true);
    setError("");
    try {
      const res = await fetch("/api/saved-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSlotName.trim(), profile }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Sauvegarde impossible."); return; }
      setSlots((s) => [...s, data.slot]);
      setNewSlotName("");
    } catch {
      setError("Sauvegarde impossible. Réessaie.");
    } finally {
      setSavingSlot(false);
    }
  };

  const loadSlot = (slot: SavedProfileSlot) => {
    if (dirty && !confirm("Des modifications non enregistrées seront perdues. Continuer ?")) return;
    setProfile(slot.profile);
    setDirty(true);
    dirtyRef.current = true;
    setPreview({});
    setMessage(`Page « ${slot.name} » chargée. Enregistre pour l'appliquer.`);
    setSlotsOpen(false);
  };

  const deleteSlot = async (id: string) => {
    setLoadingSlot(id);
    try {
      const res = await fetch(`/api/saved-profiles?id=${id}`, { method: "DELETE" });
      if (res.ok) setSlots((s) => s.filter((x) => x.id !== id));
    } finally {
      setLoadingSlot(null);
    }
  };

  const updateSlotName = async (slot: SavedProfileSlot, name: string) => {
    try {
      const res = await fetch("/api/saved-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: slot.id, name, profile: slot.profile }),
      });
      const data = await res.json();
      if (res.ok) setSlots((s) => s.map((x) => (x.id === slot.id ? data.slot : x)));
    } catch { /* silent */ }
  };

  if (!user || !profile || !limits) {
    return (
      <div className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="h-6 w-40 bg-gray-100 dark:bg-zinc-800 rounded-full animate-pulse" />
          <div className="h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
          <div className="h-64 bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const previewActive = Object.keys(preview).length > 0;
  const previewProfile: Profile = {
    ...profile,
    theme: { ...profile.theme, ...preview },
    // Efface les couleurs individuelles des liens en aperçu preset : le style
    // bevel/gradient utilise link.color comme fond, une couleur claire d'un
    // ancien thème rendrait les boutons invisibles sur le nouveau preset.
    links: previewActive
      ? profile.links.map(({ color: _c, ...l }) => l)
      : profile.links,
  };

  const previewBox = (zoom = 0.65) => (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-lg dark:border-zinc-800">
      <div style={{ zoom }}>
        <ProfileView
          profile={previewProfile}
          branding={limits.branding}
          watermark={limits.watermark}
          interactive={false}
        />
      </div>
      {previewActive && (
        <div className="pointer-events-none absolute right-2 top-2 z-20 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
          <LockIcon /> Aperçu Premium
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4 flex flex-wrap items-start justify-between gap-3"
        >
          <div>
            <h1 className={pageTitleClass}>Ma page</h1>
            <p className="text-sm text-gray-400 dark:text-zinc-500">
              Personnalise ce que tes visiteurs voient sur movalink.vercel.app/
              {user.username}.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/${user.username}`} target="_blank" className={smallBtnClass}>
              Voir ma page
            </Link>
            <button
              type="button"
              onClick={save}
              disabled={saving || !dirty}
              className={primaryBtnClass}
            >
              {saving ? "Sauvegarde..." : dirty ? "Enregistrer" : "Enregistré"}
            </button>
          </div>
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

        {/* ── Emplacements de pages sauvegardées ─────────────────────────── */}
        <div className="mb-5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden">
          <button
            type="button"
            onClick={() => setSlotsOpen((o) => !o)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">📄 Pages sauvegardées</span>
              <span className="rounded-full bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-medium text-gray-500 dark:text-zinc-400">
                {slots.length}/{limits.savedProfiles}
              </span>
            </div>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              className={`text-gray-400 transition-transform ${slotsOpen ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {slotsOpen && (
            <div className="border-t border-gray-100 dark:border-zinc-800 px-4 py-4 flex flex-col gap-3">
              {slots.length === 0 && (
                <p className="text-sm text-gray-400 dark:text-zinc-500">
                  Aucune page sauvegardée. Sauvegarde ta page actuelle pour pouvoir y revenir plus tard.
                </p>
              )}

              {slots.map((slot) => (
                <SlotRow
                  key={slot.id}
                  slot={slot}
                  loading={loadingSlot === slot.id}
                  onLoad={() => loadSlot(slot)}
                  onDelete={() => deleteSlot(slot.id)}
                  onRename={(name) => updateSlotName(slot, name)}
                />
              ))}

              {slots.length < limits.savedProfiles ? (
                <div className="mt-1 flex gap-2">
                  <input
                    value={newSlotName}
                    maxLength={60}
                    placeholder="Nom de l'emplacement…"
                    onChange={(e) => setNewSlotName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveSlot(); }}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    disabled={savingSlot || !newSlotName.trim()}
                    onClick={saveSlot}
                    className={`${primaryBtnClass} shrink-0`}
                  >
                    {savingSlot ? "…" : "Sauvegarder"}
                  </button>
                </div>
              ) : (
                <p className="text-xs text-gray-400 dark:text-zinc-500">
                  Limite atteinte ({limits.savedProfiles} emplacements).{" "}
                  <Link href="/dashboard/premium" className="underline">Passe à Elite</Link> pour en avoir 10.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            {!isDesktop && (
              <div className="sticky top-2 z-30 mb-5">
                <div className="rounded-2xl border border-gray-200 bg-white/95 p-2 shadow-lg backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/95">
                  <div className="mb-1.5 flex items-center justify-between px-1">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                      Aperçu en direct
                    </span>
                    <button
                      type="button"
                      onClick={() => setMobilePreviewOpen((o) => !o)}
                      className="text-xs font-medium text-gray-500 underline dark:text-zinc-400"
                    >
                      {mobilePreviewOpen ? "Masquer" : "Afficher"}
                    </button>
                  </div>
                  {mobilePreviewOpen && previewBox(0.5)}
                </div>
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex bg-gray-100 dark:bg-zinc-800 rounded-xl p-1 mb-6"
            >
              {TABS.map((t) => (
                <motion.button
                  key={t.id}
                  onClick={() => switchTab(t.id)}
                  whileHover={{ scale: tab !== t.id ? 1.02 : 1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all relative ${
                    tab === t.id
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-300"
                  }`}
                >
                  {tab === t.id && (
                    <motion.div
                      layoutId="tabBg"
                      className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-lg shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{t.label}</span>
                </motion.button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {tab === "profil" && (
                  <div className={`${cardClass} flex flex-col gap-5`}>
                    <div>
                      <label htmlFor="displayName" className={labelClass}>
                        Nom affiché
                      </label>
                      <input
                        id="displayName"
                        value={profile.displayName}
                        maxLength={50}
                        onChange={(e) => update({ displayName: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="bio" className={labelClass}>
                        Bio (300 caractères max)
                      </label>
                      <textarea
                        id="bio"
                        value={profile.bio}
                        maxLength={300}
                        rows={4}
                        onChange={(e) => update({ bio: e.target.value })}
                        className={`${inputClass} resize-y`}
                      />
                    </div>
                    <div>
                      <p className={labelClass}>Avatar (URL)</p>
                      <div className="flex items-center gap-3">
                        {profile.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={profile.avatarUrl}
                            alt="Avatar"
                            className="h-12 w-12 shrink-0 rounded-full border border-gray-200 object-cover dark:border-zinc-700"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-400 dark:bg-zinc-800 dark:text-zinc-500">
                            {profile.displayName.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                        <input
                          value={profile.avatarUrl}
                          maxLength={500}
                          placeholder="https://…"
                          onChange={(e) => update({ avatarUrl: e.target.value })}
                          className={inputClass}
                        />
                        {profile.avatarUrl && (
                          <button
                            type="button"
                            className={`${smallBtnClass} shrink-0`}
                            onClick={() => update({ avatarUrl: "" })}
                          >
                            Retirer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {tab === "liens" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 dark:text-zinc-400">
                        {profile.links.length}/{limits.links} liens utilisés
                      </p>
                      <button
                        type="button"
                        className={smallBtnClass}
                        disabled={profile.links.length >= limits.links}
                        onClick={() =>
                          update({
                            links: [
                              ...profile.links,
                              { id: newId(), label: "", url: "" },
                            ],
                          })
                        }
                      >
                        Ajouter un lien
                      </button>
                    </div>
                    {profile.links.length >= limits.links && (
                      <p className="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
                        Limite atteinte pour ton plan.{" "}
                        <Link href="/dashboard/premium" className="underline">
                          Passe au plan supérieur
                        </Link>{" "}
                        pour en ajouter davantage.
                      </p>
                    )}
                    {profile.links.map((link, i) => (
                      <div
                        key={link.id}
                        draggable
                        onDragStart={() => { dragIdx.current = i; }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (dragIdx.current !== null && dragIdx.current !== i) {
                            const links = [...profile.links];
                            const [moved] = links.splice(dragIdx.current, 1);
                            links.splice(i, 0, moved);
                            update({ links });
                          }
                          dragIdx.current = null;
                        }}
                        className={`${cardClass} flex flex-col gap-3 !p-4 sm:flex-row sm:items-center cursor-grab active:cursor-grabbing`}
                      >
                        <input
                          value={link.icon ?? ""}
                          maxLength={4}
                          placeholder="🔗"
                          title="Emoji du lien"
                          onChange={(e) => {
                            const links = [...profile.links];
                            links[i] = { ...link, icon: e.target.value };
                            update({ links });
                          }}
                          className={`${inputClass} w-14 shrink-0 text-center`}
                        />
                        <input
                          value={link.label}
                          maxLength={60}
                          placeholder="Titre du lien"
                          onChange={(e) => {
                            const links = [...profile.links];
                            links[i] = { ...link, label: e.target.value };
                            update({ links });
                          }}
                          className={`${inputClass} sm:w-56`}
                        />
                        <div className="flex w-full items-center rounded-lg border border-gray-200 bg-white px-3 transition-all focus-within:border-transparent focus-within:ring-2 focus-within:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:focus-within:ring-white">
                          <span className="select-none text-sm text-gray-400 dark:text-zinc-500">
                            https://
                          </span>
                          <input
                            value={link.url.replace(/^https?:\/\//i, "")}
                            maxLength={490}
                            placeholder="tonsite.com/ta-page"
                            onChange={(e) => {
                              const rest = e.target.value.replace(/^https?:\/\//i, "");
                              const links = [...profile.links];
                              links[i] = {
                                ...link,
                                url: rest ? `https://${rest}` : "",
                              };
                              update({ links });
                            }}
                            className="w-full bg-transparent py-2 text-sm text-gray-900 outline-none placeholder:text-gray-300 dark:text-white dark:placeholder:text-zinc-600"
                          />
                        </div>
                        {limits.perLinkColor ? (
                          <div className="flex shrink-0 items-center gap-1">
                            <input
                              type="color"
                              value={link.color ?? profile.theme.accent}
                              title="Couleur de ce bouton"
                              onChange={(e) => {
                                const links = [...profile.links];
                                links[i] = { ...link, color: e.target.value };
                                update({ links });
                              }}
                              className="h-9 w-9 cursor-pointer rounded-lg border border-gray-200 bg-transparent dark:border-zinc-700"
                            />
                            {link.color && (
                              <button
                                type="button"
                                title="Couleur par défaut"
                                className={smallBtnClass}
                                onClick={() => {
                                  const links = [...profile.links];
                                  const { color: _drop, ...rest } = link;
                                  void _drop;
                                  links[i] = rest;
                                  update({ links });
                                }}
                              >
                                &#8635;
                              </button>
                            )}
                          </div>
                        ) : (
                          <Link
                            href="/dashboard/premium"
                            title="Couleur par bouton — Pro & Elite"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 text-gray-400 transition-colors hover:border-indigo-400 hover:text-indigo-500 dark:border-zinc-700 dark:text-zinc-500"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                              <rect x="4" y="10" width="16" height="10" rx="2" />
                              <path d="M8 10V7a4 4 0 018 0v3" />
                            </svg>
                          </Link>
                        )}
                        <div className="flex items-center gap-1.5">
                          <input
                            type="datetime-local"
                            title="Expiration du lien (optionnel)"
                            value={link.expiresAt ? new Date(link.expiresAt).toISOString().slice(0, 16) : ""}
                            onChange={(e) => {
                              const links = [...profile.links];
                              links[i] = { ...link, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined };
                              update({ links });
                            }}
                            className="h-9 rounded-lg border border-gray-200 bg-transparent px-2 text-xs text-gray-500 dark:border-zinc-700 dark:text-zinc-400"
                          />
                        </div>
                        <div className="flex shrink-0 gap-1.5">
                          <button
                            type="button"
                            title="Monter"
                            disabled={i === 0}
                            className={smallBtnClass}
                            onClick={() => {
                              const links = [...profile.links];
                              [links[i - 1], links[i]] = [links[i], links[i - 1]];
                              update({ links });
                            }}
                          >
                            &#8593;
                          </button>
                          <button
                            type="button"
                            title="Descendre"
                            disabled={i === profile.links.length - 1}
                            className={smallBtnClass}
                            onClick={() => {
                              const links = [...profile.links];
                              [links[i], links[i + 1]] = [links[i + 1], links[i]];
                              update({ links });
                            }}
                          >
                            &#8595;
                          </button>
                          <button
                            type="button"
                            className={smallBtnClass}
                            onClick={() =>
                              update({
                                links: profile.links.filter((l) => l.id !== link.id),
                              })
                            }
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {tab === "reseaux" && (
                  <div className={`${cardClass} flex flex-col gap-4`}>
                    {SOCIAL_KEYS.map((key) => (
                      <div key={key}>
                        <label htmlFor={`social-${key}`} className={labelClass}>
                          {SOCIAL_LABELS[key]}
                        </label>
                        <input
                          id={`social-${key}`}
                          value={profile.socials[key] ?? ""}
                          maxLength={120}
                          placeholder={SOCIAL_PLACEHOLDERS[key]}
                          onChange={(e) =>
                            update({
                              socials: { ...profile.socials, [key]: e.target.value },
                            })
                          }
                          className={inputClass}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {tab === "jeux" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 dark:text-zinc-400">
                        {profile.games.length}/{limits.games} jeux affichés
                      </p>
                      <button
                        type="button"
                        className={smallBtnClass}
                        disabled={profile.games.length >= limits.games}
                        onClick={() =>
                          update({
                            games: [
                              ...profile.games,
                              { id: newId(), game: "", pseudo: "" },
                            ],
                          })
                        }
                      >
                        Ajouter un jeu
                      </button>
                    </div>
                    {profile.games.map((game, i) => (
                      <div
                        key={game.id}
                        className={`${cardClass} flex flex-col gap-3 !p-4 sm:flex-row sm:items-center`}
                      >
                        <input
                          value={game.game}
                          maxLength={50}
                          placeholder="Nom du jeu (ex : Valorant)"
                          onChange={(e) => {
                            const games = [...profile.games];
                            games[i] = { ...game, game: e.target.value };
                            update({ games });
                          }}
                          className={inputClass}
                        />
                        <input
                          value={game.pseudo}
                          maxLength={50}
                          placeholder="Ton pseudo in-game"
                          onChange={(e) => {
                            const games = [...profile.games];
                            games[i] = { ...game, pseudo: e.target.value };
                            update({ games });
                          }}
                          className={inputClass}
                        />
                        <button
                          type="button"
                          className={`${smallBtnClass} shrink-0`}
                          onClick={() =>
                            update({
                              games: profile.games.filter((g) => g.id !== game.id),
                            })
                          }
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {tab === "avance" && (
                  <div className="flex flex-col gap-6">

                    {/* ── Mot de passe ──────────────────────────────── */}
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500">🔒 Mot de passe</p>
                      <div className={cardClass}>
                        <PasswordSection profile={profile} onSave={saveAdvanced} />
                      </div>
                    </div>

                    {/* ── Pages programmées ─────────────────────────── */}
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500">📅 Pages programmées</p>
                        {PLAN_LIMITS[user.plan].savedProfiles === 0 && (
                          <Link href="/dashboard/premium" className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Pro</Link>
                        )}
                      </div>
                      {/* Bypass toggle */}
                      <div className={`${cardClass} mb-4 flex items-center justify-between gap-4`}>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Activer les pages programmées</p>
                          <p className="text-xs text-gray-500 dark:text-zinc-400">
                            Désactiver force l'affichage de ta page actuelle, même si une plage est active.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => update({ scheduledPagesEnabled: !(profile.scheduledPagesEnabled ?? true) })}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${(profile.scheduledPagesEnabled ?? true) ? "bg-indigo-500" : "bg-gray-200 dark:bg-zinc-700"}`}
                          role="switch"
                          aria-checked={(profile.scheduledPagesEnabled ?? true)}
                        >
                          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${(profile.scheduledPagesEnabled ?? true) ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                      </div>
                      <ScheduleSection slots={slots} isPro={PLAN_LIMITS[user.plan].savedProfiles > 0} />
                    </div>

                    {/* ── Groupes de liens ──────────────────────────── */}
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500">🗂️ Groupes de liens</p>
                      <div className={cardClass}>
                        <GroupsSection profile={profile} onSave={saveAdvanced} />
                      </div>
                    </div>

                    <hr className="border-gray-200 dark:border-zinc-800" />

                    {/* ── Widgets ───────────────────────────────────── */}
                    <div className="flex flex-col gap-4">
                    {/* Compteur de vues */}
                    <div className={`${cardClass} flex items-center justify-between gap-4`}>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Compteur de vues</p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400">Affiche le nombre de vues total sur ta page publique.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => update({ showViewCount: !profile.showViewCount })}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${profile.showViewCount ? "bg-zinc-900 dark:bg-white" : "bg-gray-200 dark:bg-zinc-700"}`}
                        role="switch"
                        aria-checked={!!profile.showViewCount}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform dark:bg-zinc-900 ${profile.showViewCount ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>

                    {/* Countdown */}
                    <div className={cardClass}>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Compte à rebours</p>
                        {!limits.countdown && (
                          <Link href="/dashboard/premium" className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Pro</Link>
                        )}
                      </div>
                      {limits.countdown ? (
                        <div className="flex flex-col gap-3">
                          <div>
                            <label className={labelClass}>Libellé</label>
                            <input
                              value={profile.countdown?.label ?? ""}
                              maxLength={60}
                              placeholder="ex : Sortie du projet dans…"
                              onChange={(e) => update({ countdown: { ...profile.countdown, label: e.target.value, targetDate: profile.countdown?.targetDate ?? "" } })}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Date cible</label>
                            <input
                              type="datetime-local"
                              value={profile.countdown?.targetDate ? new Date(profile.countdown.targetDate).toISOString().slice(0, 16) : ""}
                              onChange={(e) => update({ countdown: { label: profile.countdown?.label ?? "", targetDate: e.target.value ? new Date(e.target.value).toISOString() : "" } })}
                              className={inputClass}
                            />
                          </div>
                          {profile.countdown?.targetDate && (
                            <button type="button" className={smallBtnClass} onClick={() => update({ countdown: null })}>
                              Supprimer le compte à rebours
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-zinc-500">Disponible avec un plan Pro ou Elite.</p>
                      )}
                    </div>

                    {/* Twitch embed */}
                    <div className={cardClass}>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Embed Twitch live</p>
                        {!limits.liveEmbed && (
                          <Link href="/dashboard/premium" className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Pro</Link>
                        )}
                      </div>
                      {limits.liveEmbed ? (
                        <div className="flex flex-col gap-2">
                          <label className={labelClass}>Pseudo Twitch</label>
                          <div className="flex gap-2">
                            <input
                              value={profile.twitchChannel ?? ""}
                              maxLength={60}
                              placeholder="monpseudo"
                              onChange={(e) => update({ twitchChannel: e.target.value })}
                              className={inputClass}
                            />
                            {profile.twitchChannel && (
                              <button type="button" className={`${smallBtnClass} shrink-0`} onClick={() => update({ twitchChannel: "" })}>✕</button>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 dark:text-zinc-500">Le player sera intégré sur ta page. Il ne joue que quand tu es en live.</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-zinc-500">Disponible avec un plan Pro ou Elite.</p>
                      )}
                    </div>

                    {/* YouTube live */}
                    <div className={cardClass}>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Lien YouTube live</p>
                        {!limits.liveEmbed && (
                          <Link href="/dashboard/premium" className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Pro</Link>
                        )}
                      </div>
                      {limits.liveEmbed ? (
                        <div className="flex flex-col gap-2">
                          <label className={labelClass}>Handle ou URL YouTube</label>
                          <div className="flex gap-2">
                            <input
                              value={profile.youtubeChannel ?? ""}
                              maxLength={120}
                              placeholder="@monchannel ou https://youtube.com/…"
                              onChange={(e) => update({ youtubeChannel: e.target.value })}
                              className={inputClass}
                            />
                            {profile.youtubeChannel && (
                              <button type="button" className={`${smallBtnClass} shrink-0`} onClick={() => update({ youtubeChannel: "" })}>✕</button>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 dark:text-zinc-500">Affiche un bouton &quot;Regarder en direct&quot; sur ta page.</p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-zinc-500">Disponible avec un plan Pro ou Elite.</p>
                      )}
                    </div>

                    {/* Steam status */}
                    <div className={cardClass}>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Statut Steam</p>
                        {!limits.steamStatus && (
                          <Link href="/dashboard/premium" className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300">Elite</Link>
                        )}
                      </div>
                      {limits.steamStatus ? (
                        <div className="flex flex-col gap-2">
                          <label className={labelClass}>SteamID64</label>
                          <div className="flex gap-2">
                            <input
                              value={profile.steamId ?? ""}
                              maxLength={17}
                              placeholder="76561198XXXXXXXXX"
                              onChange={(e) => update({ steamId: e.target.value.replace(/\D/g, "") })}
                              className={inputClass}
                            />
                            {profile.steamId && (
                              <button type="button" className={`${smallBtnClass} shrink-0`} onClick={() => update({ steamId: "" })}>✕</button>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 dark:text-zinc-500">
                            Affiche le jeu en cours sur ta page. Trouve ton SteamID64 sur{" "}
                            <a href="https://steamid.io" target="_blank" rel="noreferrer" className="underline">steamid.io</a>.
                            Nécessite la variable d&apos;environnement <code className="font-mono">STEAM_API_KEY</code>.
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-zinc-500">Disponible avec un plan Elite.</p>
                      )}
                    </div>

                    {/* Bouton soutenir */}
                    <div className={cardClass}>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">☕ Bouton &quot;Me soutenir&quot;</p>
                        {!limits.supportButton && <Link href="/dashboard/premium" className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Pro</Link>}
                      </div>
                      {limits.supportButton ? (
                        <div className="flex flex-col gap-3">
                          <div>
                            <label className={labelClass}>Libellé</label>
                            <input value={profile.supportButton?.label ?? ""} maxLength={60} placeholder="Me soutenir sur Ko-fi" onChange={(e) => update({ supportButton: { ...(profile.supportButton ?? { url: "" }), label: e.target.value } })} className={inputClass} />
                          </div>
                          <div>
                            <label className={labelClass}>URL (Ko-fi, PayPal, Tipeee…)</label>
                            <input value={profile.supportButton?.url ?? ""} maxLength={300} placeholder="https://ko-fi.com/monpseudo" onChange={(e) => update({ supportButton: { ...(profile.supportButton ?? { label: "" }), url: e.target.value } })} className={inputClass} />
                          </div>
                          {profile.supportButton?.url && <button type="button" className={smallBtnClass} onClick={() => update({ supportButton: null })}>Supprimer</button>}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-zinc-500">Disponible avec un plan Pro ou Elite.</p>
                      )}
                    </div>

                    {/* Planning de stream */}
                    <div className={cardClass}>
                      <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">🎮 Planning de stream</p>
                      <div className="flex flex-col gap-3">
                        <div>
                          <label className={labelClass}>Jours de stream</label>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((d, i) => {
                              const active = profile.streamSchedule?.days?.includes(i) ?? false;
                              return (
                                <button key={d} type="button"
                                  onClick={() => {
                                    const days = profile.streamSchedule?.days ?? [];
                                    const next = active ? days.filter((x) => x !== i) : [...days, i];
                                    update({ streamSchedule: { ...(profile.streamSchedule ?? { timeStart: "" }), days: next } });
                                  }}
                                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${active ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900" : "border-gray-200 text-gray-500 dark:border-zinc-700 dark:text-zinc-400"}`}
                                >{d}</button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <label className={labelClass}>Heure de début</label>
                            <input type="time" value={profile.streamSchedule?.timeStart ?? ""} onChange={(e) => update({ streamSchedule: { ...(profile.streamSchedule ?? { days: [] }), timeStart: e.target.value } })} className={inputClass} />
                          </div>
                          <div className="flex-1">
                            <label className={labelClass}>Heure de fin (opt.)</label>
                            <input type="time" value={profile.streamSchedule?.timeEnd ?? ""} onChange={(e) => update({ streamSchedule: { ...(profile.streamSchedule ?? { days: [], timeStart: "" }), timeEnd: e.target.value } })} className={inputClass} />
                          </div>
                        </div>
                        {profile.streamSchedule && <button type="button" className={smallBtnClass} onClick={() => update({ streamSchedule: null })}>Effacer le planning</button>}
                      </div>
                    </div>

                    {/* Galerie de clips */}
                    <div className={cardClass}>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">🎬 Clips</p>
                        {!limits.clips && <Link href="/dashboard/premium" className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Pro</Link>}
                      </div>
                      {limits.clips > 0 ? (
                        <div className="flex flex-col gap-3">
                          {(profile.clips ?? []).map((clip, i) => (
                            <div key={i} className="flex gap-2">
                              <input value={clip.title ?? ""} maxLength={80} placeholder="Titre du clip" onChange={(e) => { const clips = [...(profile.clips ?? [])]; clips[i] = { ...clip, title: e.target.value }; update({ clips }); }} className={`${inputClass} w-36 shrink-0`} />
                              <input value={clip.url} maxLength={300} placeholder="URL Twitch/YouTube…" onChange={(e) => { const clips = [...(profile.clips ?? [])]; clips[i] = { ...clip, url: e.target.value }; update({ clips }); }} className={inputClass} />
                              <button type="button" className={`${smallBtnClass} shrink-0`} onClick={() => update({ clips: (profile.clips ?? []).filter((_, j) => j !== i) })}>✕</button>
                            </div>
                          ))}
                          {(profile.clips?.length ?? 0) < limits.clips && (
                            <button type="button" className={smallBtnClass} onClick={() => update({ clips: [...(profile.clips ?? []), { url: "", title: "" }] })}>+ Ajouter un clip</button>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-zinc-500">Disponible avec un plan Pro ou Elite.</p>
                      )}
                    </div>
                    </div>{/* end widgets sub-section */}

                  </div>
                )}

                {tab === "apparence" && (
                  <div className={`${cardClass} flex flex-col gap-6`}>
                    {user.plan === "free" ? (
                      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 px-4 py-6 text-center dark:border-indigo-900 dark:bg-indigo-950/20">
                        <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                          18 thèmes disponibles en Pro
                        </p>
                        <p className="text-xs text-indigo-500 dark:text-indigo-400">
                          Effets animés, polices gaming, boutons stylés — un clic règle tout.
                        </p>
                        <Link
                          href="/dashboard/premium"
                          className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                        >
                          Passer à Pro
                        </Link>
                      </div>
                    ) : (
                      <div>
                        <p className={labelClass}>Thèmes prêts à l'emploi</p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {THEME_PRESETS.map((preset) => {
                            const locked =
                              PLAN_RANK[user.plan] < PLAN_RANK[preset.plan];
                            return (
                              <button
                                key={preset.id}
                                type="button"
                                title={
                                  locked
                                    ? `${preset.label} — aperçu Premium`
                                    : preset.label
                                }
                                onClick={() => {
                                  if (locked) {
                                    setPreview(presetTheme(preset));
                                  } else {
                                    setPreview({});
                                    update({
                                      theme: {
                                        ...profile.theme,
                                        ...presetTheme(preset),
                                      },
                                      // Efface les couleurs individuelles de liens : une
                                      // couleur claire d'un ancien thème rendrait les boutons
                                      // invisibles avec les styles bevel/gradient du preset.
                                      links: profile.links.map(
                                        ({ color: _c, ...l }) => l
                                      ),
                                    });
                                  }
                                }}
                                className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                                  locked
                                    ? "border-dashed border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500 dark:border-zinc-700 dark:text-zinc-500"
                                    : "border-gray-200 text-gray-600 hover:border-gray-400 dark:border-zinc-700 dark:text-zinc-300"
                                }`}
                              >
                                <span>{preset.emoji}</span>
                                {preset.label}
                                {locked && <LockIcon />}
                              </button>
                            );
                          })}
                        </div>
                        <p className="mt-2 text-xs text-gray-400 dark:text-zinc-500">
                          Un clic règle tout : fond, police, boutons, effets. Tu
                          peux ensuite affiner chaque option.
                        </p>
                      </div>
                    )}

                    <div>
                      <p className={labelClass}>Couleur d'accent</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {ACCENT_PRESETS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            aria-label={`Couleur ${color}`}
                            onClick={() =>
                              update({ theme: { ...profile.theme, accent: color } })
                            }
                            className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                              profile.theme.accent === color
                                ? "border-zinc-900 dark:border-white"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <input
                          type="color"
                          value={profile.theme.accent}
                          onChange={(e) =>
                            update({
                              theme: { ...profile.theme, accent: e.target.value },
                            })
                          }
                          aria-label="Couleur personnalisée"
                          className="h-8 w-8 cursor-pointer rounded-full border border-gray-200 bg-transparent dark:border-zinc-700"
                        />
                      </div>
                    </div>

                    <OptionGrid
                      label="Effet animé"
                      options={Object.keys(EFFECT_LABELS) as EffectId[]}
                      allowed={limits.effects}
                      value={preview.effect ?? profile.theme.effect}
                      labels={EFFECT_LABELS}
                      columns={4}
                      onSelect={(effect, locked) => selectTheme("effect", effect, locked)}
                    />

                    {(preview.effect ?? profile.theme.effect) === "emoji" &&
                      limits.effects.includes("emoji") && (
                        <div className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 dark:border-zinc-800">
                          <label className="text-xs text-gray-500 dark:text-zinc-400">
                            Emoji qui pleut :
                          </label>
                          <input
                            value={profile.theme.effectEmoji ?? "🔥"}
                            maxLength={4}
                            onChange={(e) =>
                              update({
                                theme: {
                                  ...profile.theme,
                                  effectEmoji: e.target.value,
                                },
                              })
                            }
                            className={`${inputClass} w-16 text-center text-lg`}
                          />
                        </div>
                      )}

                    <OptionGrid
                      label="Police de la page"
                      options={Object.keys(FONT_META) as FontId[]}
                      allowed={limits.fonts}
                      value={preview.font ?? profile.theme.font ?? THEME_DEFAULTS.font}
                      labels={Object.fromEntries(
                        (Object.keys(FONT_META) as FontId[]).map((f) => [
                          f,
                          FONT_META[f].label,
                        ])
                      ) as Record<FontId, string>}
                      columns={3}
                      previewFont={(f) => FONT_META[f].family}
                      onSelect={(font, locked) => selectTheme("font", font, locked)}
                    />

                    <OptionGrid
                      label="Police du pseudo"
                      options={Object.keys(FONT_META) as FontId[]}
                      allowed={limits.fonts}
                      value={
                        preview.nameFont ??
                        profile.theme.nameFont ??
                        profile.theme.font ??
                        THEME_DEFAULTS.font
                      }
                      labels={Object.fromEntries(
                        (Object.keys(FONT_META) as FontId[]).map((f) => [
                          f,
                          FONT_META[f].label,
                        ])
                      ) as Record<FontId, string>}
                      columns={3}
                      previewFont={(f) => FONT_META[f].family}
                      onSelect={(nameFont, locked) =>
                        selectTheme("nameFont", nameFont, locked)
                      }
                    />

                    <OptionGrid
                      label="Style des boutons"
                      options={Object.keys(BUTTON_STYLE_LABELS) as ButtonStyleId[]}
                      allowed={limits.buttonStyles}
                      value={
                        preview.buttonStyle ??
                        profile.theme.buttonStyle ??
                        THEME_DEFAULTS.buttonStyle
                      }
                      labels={BUTTON_STYLE_LABELS}
                      columns={3}
                      onSelect={(buttonStyle, locked) =>
                        selectTheme("buttonStyle", buttonStyle, locked)
                      }
                    />

                    <OptionGrid
                      label="Cadre d'avatar"
                      options={Object.keys(AVATAR_FRAME_LABELS) as AvatarFrameId[]}
                      allowed={limits.avatarFrames}
                      value={
                        preview.avatarFrame ??
                        profile.theme.avatarFrame ??
                        THEME_DEFAULTS.avatarFrame
                      }
                      labels={AVATAR_FRAME_LABELS}
                      columns={5}
                      onSelect={(avatarFrame, locked) =>
                        selectTheme("avatarFrame", avatarFrame, locked)
                      }
                    />

                    <OptionGrid
                      label="Curseur de la page"
                      options={Object.keys(CURSOR_LABELS) as CursorId[]}
                      allowed={limits.cursors}
                      value={
                        preview.cursor ?? profile.theme.cursor ?? THEME_DEFAULTS.cursor
                      }
                      labels={CURSOR_LABELS}
                      columns={4}
                      onSelect={(cursor, locked) => selectTheme("cursor", cursor, locked)}
                    />

                    <div>
                      <p className={labelClass}>Mise en page</p>
                      <div className="flex gap-2">
                        {(
                          [
                            { id: "card", label: "Carte" },
                            { id: "clean", label: "Épuré" },
                          ] as const
                        ).map((l) => (
                          <button
                            key={l.id}
                            type="button"
                            onClick={() =>
                              update({ theme: { ...profile.theme, layout: l.id } })
                            }
                            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                              profile.theme.layout === l.id
                                ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                                : "border-gray-200 text-gray-600 hover:border-gray-400 dark:border-zinc-700 dark:text-zinc-300"
                            }`}
                          >
                            {l.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-100 p-4 dark:border-zinc-800">
                      <p className={labelClass}>
                        Disposition de la carte{" "}
                        {!limits.customLayout && "(plans Pro et Elite)"}
                      </p>
                      {limits.customLayout ? (
                        <div className="flex flex-col gap-4">
                          <OptionGrid
                            label="Position verticale"
                            options={["top", "center", "bottom"] as CardAlign[]}
                            allowed={["top", "center", "bottom"] as CardAlign[]}
                            value={profile.theme.cardAlign ?? LAYOUT_DEFAULTS.cardAlign}
                            labels={CARD_ALIGN_LABELS}
                            columns={3}
                            onSelect={(cardAlign) =>
                              update({ theme: { ...profile.theme, cardAlign } })
                            }
                          />
                          <Slider
                            label="Largeur de la carte"
                            unit=" px"
                            min={300}
                            max={560}
                            value={profile.theme.cardWidth ?? LAYOUT_DEFAULTS.cardWidth}
                            onChange={(cardWidth) =>
                              update({ theme: { ...profile.theme, cardWidth } })
                            }
                          />
                          <Slider
                            label="Arrondi du cadre"
                            unit=" px"
                            min={0}
                            max={40}
                            value={profile.theme.cardRadius ?? LAYOUT_DEFAULTS.cardRadius}
                            onChange={(cardRadius) =>
                              update({ theme: { ...profile.theme, cardRadius } })
                            }
                          />
                          <Slider
                            label="Marge intérieure"
                            unit=" px"
                            min={8}
                            max={40}
                            value={profile.theme.cardPadding ?? LAYOUT_DEFAULTS.cardPadding}
                            onChange={(cardPadding) =>
                              update({ theme: { ...profile.theme, cardPadding } })
                            }
                          />
                          <Slider
                            label="Taille des infos"
                            unit=" %"
                            min={80}
                            max={130}
                            value={profile.theme.contentScale ?? LAYOUT_DEFAULTS.contentScale}
                            onChange={(contentScale) =>
                              update({ theme: { ...profile.theme, contentScale } })
                            }
                          />
                          <button
                            type="button"
                            className={`${smallBtnClass} self-start`}
                            onClick={() =>
                              update({
                                theme: {
                                  ...profile.theme,
                                  cardWidth: LAYOUT_DEFAULTS.cardWidth,
                                  cardAlign: LAYOUT_DEFAULTS.cardAlign,
                                  cardRadius: LAYOUT_DEFAULTS.cardRadius,
                                  cardPadding: LAYOUT_DEFAULTS.cardPadding,
                                  contentScale: LAYOUT_DEFAULTS.contentScale,
                                },
                              })
                            }
                          >
                            Réinitialiser la disposition
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-zinc-500">
                          Règle la taille, la position et les marges de ta carte
                          avec un{" "}
                          <Link href="/dashboard/premium" className="underline">
                            plan payant
                          </Link>
                          .
                        </p>
                      )}
                    </div>

                    <div>
                      <p className={labelClass}>
                        Fond personnalisé {!limits.customBackground && "(plans Pro et Elite)"}
                      </p>
                      {limits.customBackground ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            {profile.backgroundUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={profile.backgroundUrl}
                                alt="Fond"
                                className="h-12 w-20 shrink-0 rounded-lg border border-gray-200 object-cover dark:border-zinc-700"
                              />
                            )}
                            <input
                              value={profile.backgroundUrl}
                              maxLength={500}
                              placeholder="URL image de fond (https://…)"
                              onChange={(e) => update({ backgroundUrl: e.target.value })}
                              className={inputClass}
                            />
                            {profile.backgroundUrl && (
                              <button type="button" className={`${smallBtnClass} shrink-0`} onClick={() => update({ backgroundUrl: "" })}>Retirer</button>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {profile.backgroundVideoUrl && (
                              <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                                🎬 Vidéo
                              </span>
                            )}
                            <input
                              value={profile.backgroundVideoUrl ?? ""}
                              maxLength={500}
                              placeholder="URL vidéo de fond MP4 (https://…)"
                              onChange={(e) => update({ backgroundVideoUrl: e.target.value })}
                              className={inputClass}
                            />
                            {profile.backgroundVideoUrl && (
                              <button type="button" className={`${smallBtnClass} shrink-0`} onClick={() => update({ backgroundVideoUrl: "" })}>Retirer</button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-zinc-500">
                          Ajoute ta propre image de fond avec un{" "}
                          <Link href="/dashboard/premium" className="underline">
                            plan payant
                          </Link>
                          .
                        </p>
                      )}
                    </div>

                    <div className="rounded-lg border border-gray-100 p-4 dark:border-zinc-800">
                      <p className={labelClass}>
                        Full custom{" "}
                        {!limits.fullCustom && "(plans Pro et Elite)"}
                      </p>
                      {limits.fullCustom ? (
                        <div className="flex flex-col gap-5">
                          <OptionGrid
                            label="Type de fond"
                            options={Object.keys(BG_TYPE_LABELS) as BgType[]}
                            allowed={Object.keys(BG_TYPE_LABELS) as BgType[]}
                            value={profile.theme.bgType ?? FULLCUSTOM_DEFAULTS.bgType}
                            labels={BG_TYPE_LABELS}
                            columns={4}
                            onSelect={(bgType) =>
                              update({ theme: { ...profile.theme, bgType } })
                            }
                          />
                          {(profile.theme.bgType ?? "accent") === "solid" && (
                            <ColorField
                              label="Couleur du fond"
                              value={profile.theme.bgColor ?? FULLCUSTOM_DEFAULTS.bgColor}
                              onChange={(bgColor) =>
                                update({ theme: { ...profile.theme, bgColor } })
                              }
                            />
                          )}
                          {(profile.theme.bgType ?? "accent") === "gradient" && (
                            <>
                              <ColorField
                                label="Dégradé — couleur 1"
                                value={profile.theme.bgColor ?? FULLCUSTOM_DEFAULTS.bgColor}
                                onChange={(bgColor) =>
                                  update({ theme: { ...profile.theme, bgColor } })
                                }
                              />
                              <ColorField
                                label="Dégradé — couleur 2"
                                value={profile.theme.bgColor2 ?? FULLCUSTOM_DEFAULTS.bgColor2}
                                onChange={(bgColor2) =>
                                  update({ theme: { ...profile.theme, bgColor2 } })
                                }
                              />
                              <Slider
                                label="Angle du dégradé"
                                unit="°"
                                min={0}
                                max={360}
                                value={profile.theme.bgAngle ?? FULLCUSTOM_DEFAULTS.bgAngle}
                                onChange={(bgAngle) =>
                                  update({ theme: { ...profile.theme, bgAngle } })
                                }
                              />
                            </>
                          )}
                          <Slider
                            label="Assombrir le fond"
                            unit=" %"
                            min={0}
                            max={85}
                            value={profile.theme.bgDim ?? FULLCUSTOM_DEFAULTS.bgDim}
                            onChange={(bgDim) =>
                              update({ theme: { ...profile.theme, bgDim } })
                            }
                          />

                          <div className="border-t border-gray-100 pt-4 dark:border-zinc-800">
                            <p className={labelClass}>Carte</p>
                            <div className="flex flex-col gap-3">
                              <ColorField
                                label="Couleur de la carte"
                                value={profile.theme.cardBg ?? "#000000"}
                                onChange={(cardBg) =>
                                  update({ theme: { ...profile.theme, cardBg } })
                                }
                              />
                              <Slider
                                label="Opacité de la carte"
                                unit=" %"
                                min={0}
                                max={100}
                                value={
                                  profile.theme.cardBgOpacity ??
                                  FULLCUSTOM_DEFAULTS.cardBgOpacity
                                }
                                onChange={(cardBgOpacity) =>
                                  update({ theme: { ...profile.theme, cardBgOpacity } })
                                }
                              />
                              <Slider
                                label="Flou de la carte"
                                unit=" px"
                                min={0}
                                max={24}
                                value={profile.theme.cardBlur ?? FULLCUSTOM_DEFAULTS.cardBlur}
                                onChange={(cardBlur) =>
                                  update({ theme: { ...profile.theme, cardBlur } })
                                }
                              />
                            </div>
                          </div>

                          <div className="border-t border-gray-100 pt-4 dark:border-zinc-800">
                            <p className={labelClass}>Couleurs de texte</p>
                            <div className="flex flex-col gap-3">
                              <ColorField
                                label="Couleur du pseudo"
                                value={profile.theme.nameColor ?? "#ffffff"}
                                onChange={(nameColor) =>
                                  update({ theme: { ...profile.theme, nameColor } })
                                }
                              />
                              <ColorField
                                label="Couleur de la bio"
                                value={profile.theme.bioColor ?? "#ffffff"}
                                onChange={(bioColor) =>
                                  update({ theme: { ...profile.theme, bioColor } })
                                }
                              />
                            </div>
                          </div>

                          <div className="border-t border-gray-100 pt-4 dark:border-zinc-800">
                            <OptionGrid
                              label="Forme de l'avatar"
                              options={Object.keys(AVATAR_SHAPE_LABELS) as AvatarShape[]}
                              allowed={Object.keys(AVATAR_SHAPE_LABELS) as AvatarShape[]}
                              value={
                                profile.theme.avatarShape ??
                                FULLCUSTOM_DEFAULTS.avatarShape
                              }
                              labels={AVATAR_SHAPE_LABELS}
                              columns={3}
                              onSelect={(avatarShape) =>
                                update({ theme: { ...profile.theme, avatarShape } })
                              }
                            />
                            <div className="mt-3">
                              <Slider
                                label="Taille de l'avatar"
                                unit=" px"
                                min={64}
                                max={140}
                                value={
                                  profile.theme.avatarSize ??
                                  FULLCUSTOM_DEFAULTS.avatarSize
                                }
                                onChange={(avatarSize) =>
                                  update({ theme: { ...profile.theme, avatarSize } })
                                }
                              />
                            </div>
                          </div>

                          <div className="border-t border-gray-100 pt-4 dark:border-zinc-800">
                            <p className={labelClass}>Bordure de la carte</p>
                            <div className="flex flex-col gap-3">
                              <ColorField
                                label="Couleur de la bordure"
                                value={profile.theme.cardBorderColor ?? "#ffffff"}
                                onChange={(cardBorderColor) =>
                                  update({ theme: { ...profile.theme, cardBorderColor } })
                                }
                              />
                              <Slider
                                label="Épaisseur de la bordure"
                                unit=" px"
                                min={0}
                                max={6}
                                value={profile.theme.cardBorderWidth ?? 1}
                                onChange={(cardBorderWidth) =>
                                  update({ theme: { ...profile.theme, cardBorderWidth } })
                                }
                              />
                            </div>
                          </div>

                          <div className="border-t border-gray-100 pt-4 dark:border-zinc-800">
                            <ColorField
                              label="Couleur du texte des boutons"
                              value={profile.theme.buttonTextColor ?? "#ffffff"}
                              onChange={(buttonTextColor) =>
                                update({ theme: { ...profile.theme, buttonTextColor } })
                              }
                            />
                          </div>

                          <div className="border-t border-gray-100 pt-4 dark:border-zinc-800">
                            <OptionGrid
                              label="Effet sur le pseudo"
                              options={Object.keys(NAME_EFFECT_LABELS) as NameEffect[]}
                              allowed={Object.keys(NAME_EFFECT_LABELS) as NameEffect[]}
                              value={profile.theme.nameEffect ?? "none"}
                              labels={NAME_EFFECT_LABELS}
                              columns={5}
                              onSelect={(nameEffect) =>
                                update({ theme: { ...profile.theme, nameEffect } })
                              }
                            />
                          </div>

                          <div className="border-t border-gray-100 pt-4 dark:border-zinc-800">
                            <OptionGrid
                              label="Animation d'entrée de la carte"
                              options={Object.keys(CARD_INTRO_LABELS) as CardIntro[]}
                              allowed={Object.keys(CARD_INTRO_LABELS) as CardIntro[]}
                              value={profile.theme.cardIntro ?? "none"}
                              labels={CARD_INTRO_LABELS}
                              columns={4}
                              onSelect={(cardIntro) =>
                                update({ theme: { ...profile.theme, cardIntro } })
                              }
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-zinc-500">
                          Fond, couleurs de texte, carte, bordure, avatar, effets
                          de pseudo — 100% personnalisables avec un{" "}
                          <Link href="/dashboard/premium" className="underline">
                            plan payant
                          </Link>
                          .
                        </p>
                      )}
                    </div>

                    {/* Musique de fond */}
                    <div className="rounded-lg border border-gray-100 p-4 dark:border-zinc-800">
                      <p className={labelClass}>
                        Musique de fond {!limits.music && "(plans Pro et Elite)"}
                      </p>
                      {limits.music ? (
                        <div className="flex items-center gap-3">
                          {profile.theme.musicUrl && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                              ♪ Musique importée
                            </span>
                          )}
                          <AudioUpload
                            onUploaded={(url) =>
                              update({ theme: { ...profile.theme, musicUrl: url } })
                            }
                            onError={setError}
                          />
                          {profile.theme.musicUrl && (
                            <button
                              type="button"
                              className={smallBtnClass}
                              onClick={() =>
                                update({ theme: { ...profile.theme, musicUrl: "" } })
                              }
                            >
                              Retirer
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-zinc-500">
                          Ajoute une musique de fond à ta page avec un{" "}
                          <Link href="/dashboard/premium" className="underline">
                            plan payant
                          </Link>
                          .
                        </p>
                      )}
                    </div>

                    {/* Statut Discord en direct (opt-in, Elite) */}
                    <div className="rounded-lg border border-gray-100 p-4 dark:border-zinc-800">
                      <p className={labelClass}>
                        Statut Discord en direct{" "}
                        {!limits.discordPresence && "(plan Elite)"}
                      </p>
                      {limits.discordPresence ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <input
                              value={profile.theme.discordId ?? ""}
                              onChange={(e) =>
                                update({
                                  theme: {
                                    ...profile.theme,
                                    discordId: e.target.value.replace(/\D/g, ""),
                                  },
                                })
                              }
                              placeholder="Ton ID Discord (ex: 1234567890123456789)"
                              inputMode="numeric"
                              className={`${inputClass} w-full max-w-xs`}
                            />
                            {profile.theme.discordId && (
                              <button
                                type="button"
                                className={smallBtnClass}
                                onClick={() =>
                                  update({
                                    theme: { ...profile.theme, discordId: "" },
                                  })
                                }
                              >
                                Désactiver
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 dark:text-zinc-500">
                            Optionnel. Affiche ton statut (en ligne, en jeu…) sur ta
                            page via l'API publique Lanyard. Tu dois rejoindre le{" "}
                            <a
                              href="https://discord.gg/lanyard"
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              serveur Discord Lanyard
                            </a>{" "}
                            pour que ton statut soit visible. Active uniquement si tu
                            veux partager ces infos publiquement — tu peux désactiver
                            à tout moment.
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-zinc-500">
                          Montre en direct si tu es en ligne ou en jeu sur Discord
                          avec le plan{" "}
                          <Link href="/dashboard/premium" className="underline">
                            Elite
                          </Link>
                          .
                        </p>
                      )}
                    </div>

                    {/* Décorations superposées */}
                    <div>
                      {limits.maxDecorations > 0 ? (
                        (() => {
                          const decos =
                            profile.decorations && profile.decorations.length
                              ? profile.decorations
                              : profile.decoration
                                ? [profile.decoration]
                                : [];
                          const setDecos = (list: typeof decos) =>
                            update({ decorations: list, decoration: null });
                          const fontFamily =
                            FONT_META[profile.theme.font ?? THEME_DEFAULTS.font]
                              ?.family;
                          return (
                            <div className="flex flex-col gap-4">
                              <p className="text-sm text-gray-500 dark:text-zinc-400">
                                {decos.length}/{limits.maxDecorations} décorations
                                (logo ou pseudo en filigrane)
                              </p>
                              {decos.map((deco, i) => (
                                <div
                                  key={i}
                                  className="rounded-lg border border-gray-100 p-3 dark:border-zinc-800"
                                >
                                  <p className="mb-1 text-xs font-semibold text-gray-400 dark:text-zinc-500">
                                    Décoration {i + 1}
                                  </p>
                                  <DecorationEditor
                                    decoration={deco}
                                    onChange={(d) => {
                                      if (d === null) {
                                        setDecos(decos.filter((_, j) => j !== i));
                                      } else {
                                        setDecos(decos.map((x, j) => (j === i ? d : x)));
                                      }
                                    }}
                                      accent={profile.theme.accent}
                                    fontFamily={fontFamily}
                                    onError={setError}
                                  />
                                </div>
                              ))}
                              {decos.length < limits.maxDecorations && (
                                <div className="rounded-lg border border-dashed border-gray-200 p-3 dark:border-zinc-700">
                                  <p className="mb-1 text-xs font-semibold text-gray-400 dark:text-zinc-500">
                                    Ajouter une décoration
                                  </p>
                                  <DecorationEditor
                                    decoration={null}
                                    onChange={(d) => {
                                      if (d) setDecos([...decos, d]);
                                    }}
                                      accent={profile.theme.accent}
                                    fontFamily={fontFamily}
                                    onError={setError}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        <>
                          <p className={labelClass}>
                            Logo ou pseudo en filigrane (plans Pro et Elite)
                          </p>
                          <p className="text-sm text-gray-400 dark:text-zinc-500">
                            Superpose logos et pseudos en filigrane, déplaçables et
                            redimensionnables, avec un{" "}
                            <Link href="/dashboard/premium" className="underline">
                              plan payant
                            </Link>
                            .
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {isDesktop && (
            <aside className="w-full shrink-0 lg:w-[360px]">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
                  Aperçu en direct
                </p>
                <div className="flex gap-1 rounded-lg border border-gray-200 p-0.5 text-xs dark:border-zinc-700">
                  {[{ id: true, label: "📱" }, { id: false, label: "🖥️" }].map(({ id, label }) => (
                    <button
                      key={String(id)}
                      type="button"
                      title={id ? "Vue mobile" : "Vue desktop"}
                      onClick={() => setPreviewMobile(id)}
                      className={`rounded px-2 py-0.5 transition-colors ${previewMobile === id ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "text-gray-500 hover:text-gray-700 dark:text-zinc-400"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sticky top-8">
                {previewMobile ? previewBox(0.65) : previewBox(0.9)}
                {previewActive && (
                  <div className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-900/50 dark:bg-indigo-950/40">
                    <p className="text-xs font-medium text-indigo-800 dark:text-indigo-300">
                      Tu prévisualises des options Premium. Elles ne seront pas
                      enregistrées tant que tu n&apos;as pas un plan payant.
                    </p>
                    <Link
                      href="/dashboard/premium"
                      className="mt-2 block rounded-lg bg-indigo-600 py-2 text-center text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    >
                      Débloquer avec Pro ou Elite
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MaPagePage() {
  return (
    <Suspense>
      <MaPageEditor />
    </Suspense>
  );
}
