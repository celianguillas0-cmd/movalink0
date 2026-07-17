import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function PrivacyPage() {
  return (
    <article>
      <h1>Politique de confidentialité</h1>
      <p>Dernière mise à jour : 17 juillet 2026</p>
      <p>
        Cette politique décrit comment {SITE_NAME} ({SITE_URL}) collecte,
        utilise et protège tes données personnelles, conformément au règlement
        (UE) 2016/679 (« RGPD ») et à la loi n° 78-17 du 6 janvier 1978
        relative à l'informatique, aux fichiers et aux libertés (« loi
        Informatique et Libertés ») dans sa version modifiée.
      </p>

      <h2>1. Responsable de traitement</h2>
      <p>
        Le responsable de traitement est l'éditeur du Service, désigné dans
        les <Link href="/legal/mentions-legales">mentions légales</Link>,
        joignable à l'adresse {CONTACT_EMAIL}.
      </p>
      <p>
        <strong>Délégué à la protection des données (DPO) :</strong> la
        désignation d'un DPO n'est pas obligatoire pour l'Éditeur au sens de
        l'article 37 du RGPD (ni autorité publique, ni traitements à grande
        échelle de catégories particulières de données). Pour tout exercice de
        droits ou toute question relative aux données, contacte directement
        l'Éditeur à {CONTACT_EMAIL}.
      </p>

      <h2>2. Données collectées</h2>
      <h3>2.1 Données de compte</h3>
      <ul>
        <li>Adresse email ;</li>
        <li>Pseudo (nom d'utilisateur public) ;</li>
        <li>
          Mot de passe, stocké exclusivement sous forme hachée et salée
          (bcrypt, facteur de coût 10) — nous n'avons jamais accès à ton
          mot de passe en clair ;
        </li>
        <li>Plan souscrit (Gratuit, Pro ou Elite) ;</li>
        <li>Date et heure de création du compte ;</li>
        <li>
          Code de parrainage généré automatiquement et nombre de parrainages
          (statistique interne).
        </li>
      </ul>
      <h3>2.2 Contenu de profil (données publiques)</h3>
      <p>
        Les informations que tu choisis de publier sur ta Page de profil — nom
        affiché, biographie, liens, réseaux sociaux, jeux, thème visuel,
        musique de fond, URL d'images — sont <strong>publiques par nature</strong> :
        elles sont visibles par toute personne disposant de ton lien de profil.
        Ces données relèvent de ta seule responsabilité.
      </p>
      <h3>2.3 Données de paiement</h3>
      <p>
        Les paiements sont traités exclusivement par Stripe. Nous ne stockons
        ni ne voyons aucune donnée de carte bancaire (numéro, date d'expiration,
        CVV). Stripe nous communique uniquement la confirmation du paiement, le
        plan acheté et l'adresse email associée. Voir la{" "}
        <a
          href="https://stripe.com/fr/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          politique de confidentialité de Stripe
        </a>
        .
      </p>
      <h3>2.4 Statut Discord (optionnel, plan Elite uniquement)</h3>
      <p>
        Si tu actives volontairement l'affichage de ton statut Discord, tu
        renseignes ton identifiant Discord public (User ID). Ta page interroge
        alors, directement depuis le navigateur des visiteurs, l'API publique{" "}
        <a
          href="https://github.com/Phineas/lanyard"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lanyard
        </a>{" "}
        (api.lanyard.rest) pour afficher ton statut de présence (jeu en cours,
        statut personnalisé) tel que tu le rends déjà public sur Discord.
        Nous ne stockons aucune donnée issue de Discord. Tu peux désactiver
        cette option à tout moment depuis l'éditeur.
      </p>
      <h3>2.5 Statistiques de consultation (anonymes)</h3>
      <p>
        Lorsqu'un visiteur consulte une Page de profil ou clique un lien, nous
        incrémentons des compteurs strictement agrégés et anonymes (nombre de
        vues et de clics par jour et par lien). Nous ne collectons ni n'enregistrons
        aucune adresse IP, aucun identifiant de visiteur, aucune géolocalisation,
        ni aucune empreinte de navigateur (fingerprint) des visiteurs.
        Aucun outil d'analytics tiers (Google Analytics, etc.) n'est utilisé.
      </p>
      <h3>2.6 Données de signalement</h3>
      <p>
        En cas de signalement d'un contenu via le formulaire prévu à cet effet,
        l'adresse email fournie par le signalant et le contenu de la demande
        sont conservés aux fins de traitement et de preuve.
      </p>
      <h3>2.7 Données de correspondance</h3>
      <p>
        Les emails que tu nous envoies à {CONTACT_EMAIL} (demandes de support,
        exercice de droits, etc.) sont conservés pendant une durée de 3 ans à
        des fins de suivi et de preuve.
      </p>

      <h2>3. Cookies et traceurs</h2>
      <p>
        Le Service utilise un unique cookie technique (nommé « ml_session »),
        strictement nécessaire à l'authentification des Utilisateurs connectés.
        Ce cookie est de type httpOnly et Secure, ce qui le protège contre les
        attaques XSS. Il est exempté de consentement préalable au sens des
        lignes directrices de la CNIL du 17 septembre 2020 (article 82 de la
        loi Informatique et Libertés).
      </p>
      <p>
        Aucun cookie publicitaire, de ciblage, analytique ou de suivi
        inter-sites n'est déposé. Aucune technologie de tracking tiers
        (pixel, beacon, fingerprint) n'est utilisée.
      </p>

      <h2>4. Finalités et bases légales des traitements</h2>
      <div className="border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden text-sm mb-3">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-zinc-300 text-xs w-1/2">Finalité</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-zinc-300 text-xs">Base légale (art. 6 RGPD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-600 dark:text-zinc-400">
            <tr>
              <td className="px-4 py-3">Création et gestion du compte, fourniture du Service</td>
              <td className="px-4 py-3">Exécution du contrat (6.1.b)</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Traitement des paiements et émission de reçus/factures</td>
              <td className="px-4 py-3">Exécution du contrat + obligation légale (6.1.b et 6.1.c)</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Statistiques anonymes de consultation</td>
              <td className="px-4 py-3">Intérêt légitime de l'Utilisateur (6.1.f) — les données sont strictement anonymes</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Modération et traitement des signalements</td>
              <td className="px-4 py-3">Obligation légale (LCEN, DSA) + intérêt légitime (6.1.c et 6.1.f)</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Réponse aux demandes (support, exercice de droits)</td>
              <td className="px-4 py-3">Intérêt légitime + obligations légales (6.1.f et 6.1.c)</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Conservation comptable des justificatifs de paiement</td>
              <td className="px-4 py-3">Obligation légale — article L123-22 du Code de commerce (6.1.c)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>5. Destinataires et sous-traitants</h2>
      <p>
        Tes données sont traitées par l'Éditeur et par les sous-traitants
        techniques suivants, avec lesquels des accords de traitement des données
        (DPA) conformes au RGPD sont en vigueur :
      </p>
      <div className="border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden text-sm mb-3">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-zinc-300 text-xs">Sous-traitant</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-zinc-300 text-xs">Rôle</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-zinc-300 text-xs">Localisation / Garanties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-600 dark:text-zinc-400">
            <tr>
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-zinc-200">Vercel Inc.</td>
              <td className="px-4 py-3">Hébergement du site, exécution du code serveur, stockage des données applicatives (Vercel Blob)</td>
              <td className="px-4 py-3">États-Unis — Clauses contractuelles types (CCT) de la Commission européenne + Data Privacy Framework UE-États-Unis</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium text-gray-800 dark:text-zinc-200">Stripe, Inc.</td>
              <td className="px-4 py-3">Traitement des paiements par carte bancaire</td>
              <td className="px-4 py-3">États-Unis / UE — Clauses contractuelles types + Data Privacy Framework</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        <strong>Transferts hors UE :</strong> Vercel Inc. et Stripe, Inc. sont
        établis aux États-Unis. Ces transferts sont encadrés par les Clauses
        Contractuelles Types (CCT) adoptées par la Commission européenne
        (décision 2021/914), et par le Data Privacy Framework UE-États-Unis
        (décision d'adéquation du 10 juillet 2023). Ces mécanismes garantissent
        un niveau de protection équivalent à celui exigé dans l'Union européenne.
      </p>
      <p>
        Aucune donnée personnelle n'est vendue, louée, cédée ni transmise à
        des tiers à des fins de publicité ou de profilage.
      </p>
      <p>
        Si le propriétaire d'une Page de profil a activé l'affichage du statut
        Discord (section 2.4), le navigateur du visiteur contacte directement
        l'API publique Lanyard (Phineas Fish) ; comme pour toute requête HTTP,
        l'adresse IP du visiteur est alors visible par cet opérateur. Aucune
        autre donnée ne lui est transmise par nos soins.
      </p>

      <h2>6. Durées de conservation</h2>
      <ul>
        <li>
          <strong>Données de compte et contenu de profil</strong> : conservées
          tant que le compte est actif, puis supprimées dans un délai maximum de
          30 jours suivant la suppression du compte.
        </li>
        <li>
          <strong>Statistiques anonymes de consultation</strong> : agrégées par
          jour ; les données antérieures à 400 jours sont automatiquement
          écrasées par le système.
        </li>
        <li>
          <strong>Signalements de contenus</strong> : conservés 12 mois après
          leur traitement, à des fins de preuve en cas de litige.
        </li>
        <li>
          <strong>Justificatifs de paiement</strong> : 10 ans à compter de
          l'exercice comptable (obligation légale — article L123-22 du Code de
          commerce).
        </li>
        <li>
          <strong>Correspondances email (support, droits)</strong> : 3 ans à
          compter du dernier échange.
        </li>
      </ul>

      <h2>7. Tes droits</h2>
      <p>
        Conformément aux articles 15 à 22 du RGPD et à la loi Informatique et
        Libertés, tu disposes des droits suivants sur tes données personnelles :
      </p>
      <ul>
        <li><strong>Droit d'accès</strong> (art. 15 RGPD) : obtenir une copie des données te concernant ;</li>
        <li><strong>Droit de rectification</strong> (art. 16) : corriger des données inexactes ou incomplètes ;</li>
        <li><strong>Droit à l'effacement</strong> (art. 17) : demander la suppression de tes données (« droit à l'oubli ») ;</li>
        <li><strong>Droit à la limitation</strong> (art. 18) : restreindre temporairement un traitement ;</li>
        <li><strong>Droit à la portabilité</strong> (art. 20) : recevoir tes données dans un format structuré et lisible par machine ;</li>
        <li><strong>Droit d'opposition</strong> (art. 21) : t'opposer à un traitement fondé sur l'intérêt légitime.</li>
      </ul>
      <p>Tu peux exercer ces droits de plusieurs façons :</p>
      <ul>
        <li>
          <strong>Directement depuis le dashboard</strong> : modification du
          contenu de profil, changement d'email ou de mot de passe, suppression
          du compte (effet immédiat).
        </li>
        <li>
          <strong>Par email</strong> à {CONTACT_EMAIL} : réponse garantie dans
          un délai maximal d'un mois (art. 12 RGPD), extensible à trois mois en
          cas de demande complexe avec information préalable.
        </li>
      </ul>
      <p>
        Si tu estimes que le traitement de tes données ne respecte pas la
        réglementation, tu peux introduire une réclamation auprès de la
        Commission Nationale de l'Informatique et des Libertés (CNIL) :{" "}
        <a
          href="https://www.cnil.fr/fr/plaintes"
          target="_blank"
          rel="noopener noreferrer"
        >
          cnil.fr/fr/plaintes
        </a>{" "}
        — 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07.
      </p>

      <h2>8. Sécurité des données</h2>
      <p>
        L'Éditeur met en œuvre les mesures techniques et organisationnelles
        appropriées pour assurer la sécurité des données personnelles :
      </p>
      <ul>
        <li>
          <strong>Chiffrement des communications</strong> : toutes les échanges
          entre le navigateur et le Service utilisent le protocole HTTPS (TLS
          1.2 minimum).
        </li>
        <li>
          <strong>Hachage des mots de passe</strong> : algorithme bcrypt avec
          facteur de coût adapté ; les mots de passe ne sont jamais stockés en
          clair.
        </li>
        <li>
          <strong>Sessions sécurisées</strong> : jetons de session signés par
          HMAC-SHA256, transmis via cookie httpOnly et Secure.
        </li>
        <li>
          <strong>Accès aux données restreint</strong> : seul l'Éditeur a
          accès aux données de production ; les sous-traitants n'accèdent
          qu'aux données strictement nécessaires à leur mission.
        </li>
        <li>
          <strong>Isolation des données de stockage</strong> : les chemins de
          stockage des données applicatives sont dérivés d'un HMAC-SHA256 (clé
          secrète serveur), les rendant impossibles à deviner depuis l'extérieur.
        </li>
      </ul>

      <h2>9. Violation de données personnelles</h2>
      <p>
        En cas de violation de données personnelles susceptible d'engendrer un
        risque pour tes droits et libertés (art. 33 et 34 du RGPD), l'Éditeur
        s'engage à :
      </p>
      <ul>
        <li>
          Notifier la CNIL dans un délai de <strong>72 heures</strong> après en
          avoir pris connaissance, conformément à l'article 33 du RGPD ;
        </li>
        <li>
          T'en informer sans délai injustifié par email si la violation est
          susceptible d'engendrer un risque élevé pour tes droits et libertés,
          en précisant la nature de la violation, les données concernées, les
          conséquences probables et les mesures prises ou envisagées
          (art. 34 RGPD).
        </li>
      </ul>

      <h2>10. Mineurs</h2>
      <p>
        Le Service est accessible à partir de 15 ans (âge du consentement
        numérique en France, article 45 de la loi Informatique et Libertés). En
        dessous de cet âge, l'inscription nécessite l'accord exprès du
        représentant légal, qui peut exercer les droits RGPD au nom du mineur.
        L'Éditeur ne collecte pas sciemment de données d'enfants de moins de
        15 ans ; si de telles données lui étaient signalées, elles seraient
        supprimées sans délai.
      </p>

      <h2>11. Modifications de la politique</h2>
      <p>
        Toute modification substantielle de la présente politique fera l'objet
        d'une information préalable (notification sur le Service ou par email)
        avant son entrée en vigueur. La date de dernière mise à jour figure en
        haut de page. Les versions antérieures peuvent être obtenues sur demande
        à {CONTACT_EMAIL}.
      </p>
    </article>
  );
}
