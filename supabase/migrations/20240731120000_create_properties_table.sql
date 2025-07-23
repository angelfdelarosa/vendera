-- Create the public.properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  realtor_id UUID REFERENCES public.profiles(id),
  title TEXT,
  price NUMERIC,
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

-- Policies for properties table
DROP POLICY IF EXISTS "Individuals can create properties." ON public.properties;
CREATE POLICY "Individuals can create properties." ON public.properties FOR
    INSERT WITH CHECK (auth.uid() = realtor_id);

DROP POLICY IF EXISTS "Users can view all properties." ON public.properties;
CREATE POLICY "Users can view all properties." ON public.properties FOR
    SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own properties." ON public.properties;
CREATE POLICY "Users can update their own properties." ON public.properties FOR
    UPDATE USING (auth.uid() = realtor_id);

DROP POLICY IF EXISTS "Users can delete their own properties." ON public.properties;
CREATE POLICY "Users can delete their own properties." ON public.properties FOR
    DELETE USING (auth.uid() = realtor_id);
