/*
  # Add Chat Functionality

  1. New Tables
    - `chats`
      - `id` (uuid, primary key)
      - `class_id` (uuid, references classes)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `chat_messages`
      - `id` (uuid, primary key)
      - `chat_id` (uuid, references chats)
      - `sender_id` (uuid, references profiles)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for class participants and instructors
*/

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat policies
CREATE POLICY "Class participants and instructors can view chats"
  ON chats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = chats.class_id
      AND (
        classes.instructor_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM bookings
          WHERE bookings.class_id = classes.id
          AND bookings.user_id = auth.uid()
          AND bookings.status = 'confirmed'
        )
      )
    )
  );

CREATE POLICY "Class participants and instructors can insert chats"
  ON chats FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = class_id
      AND (
        classes.instructor_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM bookings
          WHERE bookings.class_id = classes.id
          AND bookings.user_id = auth.uid()
          AND bookings.status = 'confirmed'
        )
      )
    )
  );

-- Chat messages policies
CREATE POLICY "Class participants and instructors can view messages"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chats
      JOIN classes ON classes.id = chats.class_id
      WHERE chats.id = chat_messages.chat_id
      AND (
        classes.instructor_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM bookings
          WHERE bookings.class_id = classes.id
          AND bookings.user_id = auth.uid()
          AND bookings.status = 'confirmed'
        )
      )
    )
  );

CREATE POLICY "Users can insert own messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM chats
      JOIN classes ON classes.id = chats.class_id
      WHERE chats.id = chat_id
      AND (
        classes.instructor_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM bookings
          WHERE bookings.class_id = classes.id
          AND bookings.user_id = auth.uid()
          AND bookings.status = 'confirmed'
        )
      )
    )
  );

-- Create function to get or create chat for a class
CREATE OR REPLACE FUNCTION get_or_create_chat(class_id_param uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  chat_id uuid;
BEGIN
  -- Try to get existing chat
  SELECT id INTO chat_id
  FROM chats
  WHERE class_id = class_id_param;
  
  -- If no chat exists, create one
  IF chat_id IS NULL THEN
    INSERT INTO chats (class_id)
    VALUES (class_id_param)
    RETURNING id INTO chat_id;
  END IF;
  
  RETURN chat_id;
END;
$$;
