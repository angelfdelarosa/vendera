-- Create the public.profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
-- Users can view all profiles
create policy "Public profiles are viewable by everyone." on profiles for
select using (true);
-- Users can only insert their own profile
create policy "Users can insert their own profile." on profiles for
insert with check (auth.uid() = id);
-- Users can only update their own profile
create policy "Users can update own profile." on profiles for
update using (auth.uid() = id);

-- Enable RLS for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
