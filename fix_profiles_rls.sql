-- Fix infinite recursion in profiles table by using a SECURITY DEFINER function

-- 1. Drop the problematic policy
DROP POLICY IF EXISTS "Admins can manage all profiles." ON public.profiles;

-- 2. Create a function to check if the current user is an admin
-- We check JWT first to avoid querying the profiles table (prevents infinite recursion)
-- If not found in JWT, we fallback to a SECURITY DEFINER query on the profiles table.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  jwt_role text;
BEGIN
  -- 1. Check JWT claim (app_metadata -> role)
  jwt_role := current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'role';
  IF upper(jwt_role) IN ('ADMIN', 'SUPER_ADMIN') THEN
    RETURN true;
  END IF;

  -- 2. Fallback to querying the profiles table
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND upper(role::text) IN ('ADMIN', 'SUPER_ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Recreate the policy using the new function
CREATE POLICY "Admins can manage all profiles." ON public.profiles 
FOR ALL USING ( public.is_admin() );

-- 4. Ensure users can read their own profile so they can fetch their own role
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles
FOR SELECT USING ( auth.uid() = id );
