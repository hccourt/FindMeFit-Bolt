import { useNotificationStore } from './store';
import { NotificationType } from './types';

/**
 * Utility functions for creating common notification types
 */

export const notificationUtils = {
  /**
   * Create a booking confirmation notification
   */
  bookingConfirmed: async (
    userId: string, 
    classTitle: string, 
    instructorName: string, 
    startTime: string,
    data: Record<string, any> = {}
  ) => {
    const { createNotification } = useNotificationStore.getState();
    await createNotification(
      userId,
      'booking_confirmed',
      'Booking Confirmed',
      `Your booking for "${classTitle}" with ${instructorName} has been confirmed.`,
      { classTitle, instructorName, startTime, ...data }
    );
  },

  /**
   * Create a class cancellation notification
   */
  classCancelled: async (
    userId: string,
    classTitle: string,
    reason?: string,
    data: Record<string, any> = {}
  ) => {
    const { createNotification } = useNotificationStore.getState();
    const message = reason 
      ? `"${classTitle}" has been cancelled. Reason: ${reason}`
      : `"${classTitle}" has been cancelled.`;
    
    await createNotification(
      userId,
      'class_cancelled',
      'Class Cancelled',
      message,
      { classTitle, reason, ...data }
    );
  },

  /**
   * Create a class update notification
   */
  classUpdated: async (
    userId: string,
    classTitle: string,
    changes: string,
    data: Record<string, any> = {}
  ) => {
    const { createNotification } = useNotificationStore.getState();
    await createNotification(
      userId,
      'class_updated',
      'Class Updated',
      `"${classTitle}" has been updated. ${changes}`,
      { classTitle, changes, ...data }
    );
  },

  /**
   * Create a new message notification
   */
  newMessage: async (
    userId: string,
    senderName: string,
    classTitle: string,
    data: Record<string, any> = {}
  ) => {
    const { createNotification } = useNotificationStore.getState();
    await createNotification(
      userId,
      'new_message',
      'New Message',
      `${senderName} sent you a message about "${classTitle}".`,
      { senderName, classTitle, ...data }
    );
  },

  /**
   * Create a payment received notification
   */
  paymentReceived: async (
    userId: string,
    amount: number,
    currency: string,
    classTitle: string,
    data: Record<string, any> = {}
  ) => {
    const { createNotification } = useNotificationStore.getState();
    await createNotification(
      userId,
      'payment_received',
      'Payment Received',
      `You received ${currency}${amount} for "${classTitle}".`,
      { amount, currency, classTitle, ...data }
    );
  },

  /**
   * Create a review received notification
   */
  reviewReceived: async (
    userId: string,
    rating: number,
    reviewerName: string,
    classTitle: string,
    data: Record<string, any> = {}
  ) => {
    const { createNotification } = useNotificationStore.getState();
    await createNotification(
      userId,
      'review_received',
      'New Review',
      `${reviewerName} left you a ${rating}-star review for "${classTitle}".`,
      { rating, reviewerName, classTitle, ...data }
    );
  },

  /**
   * Create a class reminder notification
   */
  classReminder: async (
    userId: string,
    classTitle: string,
    startTime: string,
    location: string,
    data: Record<string, any> = {}
  ) => {
    const { createNotification } = useNotificationStore.getState();
    await createNotification(
      userId,
      'class_reminder',
      'Class Reminder',
      `Don't forget about "${classTitle}" starting soon at ${location}.`,
      { classTitle, startTime, location, ...data }
    );
  },

  /**
   * Create a system announcement notification
   */
  systemAnnouncement: async (
    userId: string,
    title: string,
    message: string,
    data: Record<string, any> = {}
  ) => {
    const { createNotification } = useNotificationStore.getState();
    await createNotification(
      userId,
      'system_announcement',
      title,
      message,
      data
    );
  }
};
