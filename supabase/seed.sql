-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  bio text,
  is_verified_seller boolean default false,
  rating numeric
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile for new users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Create a table for properties
create table properties (
  id uuid primary key default gen_random_uuid(),
  realtor_id uuid references public.profiles not null,
  title text,
  price numeric,
  location text,
  address text,
  type text,
  bedrooms int,
  bathrooms int,
  area int,
  description text,
  features text[],
  images text[]
);

-- Set up Row Level Security (RLS) for properties
alter table properties
  enable row level security;

create policy "Properties are viewable by everyone." on properties
  for select using (true);

create policy "Authenticated users can create properties." on properties
  for insert with check (auth.role() = 'authenticated');
  
create policy "Users can update their own properties." on properties
  for update using (auth.uid() = realtor_id);

-- Create storage bucket for property images
insert into storage.buckets (id, name, public)
values ('property_images', 'property_images', true);

create policy "Property images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'property_images' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'property_images' );

create policy "Anyone can update their own avatar."
  on storage.objects for update
  using ( auth.uid() = owner )
  with check ( bucket_id = 'property_images' );
