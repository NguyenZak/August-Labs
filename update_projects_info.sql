-- Add brand contact and operational info to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS opening_hours TEXT,
ADD COLUMN IF NOT EXISTS subdomain TEXT,
ADD COLUMN IF NOT EXISTS booking_url TEXT,
ADD COLUMN IF NOT EXISTS google_maps_embed TEXT,
ADD COLUMN IF NOT EXISTS menu_images JSONB DEFAULT '[]'::jsonb;
