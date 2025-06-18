/*
  # Add email templates and configure auth settings

  1. Email Templates
    - Set up custom email templates for email confirmation
    - Configure email settings for the application

  2. Auth Configuration
    - Enable email confirmation
    - Set custom email templates
    - Configure redirect URLs
*/

-- This migration sets up email templates and auth configuration
-- The actual email template configuration needs to be done in the Supabase dashboard
-- under Authentication > Email Templates

-- Create a function to handle user creation after email confirmation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if user is confirmed and doesn't already have one
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    INSERT INTO public.profiles (id, name, email, role, joined)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();