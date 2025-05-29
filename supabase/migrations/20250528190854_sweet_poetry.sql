/*
  # Add profiles insert policy

  1. Security Changes
    - Add RLS policy to allow users to insert their own profile data
    - This policy ensures users can only create a profile for their own user ID
    - Required for user registration to work properly

  Note: The profiles table already has RLS enabled and other policies for SELECT and UPDATE
*/

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);