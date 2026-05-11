import type { ReactNode } from 'react';
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './icons';
import type { Theme } from '../types';

interface SidePanelProps {
  open: boolean;
  onToggle: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function SidePanel({
  open, onToggle, theme, onToggleTheme,
  title = 'KeyboardLab', children, footer,
}: SidePanelProps) {
  return (
    <>
      {!open && (
        <button
          onClick={onToggle}
          className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition hover:text-zinc-900 dark:border-neutral-800 dark:bg-[#0e0e10] dark:text-neutral-300 dark:hover:text-neutral-100"
          aria-label="Open panel"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      )}

      <aside
        className={`absolute inset-y-0 left-0 z-10 flex w-[320px] flex-col border-r border-zinc-200 bg-white text-zinc-800 transition-transform duration-200 ease-out dark:border-neutral-800 dark:bg-[#0e0e10] dark:text-neutral-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggle}
              className="flex h-7 w-7 items-center justify-center rounded text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
              aria-label="Close panel"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            <span className="text-[13px] font-medium tracking-tight text-zinc-900 dark:text-neutral-100">
              {title}
            </span>
          </div>
          <button
            onClick={onToggleTheme}
            className="flex h-7 w-7 items-center justify-center rounded text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>

        {footer && (
          <footer className="border-t border-zinc-200 px-4 py-3 dark:border-neutral-800">{footer}</footer>
        )}
      </aside>
    </>
  );
}
