import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Informations légales",
};

const DOCS = [
  {
    href: "/legal/cgu",
    title: "Conditions générales d'utilisation et de vente",
    description:
      "Les règles d'utilisation du service, les plans payants, le droit de rétractation et la modération.",
  },
  {
    href: "/legal/confidentialite",
    title: "Politique de confidentialité",
    description:
      "Les données que nous traitons, pourquoi, combien de temps, et tes droits RGPD.",
  },
  {
    href: "/legal/mentions-legales",
    title: "Mentions légales",
    description: "L'éditeur du site, l'hébergeur et les contacts.",
  },
];

export default function LegalHubPage() {
  return (
    <div>
      <h1>Informations légales</h1>
      <p className="!text-gray-400 dark:!text-zinc-500 !mb-12">
        Tous les documents qui encadrent l'utilisation de Movalink.
      </p>
      <div className="space-y-4">
        {DOCS.map((doc) => (
          <Link
            key={doc.href}
            href={doc.href}
            className="!text-inherit block rounded-xl border border-gray-100 bg-white p-5 transition-colors hover:border-gray-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
          >
            <p className="!mb-1 !text-base font-semibold !text-gray-900 dark:!text-white">
              {doc.title}
            </p>
            <p className="!mb-0 !text-sm !text-gray-500 dark:!text-zinc-400">
              {doc.description}
            </p>
          </Link>
        ))}
      </div>
      <p className="mt-10 text-center">
        <Link href="/report">Signaler un contenu</Link>
        {" · "}
        <Link href="/status">État du service</Link>
      </p>
    </div>
  );
}
