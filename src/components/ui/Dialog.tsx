import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md'
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop - covers entire screen */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal container - centers content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            'relative bg-card rounded-lg shadow-xl w-full p-6 h-full',
            sizeClasses[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative">
            {title && (
              <div className="pt-2 pb-6 border-b border-border">
                <h3 className="text-lg font-semibold leading-6 text-foreground">
                  {title}
                </h3>
              </div>
            )}
            <button
              type="button"
              className="absolute right-0 top-0 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className=" py-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
