export const SITE_NAME = "Movalink";
export const SITE_URL = "https://movalink.vercel.app";
export const CONTACT_EMAIL = "movalink.help@gmail.com";
export const SITE_TAGLINE = "Tout ton univers gaming. Un seul lien.";

// ─── Lancement en douceur ────────────────────────────────────────────────────
// Tant que Stripe n'est pas configuré, tout le site est offert au niveau Elite :
// chaque compte débloque toutes les fonctionnalités et le badge Movalink est
// retiré, sans paiement. Les offres payantes sont masquées.
// Repasser à `false` (et redéployer) une fois la facturation Stripe en place
// pour réactiver les plans Gratuit / Pro / Elite.
export const FREE_LAUNCH = true;

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
