-- Create the public.properties table
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    realtor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    price NUMERIC NOT NULL,
    location TEXT,
    address TEXT,
    type TEXT, -- e.g., 'house', 'apartment'
    bedrooms INT,
    bathrooms INT,
    area NUMERIC,
    description TEXT,
    features TEXT[],
    images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security for the properties table
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Policies for the properties table

-- 1. Users can view all properties
DROP POLICY IF EXISTS "Allow all users to view properties" ON public.properties;
CREATE POLICY "Allow all users to view properties"
ON public.properties
FOR SELECT
USING (true);

-- 2. Authenticated users can create their own properties
DROP POLICY IF EXISTS "Allow authenticated users to create properties" ON public.properties;
CREATE POLICY "Allow authenticated users to create properties"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = realtor_id);


-- 3. Users can update their own properties
DROP POLICY IF EXISTS "Allow users to update their own properties" ON public.properties;
CREATE POLICY "Allow users to update their own properties"
ON public.properties
FOR UPDATE
USING (auth.uid() = realtor_id);

-- 4. Users can delete their own properties
DROP POLICY IF EXISTS "Allow users to delete their own properties" ON public.properties;
CREATE POLICY "Allow users to delete their own properties"
ON public.properties
FOR DELETE
USING (auth.uid() = realtor_id);
