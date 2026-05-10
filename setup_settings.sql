-- Create settings table for global agency configuration
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated admins to manage settings
CREATE POLICY "Allow admins to manage settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Initial seeding (if not exists)
INSERT INTO settings (key, value) VALUES 
('general', '{"agency_name": "August Agency", "email": "hello@augustagency.com", "phone": "090 123 4567", "address": "Ho Chi Minh City, Vietnam"}'),
('social', '{"facebook": "", "instagram": "", "linkedin": "", "youtube": ""}'),
('seo', '{"meta_title": "August Agency | F&B Marketing Specialists", "meta_description": "We craft premium digital experiences for luxury F&B brands."}')
ON CONFLICT (key) DO NOTHING;
