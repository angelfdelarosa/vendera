
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to manage their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow all users to view images" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "anyone can read images" ON storage.objects;


-- Create new, more specific policies
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'property_images' AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own property images"
ON storage.objects FOR UPDATE TO authenticated USING (
  auth.uid() = owner_id
);

CREATE POLICY "Users can delete their own property images"
ON storage.objects FOR DELETE TO authenticated USING (
  auth.uid() = owner_id
);

CREATE POLICY "Anyone can view property images"
ON storage.objects FOR SELECT USING (
  bucket_id = 'property_images'
);
