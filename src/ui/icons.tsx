type IconProps = { className?: string };

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden>
      <line x1="4" y1="7" x2="20" y2="7" strokeLinecap="round" />
      <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" />
      <line x1="4" y1="17" x2="20" y2="17" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className} aria-hidden>
      <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
      <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronIcon({ className, open }: IconProps & { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      className={`${className ?? ''} transition-transform ${open ? 'rotate-90' : ''}`}
      aria-hidden
    >
      <polyline points="9 6 15 12 9 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
