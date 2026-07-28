"use client";

// Retour haptique léger sur mobile. L'API Vibration n'existe que sur
// Android/Chrome ; sur iOS et desktop l'appel est simplement ignoré. On la
// couple systématiquement à une micro-animation visuelle (active:scale, pop…)
// pour que la sensation « satisfaisante » existe sur tous les appareils.

type Pattern = number | number[];

let enabled = true;

function fire(pattern: Pattern) {
  if (!enabled || typeof navigator === "undefined") return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* API absente ou refusée : on ignore silencieusement. */
  }
}

export const haptics = {
  /** Tap discret : boutons, clics simples. */
  tap: () => fire(10),
  /** Sélection dans une liste/grille (effets, polices…). */
  select: () => fire(13),
  /** Bascule d'un interrupteur ou d'une case. */
  toggle: () => fire(8),
  /** Confirmation réussie (copie, enregistrement, achat). */
  success: () => fire([12, 30, 14]),
  /** Erreur / action refusée. */
  error: () => fire([28, 40, 28]),
  /** Impact plus marqué (drag & drop, suppression). */
  impact: () => fire(22),
  /** Active/désactive globalement l'haptique (préférence utilisateur). */
  setEnabled: (v: boolean) => {
    enabled = v;
  },
};
