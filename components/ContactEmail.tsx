"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/lib/config";
import { haptics } from "@/lib/haptics";

// Adresse de contact fiable partout : un clic copie l'email dans le
// presse-papiers (avec confirmation), au lieu d'un lien mailto: qui n'ouvre
// rien sur les appareils sans client mail configuré (mobile, PWA, kiosque…).
export default function ContactEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(CONTACT_EMAIL).catch(() => {});
    haptics.success();
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button
      type="button"
      onClick={copy}
      title="Cliquer pour copier l'adresse email"
      aria-label={`Copier l'adresse email ${CONTACT_EMAIL}`}
      className={
        className ??
        "inline font-medium text-gray-700 underline decoration-dotted underline-offset-2 transition-colors hover:text-gray-900 active:scale-95 dark:text-zinc-200 dark:hover:text-white"
      }
    >
      {copied ? "Adresse copiée ✓" : CONTACT_EMAIL}
    </button>
  );
}
