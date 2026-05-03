import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: number;
  asLink?: boolean;
  wordmarkClassName?: string;
}

/**
 * SAFEMARQ brand mark.
 * - Shield = trust / safety
 * - Inner checkmark = verified
 * - Road perspective lines = automotive
 * Rendered as inline SVG so it scales crisply and inherits color tokens.
 */
export const LogoMark = ({ size = 32, className }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('shrink-0', className)}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="safemarq-shield" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="hsl(217 91% 65%)" />
        <stop offset="100%" stopColor="hsl(217 91% 50%)" />
      </linearGradient>
      <linearGradient id="safemarq-check" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="hsl(0 0% 100%)" />
        <stop offset="100%" stopColor="hsl(195 100% 92%)" />
      </linearGradient>
    </defs>

    {/* Shield */}
    <path
      d="M24 3 L42 9 V24 C42 34 34 41.5 24 45 C14 41.5 6 34 6 24 V9 Z"
      fill="url(#safemarq-shield)"
    />

    {/* Inner subtle bevel */}
    <path
      d="M24 6 L39 11 V24 C39 32.5 32.3 39 24 42 C15.7 39 9 32.5 9 24 V11 Z"
      fill="hsl(217 91% 55%)"
      fillOpacity="0.35"
    />

    {/* Checkmark */}
    <path
      d="M16 24 L22 30 L33 17"
      stroke="url(#safemarq-check)"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Road perspective lines under the check */}
    <path
      d="M19 36 L23 32 M29 36 L25 32"
      stroke="hsl(0 0% 100%)"
      strokeOpacity="0.55"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const Logo = ({
  className,
  showWordmark = true,
  size = 28,
  asLink = true,
  wordmarkClassName,
}: LogoProps) => {
  const content = (
    <span className={cn('inline-flex items-center gap-2 group', className)}>
      <LogoMark
        size={size}
        className="drop-shadow-[0_0_12px_hsl(217_91%_60%/0.35)] transition-transform group-hover:scale-105"
      />
      {showWordmark && (
        <span
          className={cn(
            'font-extrabold tracking-[0.18em] text-foreground text-base leading-none',
            wordmarkClassName,
          )}
        >
          SAFEMARQ
        </span>
      )}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link to="/" aria-label="SAFEMARQ — Accueil" className="inline-flex items-center">
      {content}
    </Link>
  );
};

export default Logo;
