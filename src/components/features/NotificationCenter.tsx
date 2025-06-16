import React from 'react';
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
import { useNotificationStore, useAuthStore } from '../../lib/store';
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

const formatTime = (dateString: string, isWelcomeNotification: boolean) => {
  if (isWelcomeNotification) return 'now';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
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
  const { isAuthenticated } = useAuthStore();

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
      <div className="p-0 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
        </div>
        <div className="space-y-4 flex-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default notification for anonymous users
  const defaultNotifications = [{
    id: 'welcome-notification',
    type: 'system_announcement',
    title: 'Welcome to FindMeFit',
    message: 'Sign in or register to book classes, save favorites, and more!',
    read: false,
    created_at: new Date().toISOString()
  }];

  const displayNotifications = !isAuthenticated ? defaultNotifications : 
    notifications.length > 0 ? notifications : [];

  const showUnreadBadge = !isAuthenticated || unreadCount > 0;

  return (
    <div className="p-0 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          {showUnreadBadge && (
            <Badge variant="primary" size="sm" className="text-white">
              {!isAuthenticated ? 1 : unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && isAuthenticated && (
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

      {displayNotifications.length === 0 && isAuthenticated ? (
        <div className="text-center py-12 flex-1 flex flex-col items-center justify-center">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium text-foreground mb-2">No notifications</h4>
          <p className="text-muted-foreground text-sm">
            You're all caught up! New notifications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2 flex-1 overflow-y-auto">
          {displayNotifications.map((notification) => (
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
                      {formatTime(notification.created_at, notification.id === 'welcome-notification')}
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
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                {!notification.read && notification.id !== 'welcome-notification' && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id, notification.read)}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                    title="Mark as read"
                  >
                    <Check className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
                {notification.id !== 'welcome-notification' && (
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
