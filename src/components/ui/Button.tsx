import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary hover:bg-primary/90 active:bg-primary/80 text-white': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70': variant === 'secondary',
            'bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground active:bg-accent/80': variant === 'outline',
            'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80': variant === 'ghost',
            'bg-transparent text-primary hover:underline p-0 h-auto': variant === 'link',
            'bg-error-500 text-white hover:bg-error-600 active:bg-error-700': variant === 'danger',
            'text-sm px-3 py-1.5 h-8': size === 'sm',
            'text-base px-4 py-2 h-10': size === 'md',
            'text-lg px-6 py-2.5 h-12': size === 'lg',
            'w-full': fullWidth,
            'opacity-60 pointer-events-none': isLoading,
          },
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-current" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
