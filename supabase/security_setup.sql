-- Security Setup for August Agency
-- This script updates roles, sets up admin_logs, and configures RLS policies.

-- 1. Extend Roles Enum
-- If you need to recreate the type, you might need to drop it first, 
-- but usually, we just add new values.
-- ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
-- ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';
-- ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'editor';
-- ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'user';

-- For a clean start in this script, let's use the requested lowercase roles
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('super_admin', 'admin', 'editor', 'user', 'guest');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Admin Logs Table
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    metadata JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on admin_logs
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Only super_admins and admins can view logs
CREATE POLICY "Admins can view logs" ON admin_logs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.role::text = 'admin' OR profiles.role::text = 'super_admin')
        )
    );

-- System can always insert logs (SECURITY DEFINER functions use this)
-- But we'll allow authenticated users to insert their own action logs if needed
CREATE POLICY "Authenticated users can insert logs" ON admin_logs
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 3. RLS for Profiles (Update existing)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles." ON profiles;

CREATE POLICY "Users can view own profile" ON profiles 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles 
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON profiles 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.role::text = 'admin' OR profiles.role::text = 'super_admin')
        )
    );

-- 4. RLS for Media Assets
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view media" ON media_assets
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload media" ON media_assets
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete media" ON media_assets
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.role::text = 'admin' OR profiles.role::text = 'super_admin')
        )
    );

-- 5. RLS for Leads/Contact Messages
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit leads" ON leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view leads" ON leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.role::text = 'admin' OR profiles.role::text = 'super_admin')
        )
    );

-- 6. RLS for CMS content (Posts, Projects)
-- Assuming tables: posts, projects
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published posts" ON posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Editors can manage posts" ON posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.role::text IN ('editor', 'admin', 'super_admin'))
        )
    );
