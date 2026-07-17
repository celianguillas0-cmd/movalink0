import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation et de vente",
};

export default function CguPage() {
  return (
    <article>
      <h1>Conditions générales d'utilisation et de vente (CGU / CGV)</h1>
      <p className="!text-gray-400 dark:!text-zinc-500 !mb-12">
        Dernière mise à jour : 17 juillet 2026 · Version 1.3
      </p>

      {/* ── PARTIE I — CGU ──────────────────────────────────────────── */}
      <h2>Article 1 — Objet et acceptation</h2>
      <p>
        Les présentes conditions générales d'utilisation et de vente (les «
        Conditions ») régissent l'accès et l'utilisation du service {SITE_NAME},
        accessible à l'adresse {SITE_URL} (le « Service »), ainsi que l'achat
        des plans payants proposés sur le Service.
      </p>
      <p>
        La création d'un compte, l'utilisation du Service ou l'achat d'un plan
        payant emportent acceptation pleine et entière des présentes Conditions.
        Si tu n'acceptes pas ces Conditions, tu ne dois pas utiliser le Service.
      </p>
      <p>
        Les présentes Conditions sont rédigées en langue française, qui prévaut
        en cas de traduction dans une autre langue.
      </p>

      <h2>Article 2 — Définitions</h2>
      <ul>
        <li>
          « Éditeur » : la personne physique qui édite et exploite le Service,
          désignée dans les{" "}
          <Link href="/legal/mentions-legales">mentions légales</Link>.
        </li>
        <li>
          « Utilisateur » : toute personne physique qui crée un compte sur le
          Service pour son usage personnel (consommateur au sens du droit de la
          consommation).
        </li>
        <li>
          « Visiteur » : toute personne qui consulte une page publique du
          Service sans être connectée.
        </li>
        <li>
          « Page de profil » : la page publique personnalisée créée par un
          Utilisateur, accessible à l'adresse {SITE_URL}/pseudo.
        </li>
        <li>
          « Contenu Utilisateur » : tout contenu publié par un Utilisateur sur
          sa Page de profil (textes, liens, pseudonymes, images, sons, etc.).
        </li>
        <li>
          « Plan payant » : plan Pro ou Elite, acquis par paiement unique, par
          opposition au plan Gratuit.
        </li>
      </ul>

      <h2>Article 3 — Description du Service</h2>
      <p>
        {SITE_NAME} permet à ses Utilisateurs de créer et de personnaliser une
        Page de profil publique regroupant leurs liens, réseaux sociaux,
        bibliothèque de jeux vidéo, éléments de personnalisation visuelle
        (thèmes, effets, polices) et des statistiques de consultation
        anonymisées.
      </p>
      <p>
        Le Service est proposé en trois plans. Le descriptif complet et à jour
        des fonctionnalités figure sur la page{" "}
        <Link href="/pricing">Tarifs</Link>, qui fait partie intégrante des
        présentes Conditions. En cas de divergence entre le tableau ci-dessous
        et la page Tarifs, cette dernière prévaut.
      </p>
      <div className="border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden text-sm mb-3">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-zinc-300 text-xs">Plan</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-zinc-300 text-xs">Prix TTC</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-zinc-300 text-xs">Liens max</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-zinc-300 text-xs">Historique stats</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 text-gray-600 dark:text-zinc-400">
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-800 dark:text-zinc-200">Gratuit</td>
              <td className="px-4 py-3">0 €</td>
              <td className="px-4 py-3">5</td>
              <td className="px-4 py-3">7 jours</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-800 dark:text-zinc-200">Pro</td>
              <td className="px-4 py-3">3,49 € (une fois)</td>
              <td className="px-4 py-3">15</td>
              <td className="px-4 py-3">30 jours</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-gray-800 dark:text-zinc-200">Elite</td>
              <td className="px-4 py-3">5,99 € (une fois)</td>
              <td className="px-4 py-3">50</td>
              <td className="px-4 py-3">1 an</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Article 4 — Inscription et compte</h2>
      <p>
        L'inscription est ouverte à toute personne physique âgée d'au moins
        15 ans (âge du consentement numérique en France, article 45 de la loi
        Informatique et Libertés). Si tu as moins de 15 ans, l'accord exprès
        de ton représentant légal est nécessaire avant toute utilisation du
        Service.
      </p>
      <p>
        Tu t'engages à fournir des informations exactes et à jour lors de ton
        inscription et à maintenir la confidentialité de ton mot de passe. Tu
        es seul responsable de toute activité réalisée depuis ton compte. En
        cas d'utilisation non autorisée, contacte-nous sans délai à{" "}
        {CONTACT_EMAIL}.
      </p>
      <p>
        Le pseudo choisi ne doit pas porter atteinte aux droits de tiers
        (marques déposées, noms de personnes, droits d'auteur, identités
        officielles) ni être contraire à l'ordre public ou aux bonnes mœurs.
        L'Éditeur se réserve le droit de libérer ou de modifier un pseudo en
        cas d'atteinte manifeste aux droits d'un tiers, après notification dans
        la mesure du possible.
      </p>

      {/* ── PARTIE II — CGV ─────────────────────────────────────────── */}
      <h2>Article 5 — Plans payants et conditions de vente (CGV)</h2>

      <h3>5.1 Prix, TVA et paiement</h3>
      <p>
        Les plans Pro et Elite sont vendus aux prix affichés sur la page{" "}
        <Link href="/pricing">Tarifs</Link> au moment de l'achat. Les prix sont
        indiqués en euros.
      </p>
      <p>
        <strong>TVA :</strong> l'Éditeur exerce en qualité de
        micro-entrepreneur dont le chiffre d'affaires est inférieur au seuil de
        franchise en base de TVA. En conséquence,{" "}
        <strong>TVA non applicable — article 293 B du Code général des impôts</strong>.
        Les prix affichés sont donc des prix nets, sans TVA.
      </p>
      <p>
        Le paiement s'effectue en une seule fois, par carte bancaire, via le
        prestataire de paiement sécurisé Stripe (Stripe, Inc., 354 Oyster Point
        Blvd, South San Francisco, CA 94080, États-Unis). Aucun abonnement ni
        prélèvement récurrent n'est mis en place. Le paiement est débité dès la
        validation de la commande.
      </p>

      <h3>5.2 Accès « à vie »</h3>
      <p>
        L'achat d'un plan payant donne accès aux fonctionnalités du plan
        concerné pour toute la durée de vie commerciale du Service, sans
        paiement supplémentaire. La mention « à vie » s'entend de la durée
        d'exploitation du Service par l'Éditeur et non de la durée de vie de
        l'Utilisateur.
      </p>
      <p>
        En cas d'arrêt définitif du Service, les Utilisateurs ayant souscrit
        un plan payant au cours des 12 derniers mois seront informés par email
        avec un préavis minimum de 30 jours. Passé ce délai, aucun
        remboursement prorata temporis ne pourra être exigé.
      </p>
      <p>
        L'Éditeur peut faire évoluer les fonctionnalités incluses dans chaque
        plan, notamment pour des raisons techniques, légales ou de sécurité,
        sans que cela n'ouvre droit à remboursement, à condition de ne pas
        dégrader substantiellement les fonctionnalités principales du plan
        acquis.
      </p>

      <h3>5.3 Droit de rétractation</h3>
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-xl p-4 mb-4">
        <p className="!text-sm !font-semibold !text-blue-800 dark:!text-blue-300 !mb-1">
          Délai légal de 14 jours — article L221-18 du Code de la consommation
        </p>
        <p className="!text-sm !text-blue-700 dark:!text-blue-400 !mb-0">
          En tant que consommateur, tu disposes d'un délai de{" "}
          <strong>14 jours calendaires</strong> à compter de la date d'achat
          pour exercer ton droit de rétractation, sans avoir à justifier de
          motif ni à supporter de pénalité.
        </p>
      </div>
      <p>
        Pour exercer ce droit, tu peux utiliser le{" "}
        <strong>formulaire type de rétractation</strong> figurant en{" "}
        <strong>Annexe I</strong> des présentes Conditions, ou nous adresser
        toute déclaration dénuée d'ambiguïté à l'adresse {CONTACT_EMAIL}, en
        précisant l'adresse email de ton compte et la date d'achat. Le
        remboursement intégral interviendra dans un délai maximal de 14 jours
        suivant réception de ta demande, par le même moyen de paiement que
        celui utilisé lors de l'achat.
      </p>

      <h3>5.4 Renonciation expresse au droit de rétractation</h3>
      <p>
        Conformément à l'article L221-28 1° du Code de la consommation, lors
        de l'achat d'un plan payant, il t'est demandé de cocher la case
        suivante avant de valider le paiement :
      </p>
      <blockquote className="border-l-4 border-gray-300 dark:border-zinc-600 pl-4 italic text-gray-600 dark:text-zinc-400 text-sm my-4">
        « Je demande l'exécution immédiate du contrat et reconnais expressément
        renoncer à mon droit de rétractation dès lors que le service numérique
        m'est entièrement fourni. »
      </blockquote>
      <p>
        Si tu coches cette case et que les fonctionnalités du plan sont
        immédiatement accessibles après le paiement, le droit de rétractation
        ne pourra plus être exercé. Si tu ne coches pas cette case, le délai
        de étractation de 14 jours s'applique pleinement, mais l'accès aux
        fonctionnalités payantes sera suspendu jusqu'à l'expiration de ce
        délai.
      </p>

      <h3>5.5 Facturation</h3>
      <p>
        Un reçu de paiement est émis automatiquement par Stripe et envoyé à
        l'adresse email du compte après chaque achat. Sur demande écrite à{" "}
        {CONTACT_EMAIL}, une facture conforme aux exigences légales (article
        289 du CGI) peut être fournie dans un délai de 30 jours.
      </p>
      <p>
        Conformément à l'article 293 B du CGI, la mention « TVA non applicable
        » figure sur toute facture émise par l'Éditeur.
      </p>

      <h2>Article 6 — Contenu Utilisateur</h2>
      <h3>6.1 Propriété et licence</h3>
      <p>
        Tu restes propriétaire de l'ensemble de ton Contenu Utilisateur. En le
        publiant sur le Service, tu concèdes à l'Éditeur une licence non
        exclusive, mondiale, gratuite et pour la durée de la publication,
        limitée aux actes d'hébergement, de reproduction technique, de
        transmission et d'affichage strictement nécessaires au fonctionnement
        du Service.
      </p>
      <h3>6.2 Responsabilité sur le contenu</h3>
      <p>
        Tu es seul responsable du Contenu Utilisateur que tu publies. Tu
        garantis disposer de tous les droits nécessaires sur ce contenu —
        notamment les droits de propriété intellectuelle sur les images,
        musiques et textes que tu téléverses — et que ce contenu ne viole
        aucun droit de tiers.
      </p>

      <h2>Article 7 — Contenus et comportements interdits</h2>
      <p>
        Il est strictement interdit de publier ou d'utiliser le Service pour
        diffuser :
      </p>
      <ul>
        <li>
          Tout contenu illégal au sens du droit français et européen :
          incitation à la haine, à la violence ou à la discrimination fondée
          sur l'origine, le sexe, la religion ou l'orientation sexuelle
          (articles 24 et 24 bis de la loi du 29 juillet 1881) ; apologie du
          terrorisme (article 421-2-5 du Code pénal) ; contenu à caractère
          pédopornographique (article 227-23 du Code pénal) ; atteinte grave à
          la dignité humaine.
        </li>
        <li>
          Tout contenu portant atteinte aux droits de tiers : contrefaçon de
          droits d'auteur ou de marques (articles L335-2 et L713-1 du Code de
          la propriété intellectuelle) ; diffamation publique (article 29 de la
          loi du 29 juillet 1881) ; atteinte à la vie privée (article 9 du
          Code civil) ; usurpation d'identité (article 226-4-1 du Code pénal).
        </li>
        <li>
          Tout contenu à caractère pornographique accessible à des mineurs, ou
          faisant la promotion de services sexuels.
        </li>
        <li>
          Des liens vers des sites de hameçonnage (phishing), des logiciels
          malveillants, des arnaques ou des services illégaux.
        </li>
        <li>
          Tout comportement de harcèlement, de doxxing, de dénigrement ou de
          menace envers toute personne physique ou morale.
        </li>
        <li>
          Toute utilisation automatisée abusive du Service : spam, création
          massive de faux comptes, collecte automatisée de données (scraping)
          sans autorisation préalable de l'Éditeur.
        </li>
      </ul>
      <p>
        Tout manquement à ces obligations peut entraîner, selon la gravité,
        la suppression immédiate du contenu, la suspension temporaire ou la
        résiliation définitive du compte, sans préavis ni remboursement, et
        sans préjudice des poursuites civiles ou pénales que l'Éditeur ou des
        tiers pourraient engager.
      </p>

      <h2>Article 8 — Modération et signalement (LCEN / DSA)</h2>
      <p>
        L'Éditeur agit en qualité d'hébergeur du Contenu Utilisateur au sens
        de l'article 6 de la loi n° 2004-575 du 21 juin 2004 (LCEN) et du
        règlement (UE) 2022/2065 sur les services numériques (DSA). Il
        n'exerce pas de contrôle éditorial préalable sur les contenus publiés
        par les Utilisateurs.
      </p>
      <p>
        Toute personne peut signaler un contenu potentiellement illicite via
        la page <Link href="/report">Signaler un contenu</Link> ou par email à{" "}
        {CONTACT_EMAIL}, en précisant l'URL de la page concernée, la nature
        du contenu litigieux et, si possible, la disposition légale qui serait
        violée. Les signalements sont examinés sans délai. Tout contenu
        manifestement illicite est retiré ou rendu inaccessible promptement
        après notification, conformément à l'article 6-I-5 de la LCEN.
      </p>
      <p>
        L'Éditeur notifie aux autorités compétentes tout contenu dont il
        a connaissance et qui constitue une infraction visée aux articles
        24 (incitation à la haine), 24 bis ou 227-23 du Code pénal, conformément
        à l'article 6-I-7 de la LCEN.
      </p>
      <p>
        Un signalement abusif, effectué de mauvaise foi dans le but de faire
        retirer un contenu licite, est passible de sanctions pénales
        (article 6-I-4 de la LCEN, article 226-10 du Code pénal).
      </p>

      <h2>Article 9 — Propriété intellectuelle de l'Éditeur</h2>
      <p>
        Le Service dans son ensemble (code source, design, logo, charte
        graphique, textes hors Contenu Utilisateur, architecture, fonctionnalités)
        est protégé par le droit de la propriété intellectuelle, notamment par
        le droit d'auteur (articles L111-1 et suivants du Code de la propriété
        intellectuelle). Toute reproduction, représentation, modification,
        extraction ou utilisation, totale ou partielle, sans autorisation
        écrite préalable de l'Éditeur, est strictement interdite et constitue
        une contrefaçon sanctionnable.
      </p>
      <p>
        Les marques, logos et noms de domaine du Service sont la propriété de
        l'Éditeur ou font l'objet d'une autorisation d'utilisation. Toute
        reproduction non autorisée est interdite.
      </p>

      <h2>Article 10 — Données personnelles</h2>
      <p>
        Le traitement des données personnelles collectées dans le cadre du
        Service est décrit dans la{" "}
        <Link href="/legal/confidentialite">politique de confidentialité</Link>,
        qui fait partie intégrante des présentes Conditions. En utilisant le
        Service, tu reconnais avoir pris connaissance de cette politique.
      </p>

      <h2>Article 11 — Disponibilité et évolution du Service</h2>
      <p>
        L'Éditeur s'efforce d'assurer la disponibilité du Service 24h/24 et
        7j/7, sans pouvoir la garantir contractuellement. Des interruptions
        peuvent survenir pour des raisons de maintenance planifiée (annoncée si
        possible avec 48h de préavis), de mise à jour technique, de sécurité ou
        à la suite d'un événement indépendant de la volonté de l'Éditeur.
      </p>
      <p>
        L'état du Service en temps réel est consultable à l'adresse{" "}
        <Link href="/status">{SITE_URL}/status</Link>.
      </p>

      <h2>Article 12 — Force majeure</h2>
      <p>
        L'Éditeur ne saurait être tenu responsable de tout retard ou
        inexécution de ses obligations contractuelles causé par un événement
        constitutif de force majeure au sens de l'article 1218 du Code civil :
        catastrophe naturelle, incendie, inondation, coupure d'électricité
        prolongée, défaillance des infrastructures d'hébergement (Vercel Inc.),
        acte de cybermalveillance de grande ampleur, décision administrative ou
        judiciaire contraignante, pandémie ou événement sanitaire majeur, acte
        de guerre ou terrorisme, ou toute autre cause échappant au contrôle
        raisonnable de l'Éditeur.
      </p>
      <p>
        En cas de survenance d'un tel événement, l'Éditeur en informera
        l'Utilisateur dans les meilleurs délais et s'efforcera de rétablir le
        Service dans les plus brefs délais.
      </p>

      <h2>Article 13 — Responsabilité</h2>
      <p>
        Le Service est fourni « en l'état », sans garantie d'adéquation à un
        usage particulier. Dans les limites autorisées par la loi applicable,
        l'Éditeur ne saurait être tenu responsable :
      </p>
      <ul>
        <li>des dommages indirects : perte d'audience, manque à gagner, perte
        de chance, perte de données publiées par l'Utilisateur ;</li>
        <li>des conséquences d'une indisponibilité du Service, quelle qu'en
        soit la cause ;</li>
        <li>du Contenu Utilisateur publié par les Utilisateurs, dont ceux-ci
        assument l'entière responsabilité ;</li>
        <li>des sites et services tiers vers lesquels des liens figurent sur
        les Pages de profil.</li>
      </ul>
      <p>
        En tout état de cause, la responsabilité de l'Éditeur au titre des
        plans payants est plafonnée au montant effectivement payé par
        l'Utilisateur pour le plan concerné.
      </p>
      <p>
        Rien dans les présentes Conditions n'exclut ou ne limite la
        responsabilité de l'Éditeur en cas de dol, faute lourde, manquement
        à une obligation essentielle du contrat, atteinte à la vie ou à
        l'intégrité physique, ou dans tout autre cas où la limitation est
        prohibée par la loi.
      </p>

      <h2>Article 14 — Durée, suspension et résiliation</h2>
      <p>
        Les présentes Conditions s'appliquent pendant toute la durée
        d'utilisation du Service.
      </p>
      <ul>
        <li>
          <strong>Par l'Utilisateur</strong> : tu peux supprimer ton compte à
          tout moment depuis le dashboard (section Compte → Supprimer mon
          compte). La suppression prend effet immédiatement et est définitive :
          ta Page de profil, tes données et tes statistiques sont effacées. La
          suppression du compte ne donne pas droit au remboursement d'un plan
          payant.
        </li>
        <li>
          <strong>Par l'Éditeur</strong> : en cas de violation des présentes
          Conditions, l'Éditeur peut suspendre ou résilier un compte. En
          dehors des cas d'urgence (contenu manifestement illicite, risque de
          sécurité), une notification préalable par email sera adressée à
          l'Utilisateur avec un délai raisonnable pour lui permettre de
          rectifier le manquement. En cas de résiliation pour faute grave de
          l'Utilisateur, aucun remboursement ne sera dû.
        </li>
      </ul>

      <h2>Article 15 — Modification des Conditions</h2>
      <p>
        L'Éditeur peut modifier les présentes Conditions à tout moment. Pour
        toute modification substantielle (notamment tarifaire, touchant aux
        fonctionnalités des plans payants ou aux droits des Utilisateurs),
        un préavis d'au moins <strong>30 jours</strong> sera communiqué par
        email à l'adresse du compte et/ou par notification sur le Service
        avant l'entrée en vigueur de la modification. La poursuite de
        l'utilisation du Service après l'entrée en vigueur des nouvelles
        Conditions vaut acceptation de celles-ci.
      </p>
      <p>
        La date de dernière mise à jour figure en haut de ce document. Les
        versions antérieures peuvent être obtenues sur demande à{" "}
        {CONTACT_EMAIL}.
      </p>

      <h2>Article 16 — Médiation et résolution des litiges</h2>
      <p>
        Les présentes Conditions sont soumises au droit français. En cas de
        litige entre l'Éditeur et un Utilisateur consommateur, une résolution
        amiable sera recherchée en priorité. Contacte d'abord l'Éditeur à{" "}
        {CONTACT_EMAIL} en décrivant le problème.
      </p>
      <p>
        Conformément aux articles L611-1 et suivants du Code de la
        consommation, et à la directive 2013/11/UE relative au règlement
        extrajudiciaire des litiges de consommation, tout consommateur peut
        recourir gratuitement, après épuisement préalable des voies de
        recours amiables auprès de l'Éditeur, au médiateur de la consommation
        suivant :
      </p>
      <div className="border border-gray-200 dark:border-zinc-700 rounded-xl p-4 my-4 text-sm text-gray-700 dark:text-zinc-300">
        <p className="!mb-1 font-semibold">
          CM2C — Centre de la Médiation de la Consommation de Conciliateurs de
          Justice
        </p>
        <p className="!mb-1">49, rue de Ponthieu — 75008 Paris</p>
        <p className="!mb-1">
          Site :{" "}
          <a
            href="https://www.cm2c.net"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.cm2c.net
          </a>
        </p>
        <p className="!mb-0">Email : cm2c@cm2c.net</p>
      </div>
      <p>
        La demande de médiation doit être formulée dans un délai d'un an
        suivant la réclamation écrite adressée à l'Éditeur. La médiation est
        gratuite pour le consommateur.
      </p>
      <p>
        Tu peux également utiliser la plateforme européenne de règlement en
        ligne des litiges (RLL) mise à disposition par la Commission
        européenne :{" "}
        <a
          href="https://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noopener noreferrer"
        >
          ec.europa.eu/consumers/odr
        </a>
        .
      </p>
      <p>
        À défaut de résolution amiable ou par médiation, les tribunaux
        français seront seuls compétents. Pour les litiges entre
        professionnels, le tribunal de commerce territorialement compétent
        sera saisi.
      </p>

      <h2>Article 17 — Contact</h2>
      <p>
        Pour toute question relative aux présentes Conditions, toute demande
        de rétractation, ou tout litige : {CONTACT_EMAIL}.
      </p>
      <p>
        L'Éditeur s'engage à accuser réception de toute demande dans un délai
        de 48 heures ouvrées et à y répondre dans un délai raisonnable.
      </p>

      {/* ── ANNEXE I ─────────────────────────────────────────────────── */}
      <hr className="my-8 border-gray-200 dark:border-zinc-700" />
      <h2 id="annexe-retractation">
        Annexe I — Formulaire type de rétractation
      </h2>
      <p className="text-xs text-gray-400 dark:text-zinc-500">
        (Art. R221-1 du Code de la consommation — à compléter et à nous
        retourner uniquement si vous souhaitez vous rétracter de votre achat)
      </p>
      <div className="border border-dashed border-gray-300 dark:border-zinc-600 rounded-xl p-6 text-sm text-gray-700 dark:text-zinc-300 space-y-3 my-4">
        <p>À l'attention de l'Éditeur de {SITE_NAME} — {CONTACT_EMAIL}</p>
        <p>
          Je/Nous (*) vous notifie(ons) (*) par la présente ma/notre (*)
          rétractation du contrat portant sur l'achat du plan payant
          ci-dessous :
        </p>
        <p>Plan acheté (*) : ☐ Pro &nbsp;&nbsp; ☐ Elite</p>
        <p>Date d'achat : ___________________________</p>
        <p>Adresse email du compte : ___________________________</p>
        <p>
          Nom du (des) consommateur(s) : ___________________________
        </p>
        <p>
          Adresse du (des) consommateur(s) : ___________________________
        </p>
        <p>
          Signature (uniquement en cas d'envoi papier) : ___________________________
        </p>
        <p>Date : ___________________________</p>
        <p className="text-xs text-gray-400 dark:text-zinc-500">
          (*) Rayez la mention inutile.
        </p>
      </div>

      {/* ── ANNEXE II ────────────────────────────────────────────────── */}
      <h2 id="annexe-informations">
        Annexe II — Informations précontractuelles essentielles
      </h2>
      <p className="text-sm text-gray-600 dark:text-zinc-400">
        Conformément aux articles L221-5 et L221-6 du Code de la consommation,
        les informations suivantes sont portées à votre connaissance avant
        tout achat :
      </p>
      <ul className="text-sm text-gray-600 dark:text-zinc-400">
        <li>
          <strong>Identité du vendeur</strong> : désignée dans les{" "}
          <Link href="/legal/mentions-legales">mentions légales</Link>.
        </li>
        <li>
          <strong>Caractéristiques essentielles</strong> : accès permanent aux
          fonctionnalités du plan choisi (voir page Tarifs) pour toute la durée
          de vie du Service.
        </li>
        <li>
          <strong>Prix total TTC</strong> : 3,49 € (Pro) ou 5,99 € (Elite),
          paiement unique, TVA non applicable (art. 293 B CGI).
        </li>
        <li>
          <strong>Modalités de paiement</strong> : carte bancaire via Stripe,
          débit immédiat à la validation.
        </li>
        <li>
          <strong>Droit de rétractation</strong> : 14 jours à compter de
          l'achat (sauf renonciation expresse pour accès immédiat — voir art.
          5.4 ci-dessus).
        </li>
        <li>
          <strong>Formulaire de rétractation</strong> : Annexe I ci-dessus ou
          demande libre à {CONTACT_EMAIL}.
        </li>
        <li>
          <strong>Garanties légales</strong> : garantie légale de conformité
          (articles L224-25-1 et suivants du Code de la consommation pour les
          contenus et services numériques) et garantie contre les vices cachés
          (articles 1641 et suivants du Code civil).
        </li>
        <li>
          <strong>Médiateur</strong> : CM2C — www.cm2c.net (voir art. 16).
        </li>
        <li>
          <strong>Durée minimale du contrat</strong> : indéterminée (durée de
          vie du Service).
        </li>
      </ul>
    </article>
  );
}
