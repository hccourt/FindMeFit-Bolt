import React from 'react';
import { cn } from '../../lib/utils';
import { getInitials } from '../../lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
  alt?: string;
  name?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', src, alt, name, status, ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);
    
    const handleError = () => {
      setImgError(true);
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-muted text-foreground',
          {
            'w-8 h-8 text-sm': size === 'sm',
            'w-10 h-10 text-base': size === 'md',
            'w-12 h-12 text-lg': size === 'lg',
            'w-16 h-16 text-xl': size === 'xl',
          },
          className
        )}
        {...props}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            onError={handleError}
            className="h-full w-full object-cover"
          />
        ) : name ? (
          <span className="font-medium">{getInitials(name)}</span>
        ) : (
          <span className="font-medium">
            {alt ? getInitials(alt) : 'U'}
          </span>
        )}
        
        {status && (
          <span
            className={cn(
              'absolute right-0 bottom-0 block rounded-full ring-2 ring-background',
              {
                'bg-success-500': status === 'online',
                'bg-neutral-400': status === 'offline',
                'bg-error-500': status === 'busy',
                'bg-warning-500': status === 'away',
                'h-2 w-2': size === 'sm',
                'h-2.5 w-2.5': size === 'md',
                'h-3 w-3': size === 'lg',
                'h-3.5 w-3.5': size === 'xl',
              }
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';