import type { Metadata } from "next";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  return (
    <article>
      <h1>Mentions légales</h1>
      <p>Dernière mise à jour : 17 juillet 2026</p>
      <p>
        Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour
        la confiance dans l'économie numérique (LCEN), les présentes mentions
        légales sont portées à la connaissance des utilisateurs et visiteurs
        du site {SITE_NAME}.
      </p>

      <h2>1. Éditeur du site</h2>
      <p>
        Le site {SITE_NAME}, accessible à l'adresse{" "}
        <strong>{SITE_URL}</strong>, est édité par une personne physique agissant
        en qualité de micro-entrepreneur :
      </p>
      <div className="border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 my-4 text-sm">
        <p className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
          ⚠ Informations à compléter avant mise en ligne définitive
        </p>
        <ul className="text-amber-700 dark:text-amber-400 space-y-1 mb-0">
          <li><strong>Nom et prénom</strong> : [NOM PRÉNOM DE L'ÉDITEUR]</li>
          <li><strong>Statut</strong> : Micro-entrepreneur / Entrepreneur individuel</li>
          <li><strong>Numéro SIREN</strong> : [SIREN — obligatoire après immatriculation au RCS ou registre national des entreprises]</li>
          <li><strong>Adresse postale</strong> : [ADRESSE COMPLÈTE — obligatoire] — peut être une boîte postale</li>
          <li><strong>Email de contact</strong> : {CONTACT_EMAIL}</li>
        </ul>
      </div>
      <p>
        <strong>Directeur de la publication</strong> : l'éditeur tel que désigné
        ci-dessus.
      </p>
      <p className="text-sm text-gray-500 dark:text-zinc-400">
        <em>
          Note : l'immatriculation en tant que micro-entrepreneur auprès du
          guichet unique (guichet-entreprises.fr) est obligatoire dès lors que
          le Service génère un chiffre d'affaires, même symbolique (art. L123-1-1
          du Code de commerce). Le numéro SIREN attribué doit figurer dans ces
          mentions légales, sur les factures et sur les pages de vente.
        </em>
      </p>

      <h2>2. Hébergement</h2>
      <p>
        Le site et ses données applicatives sont hébergés par :
      </p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong><br />
          440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis<br />
          Site :{" "}
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
            vercel.com
          </a>
          <br />
          Rôle : hébergement du code et de l'application (Vercel Edge Network),
          stockage des données (Vercel Blob)
        </li>
      </ul>
      <p>
        Les transferts de données vers Vercel Inc. (États-Unis) sont encadrés
        par les Clauses Contractuelles Types (CCT) de la Commission européenne
        et le Data Privacy Framework UE-États-Unis (décision d'adéquation du
        10 juillet 2023).
      </p>

      <h2>3. Traitement des paiements</h2>
      <p>
        Les paiements en ligne sont traités par :
      </p>
      <ul>
        <li>
          <strong>Stripe, Inc.</strong><br />
          354 Oyster Point Blvd, South San Francisco, CA 94080, États-Unis<br />
          Site :{" "}
          <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">
            stripe.com
          </a>
          <br />
          Agrément : établissement de monnaie électronique agréé par la FCA
          (Financial Conduct Authority, Royaume-Uni)
        </li>
      </ul>

      <h2>4. Propriété intellectuelle</h2>
      <p>
        L'ensemble des éléments constituant le site {SITE_NAME} — structure,
        design, logo, textes, code source, architecture — est protégé par le
        droit de la propriété intellectuelle (articles L111-1 et suivants du
        Code de la propriété intellectuelle). Toute reproduction, représentation,
        modification ou extraction, totale ou partielle, sans autorisation
        préalable écrite de l'Éditeur, constitue une contrefaçon sanctionnable
        pénalement et civilement.
      </p>
      <p>
        Les contenus publiés par les Utilisateurs sur leurs Pages de profil
        restent leur propriété exclusive et relèvent de leur seule
        responsabilité.
      </p>

      <h2>5. Données personnelles</h2>
      <p>
        Le traitement des données personnelles des utilisateurs est décrit dans
        la{" "}
        <a href="/legal/confidentialite">politique de confidentialité</a>.
        L'Éditeur est responsable de traitement au sens du RGPD. Aucune
        déclaration préalable auprès de la CNIL n'est requise depuis l'entrée
        en vigueur du RGPD (25 mai 2018).
      </p>
      <p>
        Pour exercer tes droits RGPD (accès, rectification, effacement,
        portabilité, opposition) : {CONTACT_EMAIL}.
      </p>

      <h2>6. Signalement de contenus illicites</h2>
      <p>
        Conformément à l'article 6-I-7 de la loi n° 2004-575 du 21 juin 2004
        (LCEN) et au règlement (UE) 2022/2065 sur les services numériques (DSA),
        tout contenu potentiellement illicite publié sur le Service peut être
        signalé :
      </p>
      <ul>
        <li>Via le formulaire en ligne : <a href="/report">{SITE_URL}/report</a></li>
        <li>Par email : {CONTACT_EMAIL}</li>
      </ul>
      <p>
        Les signalements sont traités sans délai. Tout contenu manifestement
        illicite est retiré ou rendu inaccessible promptement après notification
        valide. L'Éditeur notifie les autorités compétentes (PHAROS) pour les
        contenus visés à l'article 6-I-7 de la LCEN (incitation à la haine,
        atteintes aux mineurs, etc.).
      </p>

      <h2>7. Médiation</h2>
      <p>
        En cas de litige lié à un achat, et après réclamation préalable auprès
        de l'Éditeur à {CONTACT_EMAIL}, tu peux saisir gratuitement le médiateur
        de la consommation :
      </p>
      <ul>
        <li>
          <strong>CM2C — Centre de la Médiation de la Consommation de
          Conciliateurs de Justice</strong><br />
          49, rue de Ponthieu — 75008 Paris<br />
          <a href="https://www.cm2c.net" target="_blank" rel="noopener noreferrer">
            www.cm2c.net
          </a>{" "}
          — cm2c@cm2c.net
        </li>
      </ul>

      <h2>8. Contact</h2>
      <p>
        Pour toute question ou réclamation : {CONTACT_EMAIL}
      </p>
      <p>
        L'Éditeur s'engage à répondre à toute demande dans un délai raisonnable
        (48 heures ouvrées pour un accusé de réception, un mois pour une réponse
        complète aux demandes RGPD).
      </p>
    </article>
  );
}
