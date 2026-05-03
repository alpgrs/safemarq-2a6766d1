import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import logoIcon from '/safemarq-icon.png';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: number;
  asLink?: boolean;
  wordmarkClassName?: string;
}

export const LogoMark = ({ size = 32, className }: { size?: number; className?: string }) => (
  <img
    src={logoIcon}
    width={size}
    height={size}
    alt="SAFEMARQ"
    className={cn('shrink-0 object-contain select-none', className)}
    style={{ width: size, height: size }}
    draggable={false}
  />
);

const Logo = ({
  className,
  showWordmark = true,
  size = 32,
  asLink = true,
  wordmarkClassName,
}: LogoProps) => {
  const content = (
    <span className={cn('inline-flex items-center gap-2 group', className)}>
      <LogoMark
        size={size}
        className="drop-shadow-[0_0_14px_hsl(217_91%_60%/0.45)] transition-transform group-hover:scale-105"
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
