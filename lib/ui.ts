// Vocabulaire visuel du dashboard, calqué sur rivtools.
// Les cartes réagissent discrètement au survol : la page paraît vivante sans
// distraire (durées courtes, courbe douce, jamais de déplacement du contenu).
export const cardClass =
  "bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-5 transition-[border-color,box-shadow] duration-200 hover:border-gray-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.05)] dark:hover:border-zinc-700 dark:hover:shadow-[0_2px_16px_rgba(0,0,0,0.35)]";

export const inputClass =
  "w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white focus:border-transparent transition-all placeholder:text-gray-300 dark:placeholder:text-zinc-600";

export const labelClass =
  "block text-xs font-medium text-gray-500 dark:text-zinc-400 mb-1.5";

export const primaryBtnClass =
  "bg-zinc-900 dark:bg-white hover:opacity-90 disabled:opacity-50 text-white dark:text-zinc-900 px-4 py-2.5 rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-150 active:scale-[0.97] disabled:active:scale-100";

export const smallBtnClass =
  "rounded-lg border border-gray-200 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-zinc-300 transition-all duration-150 hover:border-gray-400 dark:hover:border-zinc-500 disabled:opacity-40 active:scale-95 disabled:active:scale-100";

export const pageTitleClass =
  "text-xl font-semibold text-gray-900 dark:text-white mb-1";

export const pageSubtitleClass =
  "text-sm text-gray-400 dark:text-zinc-500 mb-4";
