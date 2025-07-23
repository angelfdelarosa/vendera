-- Create the storage bucket for property images
insert into storage.buckets
  (id, name, public)
values
  ('property_images', 'property_images', true)
on conflict (id) do nothing;

-- Set up security policies for the property_images bucket
-- Allow public read access
create policy "Allow public read access" on storage.objects for select using ( bucket_id = 'property_images' );

-- Allow authenticated users to upload images
create policy "Allow authenticated uploads" on storage.objects for insert to authenticated with check ( bucket_id = 'property_images' );

-- Allow users to update their own images
create policy "Allow own image update" on storage.objects for update using ( auth.uid() = owner ) with check ( bucket_id = 'property_images' );

-- Allow users to delete their own images
create policy "Allow own image delete" on storage.objects for delete using ( auth.uid() = owner );
