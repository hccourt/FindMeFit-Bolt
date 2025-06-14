/*
  # Add function to get participant counts with elevated permissions

  1. New Functions
    - `get_class_participant_count`: Function to get participant count for a specific class
    - `get_all_class_participant_counts`: Function to get participant counts for all classes
    
  2. Security
    - Functions run with SECURITY DEFINER to bypass RLS
    - Only return participant counts, not sensitive booking data
    - Available to all users (public access for counts only)
*/

-- Function to get participant count for a specific class
CREATE OR REPLACE FUNCTION get_class_participant_count(class_id_param uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::integer
  FROM bookings
  WHERE class_id = class_id_param
  AND status = 'confirmed';
$$;

-- Function to get participant counts for all classes
CREATE OR REPLACE FUNCTION get_all_class_participant_counts()
RETURNS TABLE (class_id uuid, participant_count integer)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    b.class_id,
    COUNT(*)::integer as participant_count
  FROM bookings b
  WHERE b.status = 'confirmed'
  GROUP BY b.class_id;
$$;

-- Grant execute permissions to all users
GRANT EXECUTE ON FUNCTION get_class_participant_count(uuid) TO public;
GRANT EXECUTE ON FUNCTION get_all_class_participant_counts() TO public;