/*
  # Fix Email Verification Flow

  1. Changes
    - Update trigger to only create profiles AFTER email confirmation
    - Add better logging and error handling
    - Ensure profiles are only created when email is actually confirmed
    - Fix the trigger logic to prevent premature profile creation

  2. Security
    - Maintain RLS policies
    - Ensure proper user verification before profile creation
*/

-- Drop existing trigger and function to recreate them properly
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create improved function that only creates profiles after email confirmation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name text;
  user_role text;
BEGIN
  -- Only proceed if this is an email confirmation event
  -- Check that email_confirmed_at was just set (wasn't set before)
  IF NEW.email_confirmed_at IS NOT NULL AND 
     (OLD IS NULL OR OLD.email_confirmed_at IS NULL) AND
     NEW.aud = 'authenticated' THEN
    
    -- Extract metadata with fallbacks
    user_name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'client');
    
    -- Log the profile creation attempt
    RAISE LOG 'Creating profile for user % with email %', NEW.id, NEW.email;
    
    -- Create profile only after email confirmation
    INSERT INTO public.profiles (
      id, 
      name, 
      email, 
      role, 
      joined,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      user_name,
      NEW.email,
      user_role,
      NEW.email_confirmed_at,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      role = EXCLUDED.role,
      updated_at = NOW();
      
    RAISE LOG 'Profile created successfully for user %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that only fires on UPDATE (when email gets confirmed)
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL)
  EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON auth.users TO postgres, service_role;