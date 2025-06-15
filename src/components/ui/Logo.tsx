import React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'white';
}

export const Logo: React.FC<LogoProps> = ({ className, variant = 'default', ...props }) => {
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <div className="relative w-8 h-8 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-primary rounded-lg">
          <MapPin className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
      <span className={cn(
        'text-xl font-bold',
        variant === 'white' ? 'text-white' : 'text-foreground'
      )}>
        FindMeFit
      </span>
    </div>
  );
};
