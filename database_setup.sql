-- Comprehensive profiles table
DROP TABLE IF EXISTS public.profiles;

CREATE TABLE public.profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    username TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure unique constraints are flexible
CREATE UNIQUE INDEX idx_unique_username ON public.profiles (username) 
WHERE username IS NOT NULL;

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc'::text, now());
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Comprehensive user creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    generated_username TEXT;
    generated_avatar_url TEXT;
BEGIN
    -- Generate a unique username
    generated_username := LOWER(
        COALESCE(
            NEW.raw_user_meta_data->>'username', 
            REGEXP_REPLACE(NEW.email, '@.*', ''),
            'user_' || SUBSTRING(MD5(NEW.id::TEXT), 1, 8)
        )
    );

    -- Ensure username is unique by appending a number if needed
    LOOP
        BEGIN
            -- Generate avatar URL
            generated_avatar_url := COALESCE(
                NEW.raw_user_meta_data->>'avatar_url',
                'https://ui-avatars.com/api/?name=' || 
                COALESCE(
                    REPLACE(NEW.raw_user_meta_data->>'full_name', ' ', '+'),
                    REPLACE(NEW.email, '@', '+')
                )
            );

            -- Insert profile
            INSERT INTO public.profiles (
                user_id, 
                email, 
                full_name, 
                username, 
                avatar_url
            ) VALUES (
                NEW.id,
                NEW.email,
                COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
                generated_username,
                generated_avatar_url
            );
            
            EXIT;
        EXCEPTION WHEN unique_violation THEN
            -- If username exists, modify it
            generated_username := generated_username || '_' || 
                SUBSTRING(MD5(NEW.id::TEXT), 1, 4);
        END;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
