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
            'bg-neutral-100 text-neutral-800': variant === 'default',
            'bg-primary-100 text-primary-800': variant === 'primary',
            'bg-secondary-100 text-secondary-800': variant === 'secondary',
            'bg-white text-neutral-800 border border-neutral-200': variant === 'outline',
            'bg-success-100 text-success-800': variant === 'success',
            'bg-warning-100 text-warning-800': variant === 'warning',
            'bg-error-100 text-error-800': variant === 'error',
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