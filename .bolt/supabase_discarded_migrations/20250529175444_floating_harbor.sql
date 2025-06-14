/*
  # Add venues table and modify classes table

  1. New Tables
    - `venues`
      - `id` (uuid, primary key)
      - `name` (text)
      - `address` (text)
      - `city` (text)
      - `coordinates` (point)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `verified` (boolean)
      - `verified_at` (timestamp)
      - `verified_by` (uuid, references profiles)

  2. Changes
    - Modify classes table to reference venues
    - Add RLS policies for venues table
*/

-- Create venues table
CREATE TABLE IF NOT EXISTS venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  coordinates point NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  verified boolean DEFAULT false,
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  UNIQUE(name, address, city)
);

-- Add trigger for updated_at
CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable RLS
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Venues are viewable by everyone"
  ON venues FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Instructors can insert venues"
  ON venues FOR INSERT
  TO public
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'instructor'
  ));

CREATE POLICY "Admin can verify venues"
  ON venues FOR UPDATE
  TO public
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- Add venue_id to classes table
ALTER TABLE classes
  ADD COLUMN venue_id uuid REFERENCES venues(id);

-- Update classes to use venue_id and mark existing location columns as deprecated
COMMENT ON COLUMN classes.location_name IS 'DEPRECATED: Use venue_id instead';
COMMENT ON COLUMN classes.location_address IS 'DEPRECATED: Use venue_id instead';
COMMENT ON COLUMN classes.location_city IS 'DEPRECATED: Use venue_id instead';
COMMENT ON COLUMN classes.location_coordinates IS 'DEPRECATED: Use venue_id instead';
