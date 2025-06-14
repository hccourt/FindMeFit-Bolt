/*
  # Fix get_or_create_chat function

  1. Changes
    - Drop existing function to avoid return type conflict
    - Recreate function with correct return type
    - Function returns chat ID as JSON
    - Includes authorization checks for instructors and confirmed participants

  2. Security
    - Function runs with security definer
    - Checks user authorization before allowing access
*/

-- Drop the existing function if it exists
drop function if exists get_or_create_chat(uuid);

-- Create the function to get or create a chat for a class
create function get_or_create_chat(class_id_param uuid)
returns json
language plpgsql
security definer
as $$
declare
  chat_record record;
  user_id uuid;
  is_authorized boolean;
begin
  -- Get the current user's ID
  user_id := auth.uid();
  
  -- Check if user is authorized (instructor or confirmed participant)
  select exists (
    select 1
    from classes c
    where c.id = class_id_param
    and (
      c.instructor_id = user_id
      or exists (
        select 1
        from bookings b
        where b.class_id = c.id
        and b.user_id = user_id
        and b.status = 'confirmed'
      )
    )
  ) into is_authorized;
  
  -- If not authorized, raise an error
  if not is_authorized then
    raise exception 'Not authorized to access this chat';
  end if;
  
  -- Try to get existing chat
  select * into chat_record
  from chats
  where class_id = class_id_param;
  
  -- If chat doesn't exist, create it
  if chat_record is null then
    insert into chats (class_id)
    values (class_id_param)
    returning * into chat_record;
  end if;
  
  -- Return the chat ID as JSON
  return json_build_object('chat_id', chat_record.id);
end;
$$;
