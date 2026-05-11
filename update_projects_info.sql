-- Add brand contact and operational info to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS opening_hours TEXT;
