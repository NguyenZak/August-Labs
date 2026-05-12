-- Create redirects table
CREATE TABLE IF NOT EXISTS public.redirects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    from_path TEXT NOT NULL UNIQUE,
    to_url TEXT NOT NULL,
    status_code INTEGER DEFAULT 301, -- 301 (Permanent) or 302 (Temporary)
    is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage redirects
CREATE POLICY "Allow authenticated users to manage redirects" ON public.redirects
    FOR ALL USING (auth.role() = 'authenticated');

-- Allow public to view active redirects (needed for middleware)
CREATE POLICY "Allow public to view active redirects" ON public.redirects
    FOR SELECT USING (is_active = true);
