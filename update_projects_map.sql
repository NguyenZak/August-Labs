-- Add google_maps_embed to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS google_maps_embed TEXT;
