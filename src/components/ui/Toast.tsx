import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Calendar, MessageCircle, DollarSign, Star, Bell } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Toast as ToastType, NotificationType } from '../../lib/types';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

const getToastIcon = (type: NotificationType) => {
  switch (type) {
    case 'booking_confirmed':
      return <CheckCircle className="h-5 w-5" />;
    case 'booking_cancelled':
    case 'class_cancelled':
      return <AlertCircle className="h-5 w-5" />;
    case 'class_updated':
    case 'class_reminder':
      return <Calendar className="h-5 w-5" />;
    case 'new_message':
      return <MessageCircle className="h-5 w-5" />;
    case 'payment_received':
      return <DollarSign className="h-5 w-5" />;
    case 'review_received':
      return <Star className="h-5 w-5" />;
    case 'system_announcement':
      return <Info className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

const getToastStyles = (type: NotificationType) => {
  switch (type) {
    case 'booking_confirmed':
    case 'payment_received':
      return 'bg-success-50 border-success-200 text-success-800 dark:bg-success-900/20 dark:border-success-800 dark:text-success-300';
    case 'booking_cancelled':
    case 'class_cancelled':
      return 'bg-error-50 border-error-200 text-error-800 dark:bg-error-900/20 dark:border-error-800 dark:text-error-300';
    case 'class_updated':
    case 'class_reminder':
    case 'new_message':
      return 'bg-primary-50 border-primary-200 text-primary-800 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-300';
    case 'review_received':
      return 'bg-warning-50 border-warning-200 text-warning-800 dark:bg-warning-900/20 dark:border-warning-800 dark:text-warning-300';
    default:
      return 'bg-card border-border text-card-foreground';
  }
};

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm w-full cursor-pointer transition-all duration-300 hover:shadow-xl',
        getToastStyles(toast.type)
      )}
      onClick={() => onRemove(toast.id)}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getToastIcon(toast.type)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold mb-1">{toast.title}</h4>
        <p className="text-sm opacity-90 line-clamp-2">{toast.message}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(toast.id);
        }}
        className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};