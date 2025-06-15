/*
  # Add Notifications System

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text) - booking_confirmed, class_cancelled, new_message, etc.
      - `title` (text)
      - `message` (text)
      - `data` (jsonb) - additional data for the notification
      - `read` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on notifications table
    - Add policies for users to manage their own notifications
    - Add indexes for performance

  3. Functions
    - Function to create notifications
    - Function to mark notifications as read
    - Function to get unread count
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN (
    'booking_confirmed',
    'booking_cancelled', 
    'class_cancelled',
    'class_updated',
    'new_message',
    'payment_received',
    'review_received',
    'class_reminder',
    'system_announcement'
  )),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications (user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications (user_id, created_at DESC);

-- Create trigger for updating updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS Policies
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  USING (auth.uid() = user_id);

-- System can insert notifications for any user
CREATE POLICY "System can insert notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

-- Function to create a notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_data jsonb DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications 
  SET read = true, updated_at = now()
  WHERE id = notification_id AND user_id = auth.uid();
  
  RETURN FOUND;
END;
$$;

-- Function to mark all notifications as read for a user
CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_count integer;
BEGIN
  -- Only allow users to mark their own notifications as read
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  
  UPDATE notifications 
  SET read = true, updated_at = now()
  WHERE user_id = p_user_id AND read = false;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count(p_user_id uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::integer
  FROM notifications
  WHERE user_id = p_user_id AND read = false;
$$;

-- Function to create booking confirmation notification
CREATE OR REPLACE FUNCTION notify_booking_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  class_info record;
  instructor_info record;
BEGIN
  -- Only create notification for confirmed bookings
  IF NEW.status = 'confirmed' AND (OLD IS NULL OR OLD.status != 'confirmed') THEN
    -- Get class information
    SELECT title, instructor_id, start_time, location_name
    INTO class_info
    FROM classes
    WHERE id = NEW.class_id;
    
    -- Get instructor information
    SELECT name
    INTO instructor_info
    FROM profiles
    WHERE id = class_info.instructor_id;
    
    -- Create notification for the client
    PERFORM create_notification(
      NEW.user_id,
      'booking_confirmed',
      'Booking Confirmed',
      'Your booking for "' || class_info.title || '" with ' || instructor_info.name || ' has been confirmed.',
      jsonb_build_object(
        'class_id', NEW.class_id,
        'booking_id', NEW.id,
        'class_title', class_info.title,
        'instructor_name', instructor_info.name,
        'start_time', class_info.start_time,
        'location', class_info.location_name
      )
    );
    
    -- Create notification for the instructor
    PERFORM create_notification(
      class_info.instructor_id,
      'booking_confirmed',
      'New Booking Received',
      'You have a new booking for "' || class_info.title || '".',
      jsonb_build_object(
        'class_id', NEW.class_id,
        'booking_id', NEW.id,
        'class_title', class_info.title,
        'client_id', NEW.user_id,
        'start_time', class_info.start_time
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for booking notifications
CREATE TRIGGER notify_booking_confirmed_trigger
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_booking_confirmed();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_notification(uuid, text, text, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notification_read(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION mark_all_notifications_read(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_unread_notification_count(uuid) TO authenticated;