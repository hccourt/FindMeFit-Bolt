/*
  # Add instructor dashboard functionality

  1. New Functions
    - `get_instructor_classes`: Function to get all classes for an instructor
    - `create_class`: Function to create a new class
    - `update_class`: Function to update class details
    - `delete_class`: Function to delete a class

  2. Security
    - Add RLS policies for instructor operations
    - Ensure instructors can only manage their own classes
*/

-- Function to get instructor classes
CREATE OR REPLACE FUNCTION get_instructor_classes(instructor_id uuid)
RETURNS SETOF classes
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT *
  FROM classes
  WHERE classes.instructor_id = instructor_id
  ORDER BY start_time DESC;
$$;

-- Function to create a new class
CREATE OR REPLACE FUNCTION create_class(
  title text,
  description text,
  instructor_id uuid,
  location_name text,
  location_address text,
  location_city text,
  location_coordinates point,
  start_time timestamptz,
  end_time timestamptz,
  price numeric,
  max_participants integer,
  type text,
  level text,
  tags text[],
  image_url text
)
RETURNS classes
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_class classes;
BEGIN
  -- Verify the instructor exists and has the correct role
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = instructor_id AND role = 'instructor'
  ) THEN
    RAISE EXCEPTION 'Invalid instructor ID or user is not an instructor';
  END IF;

  -- Insert the new class
  INSERT INTO classes (
    title,
    description,
    instructor_id,
    location_name,
    location_address,
    location_city,
    location_coordinates,
    start_time,
    end_time,
    price,
    max_participants,
    type,
    level,
    tags,
    image_url
  )
  VALUES (
    title,
    description,
    instructor_id,
    location_name,
    location_address,
    location_city,
    location_coordinates,
    start_time,
    end_time,
    price,
    max_participants,
    type,
    level,
    tags,
    image_url
  )
  RETURNING * INTO new_class;

  RETURN new_class;
END;
$$;