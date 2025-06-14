/*
  # Fix current_participants trigger

  1. Changes
    - Drop existing trigger and function
    - Create new improved trigger function
    - Handle INSERT, UPDATE, and DELETE operations properly
    - Recalculate current_participants based on confirmed bookings

  2. Security
    - Function runs with proper permissions
    - Handles all booking status changes correctly
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS update_class_participants_trigger ON bookings;
DROP FUNCTION IF EXISTS update_class_participants();

-- Create improved function to update class participants
CREATE OR REPLACE FUNCTION update_class_participants()
RETURNS TRIGGER AS $$
DECLARE
  target_class_id uuid;
  confirmed_count integer;
BEGIN
  -- Determine which class to update
  IF TG_OP = 'DELETE' THEN
    target_class_id := OLD.class_id;
  ELSE
    target_class_id := NEW.class_id;
  END IF;
  
  -- Count confirmed bookings for this class
  SELECT COUNT(*) INTO confirmed_count
  FROM bookings
  WHERE class_id = target_class_id
  AND status = 'confirmed';
  
  -- Update the class with the actual count
  UPDATE classes
  SET current_participants = confirmed_count
  WHERE id = target_class_id;
  
  -- Return appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for all operations
CREATE TRIGGER update_class_participants_trigger
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_class_participants();

-- Update all existing classes to have correct participant counts
UPDATE classes 
SET current_participants = (
  SELECT COUNT(*)
  FROM bookings 
  WHERE bookings.class_id = classes.id 
  AND bookings.status = 'confirmed'
);
