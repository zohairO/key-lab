import { useState, type ReactNode } from 'react';
import { ChevronIcon } from './icons';

interface PanelSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function PanelSection({ title, defaultOpen = true, children }: PanelSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-neutral-800/80">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500 transition hover:text-neutral-300"
      >
        <ChevronIcon className="h-3 w-3 shrink-0 text-neutral-600" open={open} />
        <span>{title}</span>
      </button>
      {open && <div className="pb-3">{children}</div>}
    </section>
  );
}
