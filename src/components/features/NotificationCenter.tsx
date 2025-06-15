import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Calendar, 
  MessageCircle, 
  DollarSign, 
  Star,
  Trash2,
  Check,
  CheckCheck
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useNotificationStore } from '../../lib/store';
import { cn } from '../../lib/utils';
import { NotificationType } from '../../lib/types';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'booking_confirmed':
      return <CheckCircle className="h-5 w-5 text-success-500" />;
    case 'booking_cancelled':
    case 'class_cancelled':
      return <AlertCircle className="h-5 w-5 text-error-500" />;
    case 'class_updated':
    case 'class_reminder':
      return <Calendar className="h-5 w-5 text-primary" />;
    case 'new_message':
      return <MessageCircle className="h-5 w-5 text-primary" />;
    case 'payment_received':
      return <DollarSign className="h-5 w-5 text-success-500" />;
    case 'review_received':
      return <Star className="h-5 w-5 text-warning-500" />;
    case 'system_announcement':
      return <Info className="h-5 w-5 text-primary" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
};

export const NotificationCenter: React.FC = () => {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotificationStore();

  React.useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(notificationId);
    }
  };

  const handleDelete = async (notificationId: string) => {
    await deleteNotification(notificationId);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="primary" size="sm">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">No notifications</h4>
          <p className="text-muted-foreground text-sm">
            You're all caught up! New notifications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                'group relative p-4 rounded-lg border transition-all duration-200 hover:shadow-sm',
                notification.read 
                  ? 'bg-background border-border' 
                  : 'bg-primary/5 border-primary/20 dark:bg-primary/10'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={cn(
                      'text-sm font-medium line-clamp-1',
                      notification.read ? 'text-foreground' : 'text-foreground font-semibold'
                    )}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className={cn(
                    'text-sm mt-1 line-clamp-2',
                    notification.read ? 'text-muted-foreground' : 'text-foreground'
                  )}>
                    {notification.message}
                  </p>
                  
                  {!notification.read && (
                    <div className="absolute top-4 left-1 w-2 h-2 bg-primary rounded-full"></div>
                  )}
                </div>
              </div>
              
              {/* Action buttons - shown on hover */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id, notification.read)}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                    title="Mark as read"
                  >
                    <Check className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};