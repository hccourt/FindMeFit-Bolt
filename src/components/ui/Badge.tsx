import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium',
          {
            'bg-muted text-muted-foreground': variant === 'default',
            'bg-primary text-primary-foreground': variant === 'primary',
            'bg-secondary text-secondary-foreground': variant === 'secondary',
            'bg-background text-foreground border border-border': variant === 'outline',
            'bg-success-100 text-success-900 dark:bg-success-900/20 dark:text-success-300': variant === 'success',
            'bg-warning-100 text-warning-900 dark:bg-warning-900/20 dark:text-warning-300': variant === 'warning',
            'bg-error-100 text-error-900 dark:bg-error-900/20 dark:text-error-300': variant === 'error',
            'text-xs px-2 py-0.5': size === 'sm',
            'text-sm px-2.5 py-0.5': size === 'md',
            'text-base px-3 py-1': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
