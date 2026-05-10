-- Add missing columns to leads table to match the contact form
ALTER TABLE leads ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget TEXT;
