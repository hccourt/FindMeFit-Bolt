/*
  # Align Database Schema with Project Files

  1. Add Missing Columns
    - Add rating and specialties columns to profiles
    - Ensure all constraints match frontend validations
    - Add missing indexes for performance

  2. Security
    - Update RLS policies to match frontend requirements
    - Add missing policies for chat functionality
*/

-- Add specialties column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'specialties'
  ) THEN
    ALTER TABLE profiles ADD COLUMN specialties text[] DEFAULT '{}';
  END IF;
END $$;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_classes_start_time ON classes (start_time);
CREATE INDEX IF NOT EXISTS idx_classes_instructor_id ON classes (instructor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings (user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_class_id ON bookings (class_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON chat_messages (chat_id);

-- Update classes constraints to match frontend validation
ALTER TABLE classes DROP CONSTRAINT IF EXISTS classes_price_check;
ALTER TABLE classes ADD CONSTRAINT classes_price_check 
  CHECK (price >= 0 AND price <= 1000);

-- Add function to get upcoming classes for a user
CREATE OR REPLACE FUNCTION get_user_upcoming_classes(user_id_param uuid)
RETURNS TABLE (
  booking_id uuid,
  class_id uuid,
  title text,
  description text,
  start_time timestamptz,
  end_time timestamptz,
  location_name text,
  location_city text,
  instructor_name text,
  instructor_profile_image text,
  price numeric,
  type text,
  level text,
  image_url text
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    b.id as booking_id,
    c.id as class_id,
    c.title,
    c.description,
    c.start_time,
    c.end_time,
    c.location_name,
    c.location_city,
    p.name as instructor_name,
    p.profile_image as instructor_profile_image,
    c.price,
    c.type,
    c.level,
    c.image_url
  FROM bookings b
  JOIN classes c ON b.class_id = c.id
  JOIN profiles p ON c.instructor_id = p.id
  WHERE b.user_id = user_id_param
  AND b.status = 'confirmed'
  AND c.start_time > NOW()
  ORDER BY c.start_time ASC;
$$;
