export const SITE_NAME = "Movalink";
export const SITE_URL = "https://movalink.vercel.app";
export const CONTACT_EMAIL = "movalink.help@gmail.com";
export const SITE_TAGLINE = "Tout ton univers gaming. Un seul lien.";

// Codes cadeaux : débloquent un plan sans paiement. Comparés en majuscules.
// Usage unique par compte (sauf après réinitialisation).
export const PROMO_CODES: Record<string, "pro" | "elite"> = {
  AQUOX: "pro",
  AQUOXMAX: "elite",
};

// Code privé (tests) : remet le compte au plan Gratuit et efface l'historique
// des codes utilisés, permettant de re-saisir les autres codes. Réutilisable.
export const RESET_CODE = "AQUOXRESET";

// Codes de réduction appliqués au paiement Stripe : pourcentage de remise sur
// le prix. Comparés en majuscules. La remise est calculée côté serveur dans
// /api/checkout — jamais depuis le navigateur — donc infalsifiable.
export const DISCOUNT_CODES: Record<string, number> = {
  MOVALINK10: 10,
};
