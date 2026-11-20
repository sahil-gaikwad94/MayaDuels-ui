import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'magenta' | 'amber' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:
    'bg-cyan text-[#04120F] hover:bg-[#3BFFE4] active:bg-[#00D9BC] shadow-[0_16px_40px_-16px_rgba(0,245,212,0.65)]',
  secondary:
    'bg-raised text-ink border border-line hover:border-line-strong hover:bg-elevated',
  ghost: 'bg-transparent text-muted hover:text-ink hover:bg-white/5',
  magenta:
    'bg-magenta text-white hover:bg-[#FF4C97] shadow-[0_16px_40px_-16px_rgba(255,42,133,0.6)]',
  amber:
    'bg-amber text-[#1A1200] hover:bg-[#FFC733] shadow-[0_16px_40px_-16px_rgba(255,184,0,0.5)]',
  danger: 'bg-error/15 text-error border border-error/30 hover:bg-error/25',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] rounded-full gap-1.5',
  md: 'h-12 px-5 text-[15px] rounded-full gap-2',
  lg: 'h-14 px-7 text-base rounded-full gap-2.5',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  full,
  icon,
  trailingIcon,
  loading,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.972 }}
      transition={{ duration: 0.12 }}
      className={cn(
        'press relative inline-flex select-none items-center justify-center font-medium tracking-[-0.01em]',
        'disabled:pointer-events-none disabled:opacity-45',
        variants[variant],
        sizes[size],
        full && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : (
        icon
      )}
      {children}
      {trailingIcon}
    </motion.button>
  );
}

export function IconButton({
  className,
  label,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      aria-label={label}
      className={cn(
        'press inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-raised/80 text-muted',
        'hover:border-line-strong hover:text-ink',
        className,
      )}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}