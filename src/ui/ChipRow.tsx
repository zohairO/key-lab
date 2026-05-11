interface ChipOption {
  id: string;
  label: string;
  swatch?: string;
}

interface ChipRowProps {
  label?: string;
  options: ChipOption[];
  value: string;
  onChange: (id: string) => void;
}

/**
 * Compact horizontal chip selector for low-cardinality choices (2–6 options).
 * Selected chip: filled bg. Unselected: hairline border. Optional color swatch
 * left of the label (used for keycap colorways, plate materials).
 */
export function ChipRow({ label, options, value, onChange }: ChipRowProps) {
  return (
    <div className="px-4 py-2.5">
      {label && (
        <div className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500 dark:text-neutral-500">
          {label}
        </div>
      )}
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => {
          const selected = opt.id === value;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] transition ${
                selected
                  ? 'bg-zinc-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-900'
              }`}
            >
              {opt.swatch && (
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 shrink-0 rounded-[2px] border border-zinc-300 dark:border-neutral-700"
                  style={{ backgroundColor: opt.swatch }}
                />
              )}
              <span className="whitespace-nowrap">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
