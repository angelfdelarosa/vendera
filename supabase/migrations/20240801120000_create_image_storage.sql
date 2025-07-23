-- Create a bucket for property images, if it doesn't exist
insert into storage.buckets (id, name, public)
values ('property_images', 'property_images', true)
on conflict (id) do nothing;

-- Drop existing policies to avoid conflicts
drop policy if exists "Allow public read access" on storage.objects;
drop policy if exists "Allow authenticated users to upload" on storage.objects;
drop policy if exists "Give users access to their own images" on storage.objects;

-- Set up new RLS policies for the property_images bucket

-- 1. Allow public read access to everyone
create policy "Public access for property images"
on storage.objects for select
using ( bucket_id = 'property_images' );

-- 2. Allow authenticated users to insert files
create policy "Authenticated users can upload images"
on storage.objects for insert to authenticated
with check ( bucket_id = 'property_images' );

-- 3. Allow users to update their own images
create policy "Authenticated users can update their own images"
on storage.objects for update to authenticated
using ( auth.uid() = owner )
with check ( bucket_id = 'property_images' );

-- 4. Allow users to delete their own images
create policy "Authenticated users can delete their own images"
on storage.objects for delete to authenticated
using ( auth.uid() = owner );
