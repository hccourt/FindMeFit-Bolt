/*
  # Remove current_participants column and related triggers

  1. Changes
    - Drop the current_participants column from classes table
    - Drop the trigger and function that was trying to maintain it
    - We'll calculate participant counts in real-time from bookings table

  2. Benefits
    - No more sync issues between current_participants and actual bookings
    - Always accurate participant counts
    - Simpler database schema
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS update_class_participants_trigger ON bookings;
DROP FUNCTION IF EXISTS update_class_participants();

-- Remove the current_participants column since we'll calculate it in real-time
ALTER TABLE classes DROP COLUMN IF EXISTS current_participants;
