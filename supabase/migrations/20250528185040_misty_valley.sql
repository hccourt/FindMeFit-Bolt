/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `email` (text)
      - `role` (text)
      - `profile_image` (text)
      - `bio` (text)
      - `location` (text)
      - `phone` (text)
      - `joined` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `classes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `instructor_id` (uuid, references profiles)
      - `location_name` (text)
      - `location_address` (text)
      - `location_city` (text)
      - `location_coordinates` (point)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `price` (numeric)
      - `max_participants` (int)
      - `current_participants` (int)
      - `type` (text)
      - `level` (text)
      - `tags` (text[])
      - `image_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `bookings`
      - `id` (uuid, primary key)
      - `class_id` (uuid, references classes)
      - `user_id` (uuid, references profiles)
      - `status` (text)
      - `booked_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for instructors
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('client', 'instructor', 'admin')),
  profile_image text,
  bio text,
  location text,
  phone text,
  joined timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  instructor_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  location_name text NOT NULL,
  location_address text NOT NULL,
  location_city text NOT NULL,
  location_coordinates point NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  max_participants integer NOT NULL CHECK (max_participants > 0),
  current_participants integer DEFAULT 0 CHECK (current_participants >= 0),
  type text NOT NULL CHECK (type IN ('group', 'personal')),
  level text NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all')),
  tags text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT current_participants_check CHECK (current_participants <= max_participants)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('confirmed', 'pending', 'cancelled', 'completed')),
  booked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Classes policies
CREATE POLICY "Classes are viewable by everyone"
  ON classes FOR SELECT
  USING (true);

CREATE POLICY "Instructors can insert own classes"
  ON classes FOR INSERT
  WITH CHECK (auth.uid() = instructor_id AND EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'instructor'
  ));

CREATE POLICY "Instructors can update own classes"
  ON classes FOR UPDATE
  USING (auth.uid() = instructor_id)
  WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "Instructors can delete own classes"
  ON classes FOR DELETE
  USING (auth.uid() = instructor_id);

-- Bookings policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view bookings for their classes"
  ON bookings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = bookings.class_id
    AND classes.instructor_id = auth.uid()
  ));

CREATE POLICY "Users can insert own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update class participants count
CREATE OR REPLACE FUNCTION update_class_participants()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE classes
    SET current_participants = current_participants + 1
    WHERE id = NEW.class_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
    UPDATE classes
    SET current_participants = current_participants - 1
    WHERE id = NEW.class_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating class participants
CREATE TRIGGER update_class_participants_trigger
AFTER INSERT OR UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_class_participants();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON classes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
