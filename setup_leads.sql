-- Create leads table for contact form submissions
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    service TEXT,
    message TEXT,
    status TEXT DEFAULT 'new', -- new, contacting, closed, spam
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow public to insert leads (but not read or update)
CREATE POLICY "Allow public inserts to leads" ON leads FOR INSERT WITH CHECK (true);

-- Allow authenticated admins to manage leads
CREATE POLICY "Allow admins to manage leads" ON leads FOR ALL USING (auth.role() = 'authenticated');
