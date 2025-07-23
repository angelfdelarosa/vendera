-- Grant permissions to the handle_new_user function to act as supabase_auth_admin
-- This is necessary for the function to be able to insert into the public.profiles table
-- after a new user signs up in the auth.users table.

ALTER FUNCTION public.handle_new_user()
SECURITY DEFINER;

-- Revoke default permissions from public role
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public;

-- Grant execute permissions specifically to the authenticated role
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;

-- Grant execute permissions specifically to the service_role for backend operations
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
