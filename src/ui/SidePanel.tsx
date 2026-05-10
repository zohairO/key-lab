import type { ReactNode } from 'react';
import { CloseIcon, MenuIcon } from './icons';

interface SidePanelProps {
  open: boolean;
  onToggle: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Left-anchored slide-in panel in the workshop tooling style:
 * solid dark surface, hairline borders, no glass.
 */
export function SidePanel({ open, onToggle, title = 'KeyboardLab', children, footer }: SidePanelProps) {
  return (
    <>
      {/* Floating hamburger when closed */}
      {!open && (
        <button
          onClick={onToggle}
          className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-md border border-neutral-800 bg-[#0e0e10] text-neutral-300 transition hover:text-neutral-100"
          aria-label="Open panel"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      )}

      <aside
        className={`absolute inset-y-0 left-0 z-10 flex w-[320px] flex-col border-r border-neutral-800 bg-[#0e0e10] text-neutral-200 transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggle}
              className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 transition hover:bg-neutral-900 hover:text-neutral-100"
              aria-label="Close panel"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            <span className="text-[13px] font-medium tracking-tight text-neutral-100">{title}</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>

        {footer && (
          <footer className="border-t border-neutral-800 px-4 py-3">{footer}</footer>
        )}
      </aside>
    </>
  );
}
