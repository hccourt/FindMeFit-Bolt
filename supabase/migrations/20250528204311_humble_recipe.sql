/*
  # Add rating and experience columns to profiles table

  1. Changes
    - Add `rating` column (numeric, default 0)
    - Add `review_count` column (integer, default 0)
    - Add `experience` column (integer, default 0)

  2. Notes
    - All columns have default values to prevent null values
    - Rating is numeric to support decimal values (e.g., 4.5)
    - Review count and experience are integers
*/

DO $$ 
BEGIN
  -- Add rating column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'rating'
  ) THEN
    ALTER TABLE profiles ADD COLUMN rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5);
  END IF;

  -- Add review_count column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'review_count'
  ) THEN
    ALTER TABLE profiles ADD COLUMN review_count integer DEFAULT 0 CHECK (review_count >= 0);
  END IF;

  -- Add experience column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'experience'
  ) THEN
    ALTER TABLE profiles ADD COLUMN experience integer DEFAULT 0 CHECK (experience >= 0);
  END IF;
END $$;
