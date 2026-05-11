-- Create analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    page_url TEXT NOT NULL,
    device_type TEXT,
    browser TEXT,
    os TEXT,
    referrer TEXT,
    user_agent TEXT,
    session_id TEXT -- Useful for counting unique visitors
);

-- Enable RLS
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public tracking)
CREATE POLICY "Allow public inserts for analytics" ON public.analytics
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view analytics (admin only usually, but for now authenticated)
CREATE POLICY "Allow authenticated users to view analytics" ON public.analytics
    FOR SELECT USING (auth.role() = 'authenticated');

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE analytics;
