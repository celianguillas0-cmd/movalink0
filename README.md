# Movalink

Ta page de profil gaming : liens, réseaux, jeux, effets animés et statistiques — un seul lien à partager. En ligne sur [movalink.vercel.app](https://movalink.vercel.app).

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4, police Geist, design monochrome (inspiré de rivtools)
- Auth maison : bcryptjs + JWT (jose) en cookie httpOnly `ml_session`
- Données : Upstash Redis en production (`lib/store.ts`), fichier JSON `.data/db.json` en dev local
- Images (avatars, fonds) : Vercel Blob (store `movalink-media`)
- Paiement : Stripe Checkout (paiement unique, prix inline, vérification via l'API sans webhook)

## Lancer en local

```bash
npm install
npm run dev
```

`.env.local` requis :

```
AUTH_SECRET=<chaîne aléatoire>
BLOB_READ_WRITE_TOKEN=<token du store movalink-media>
```

Sans variables Upstash (`UPSTASH_REDIS_REST_URL`/`KV_REST_API_URL`), les données vont dans `.data/db.json` (parfait pour le dev). Sans `STRIPE_SECRET_KEY` en dev, le bouton d'upgrade bascule le plan directement (mode test).

## Plans

| | Gratuit | Pro (3,49 € à vie) | Elite (5,99 € à vie) |
|---|---|---|---|
| Liens | 5 | 15 | 50 |
| Jeux | 5 | 15 | 50 |
| Effets | 3 | 6 | 8 (dont plasma, matrix) |
| Fond personnalisé | — | Oui | Oui |
| Badge Movalink | Affiché | Retiré | Retiré |
| Historique stats | 7 j | 30 j | 365 j |
| Upload max | 2 Mo | 5 Mo | 8 Mo |

Les limites sont appliquées côté serveur dans `app/api/profile/route.ts` (`PLAN_LIMITS` dans `lib/types.ts`).

## Structure

- `app/[username]/page.tsx` — page publique (dynamique, tracking vues/clics anonyme)
- `app/dashboard/page.tsx` — éditeur complet avec aperçu en direct
- `app/legal/*` — CGU/CGV, politique de confidentialité, mentions légales
- `app/report/page.tsx` + `app/api/report` — signalement de contenu (obligation LCEN/DSA)
- `components/ProfileView.tsx` — rendu du profil partagé entre page publique et aperçu
- `components/Effects.tsx` — effets canvas (neige, pluie, étoiles, sakura, matrix) et CSS (plasma, aurora)

## Déploiement

Projet Vercel `movalink` (compte celianguillas0-cmd). `vercel --prod` depuis ce dossier. Pour la persistance en production, l'intégration marketplace **Upstash for Redis** doit être connectée au projet (fournit `KV_REST_API_URL`/`KV_REST_API_TOKEN`).

## À compléter avant une vraie commercialisation

- Renseigner l'identité de l'éditeur dans `app/legal/mentions-legales/page.tsx` (nom, statut, SIREN)
- Faire relire CGU/CGV par un avocat une fois le MRR au rendez-vous
- Vérifier que la clé `STRIPE_SECRET_KEY` du projet Vercel correspond bien au compte Stripe voulu (héritée de l'ancien projet restocky)
