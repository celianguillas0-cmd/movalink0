"use client";

// Case à cocher custom : toute la ligne est cliquable (cible tactile large),
// rendu identique sur tous les navigateurs, liens internes isolés du toggle.
export default function CheckboxRow({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className="-m-1.5 flex cursor-pointer select-none items-start gap-3 rounded-lg p-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50"
    >
      <span
        aria-hidden
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
          checked
            ? "border-zinc-900 bg-zinc-900 dark:border-white dark:bg-white"
            : "border-gray-300 bg-white dark:border-zinc-600 dark:bg-zinc-800"
        }`}
      >
        {checked && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white dark:text-zinc-900"
          >
            <path
              d="M4.5 12.5l5 5L19.5 7"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="text-xs leading-relaxed text-gray-500 dark:text-zinc-400">
        {children}
      </span>
    </div>
  );
}
