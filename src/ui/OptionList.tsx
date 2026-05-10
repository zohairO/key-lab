interface OptionListProps<T extends string> {
  options: { id: T; label: string; description?: string; swatch?: string }[];
  value: T;
  onChange: (id: T) => void;
}

/**
 * Workshop-style selectable list. 2px accent rail on the left of the
 * selected row; subtle bg highlight; optional color swatch chip.
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
            className={`group flex items-center gap-3 px-4 py-2 text-left text-sm transition ${
              selected
                ? 'bg-neutral-900 text-neutral-100'
                : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-200'
            }`}
          >
            <span
              aria-hidden
              className={`h-5 w-[2px] shrink-0 transition ${
                selected ? 'bg-[#5a8cff]' : 'bg-transparent'
              }`}
            />
            {opt.swatch && (
              <span
                aria-hidden
                className="h-3.5 w-3.5 shrink-0 rounded-[2px] border border-neutral-700"
                style={{ backgroundColor: opt.swatch }}
              />
            )}
            <span className="flex flex-1 flex-col">
              <span className="text-[13px] leading-tight">{opt.label}</span>
              {opt.description && (
                <span className="mt-0.5 text-[11px] leading-tight text-neutral-500">
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
