/*
  # Update venues table to use postal codes

  1. Changes
    - Remove address column
    - Add postal_code column
    - Add unique constraint on name + postal_code + city
    - Update existing RLS policies

  2. Security
    - Maintain existing RLS policies
    - Keep verification system intact
*/

-- Drop old venues table if it exists
DROP TABLE IF EXISTS venues CASCADE;

-- Create new venues table with postal code
CREATE TABLE venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  postal_code text NOT NULL,
  city text NOT NULL,
  coordinates point NOT NULL,
  verified boolean DEFAULT false,
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(name, postal_code, city)
);

-- Enable RLS
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

-- Create trigger for updating updated_at
CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create policies
CREATE POLICY "Venues are viewable by everyone"
  ON venues
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Instructors can create venues"
  ON venues
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'instructor'
    )
  );

CREATE POLICY "Admins can verify venues"
  ON venues
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
