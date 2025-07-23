-- Create the public.properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  realtor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  location TEXT,
  address TEXT,
  type TEXT,
  bedrooms INT,
  bathrooms INT,
  area NUMERIC,
  description TEXT,
  features TEXT[],
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) for the properties table
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all properties
CREATE POLICY "Allow public read-only access to properties"
ON public.properties FOR SELECT
USING (true);

-- Allow authenticated users to insert new properties for themselves
CREATE POLICY "Allow authenticated users to insert properties"
ON public.properties FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = realtor_id);

-- Allow users to update their own properties
CREATE POLICY "Allow users to update their own properties"
ON public.properties FOR UPDATE
USING (auth.uid() = realtor_id)
WITH CHECK (auth.uid() = realtor_id);

-- Allow users to delete their own properties
CREATE POLICY "Allow users to delete their own properties"
ON public.properties FOR DELETE
USING (auth.uid() = realtor_id);
