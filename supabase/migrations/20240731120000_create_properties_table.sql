
-- Create a table for public properties
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  realtor_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  price numeric not null,
  location text,
  address text,
  type text not null,
  bedrooms integer,
  bathrooms integer,
  area integer,
  description text,
  features text[],
  images text[]
);

-- Set up Row Level Security (RLS) for the properties table
alter table properties
  enable row level security;

-- Policy: Public properties are viewable by everyone
drop policy if exists "Public properties are viewable by everyone." on properties;
create policy "Public properties are viewable by everyone." on properties
  for select using (true);

-- Policy: Users can insert their own properties
drop policy if exists "Users can insert their own properties." on properties;
create policy "Users can insert their own properties." on properties
  for insert with check (auth.uid() = realtor_id);

-- Policy: Users can update their own properties
drop policy if exists "Users can update their own properties." on properties;
create policy "Users can update their own properties." on properties
  for update using (auth.uid() = realtor_id);

-- Policy: Users can delete their own properties
drop policy if exists "Users can delete their own properties." on properties;
create policy "Users can delete their own properties." on properties
  for delete using (auth.uid() = realtor_id);

