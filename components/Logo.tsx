/**
 * Open Chair logo.
 * The mark is a chair in side view drawn with four straight strokes:
 * backrest, seat, back leg, front leg. It inherits currentColor, so it
 * works in one color at any size from 16px up.
 */
type MarkProps = { size?: number; className?: string; title?: string };

export function ChairMark({ size = 24, className, title }: MarkProps) {
  return (
    <svg
      className={`logo-mark${className ? ` ${className}` : ""}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.75}
      strokeLinecap="square"
      strokeLinejoin="miter"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d="M6.5 2.5 8 12" />
      <path d="M8 12h11" />
      <path d="M8 12v9.5" />
      <path d="M18 12v9.5" />
    </svg>
  );
}

type LogoProps = { size?: number; wordmark?: boolean; className?: string };

/** Mark plus wordmark. `size` is the mark height in px; the wordmark scales with it. */
export function Logo({ size = 24, wordmark = true, className }: LogoProps) {
  return (
    <span className={`logo${className ? ` ${className}` : ""}`} style={{ fontSize: Math.round(size * 0.92) }}>
      <ChairMark size={size} title={wordmark ? undefined : "Open Chair"} />
      {wordmark && <span className="logo-word">Open Chair</span>}
    </span>
  );
}
