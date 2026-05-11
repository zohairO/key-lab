interface OptionListProps<T extends string> {
  options: { id: T; label: string; description?: string; swatch?: string }[];
  value: T;
  onChange: (id: T) => void;
}

/**
 * Vertical list for higher-info choices (presets, switches). Each row has a
 * radio dot + label + optional description. Selected row gets a highlighted bg
 * and an accent dot. Tighter padding than the previous "side rail" version.
 */
export function OptionList<T extends string>({ options, value, onChange }: OptionListProps<T>) {
  return (
    <div className="flex flex-col">
      {options.map((opt) => {
        const selected = opt.id === value;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`group flex items-start gap-2.5 px-4 py-2 text-left transition ${
              selected
                ? 'bg-zinc-100 text-zinc-900 dark:bg-neutral-900 dark:text-neutral-100'
                : 'text-zinc-700 hover:bg-zinc-50 dark:text-neutral-400 dark:hover:bg-neutral-900/50 dark:hover:text-neutral-200'
            }`}
          >
            <span
              aria-hidden
              className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full transition ${
                selected ? 'bg-[#5a8cff]' : 'bg-zinc-300 dark:bg-neutral-700'
              }`}
            />
            {opt.swatch && (
              <span
                aria-hidden
                className="mt-0.5 h-3 w-3 shrink-0 rounded-[2px] border border-zinc-300 dark:border-neutral-700"
                style={{ backgroundColor: opt.swatch }}
              />
            )}
            <span className="flex flex-1 flex-col">
              <span className="text-[12.5px] leading-tight">{opt.label}</span>
              {opt.description && (
                <span className="mt-0.5 text-[11px] leading-snug text-zinc-500 dark:text-neutral-500">
                  {opt.description}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
