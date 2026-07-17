import Link from "next/link";
import HexBackground from "@/components/HexBackground";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 overflow-hidden">
      <HexBackground />
      <div className="relative z-10">
        <div className="min-h-screen">
          <div className="max-w-3xl mx-auto px-6 py-16">
            <Link
              href="/"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 inline-block"
            >
              ← Accueil
            </Link>
            <div className="[&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a:hover]:underline [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-gray-900 dark:[&_h1]:text-white [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h2]:mb-3 [&_h2]:mt-10 [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-gray-900 dark:[&_h3]:text-white [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-gray-600 dark:[&_p]:text-zinc-400 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:text-sm [&_li]:leading-relaxed [&_li]:text-gray-600 dark:[&_li]:text-zinc-400 [&_li]:mt-1.5">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
