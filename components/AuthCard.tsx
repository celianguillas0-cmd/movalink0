import Link from "next/link";
import HexBackground from "./HexBackground";
import { LogoMark } from "./Icons";
import { SITE_NAME } from "@/lib/config";

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center px-4 overflow-hidden">
      <HexBackground />
      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center group-hover:opacity-80 transition-opacity">
              <LogoMark className="h-4 w-4 text-white dark:text-zinc-900" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {SITE_NAME}
            </span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">{subtitle}</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-7 shadow-sm">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-gray-400 dark:text-zinc-500 mt-5">
            {footer}
          </p>
        )}
      </div>
    </div>
  );
}

export const authInputClass =
  "w-full px-3.5 py-2.5 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all placeholder:text-gray-300 dark:placeholder:text-zinc-600";

export const authLabelClass =
  "block text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1.5";

export const authButtonClass =
  "w-full bg-zinc-900 dark:bg-white hover:opacity-90 disabled:opacity-50 text-white dark:text-zinc-900 py-2.5 rounded-lg font-semibold text-sm transition-opacity flex items-center justify-center gap-2";
