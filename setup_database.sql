-- Copy and paste this into the SQL Editor in your Supabase Dashboard

-- 1. Create the leads table
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    brand TEXT,
    service TEXT,
    budget TEXT,
    message TEXT,
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
-- This is critical to ensure data is secure.
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies
-- Allow ANYONE (anon) to INSERT a new lead (from the public Contact page)
CREATE POLICY "Enable insert for anonymous users" ON public.leads
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Allow ONLY AUTHENTICATED users (Admins in CMS) to SELECT and UPDATE leads
CREATE POLICY "Enable read access for authenticated users only" ON public.leads
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable update for authenticated users only" ON public.leads
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow ONLY AUTHENTICATED users to DELETE leads (optional)
CREATE POLICY "Enable delete for authenticated users only" ON public.leads
    FOR DELETE
    TO authenticated
    USING (true);

-- 4. Insert some Dummy Sample Data
INSERT INTO public.leads (name, email, brand, service, budget, message, status, created_at)
VALUES 
('Zak Nguyen', 'zak@viz.vn', 'ViZ Solutions', 'Tech & O2O Booking App', '$10,000+', 'We need to revamp our internal ERP and connect it with a new ordering app for our chains.', 'new', now() - interval '2 hours'),
('Linh Tran', 'linh.tran@miyako.com', 'Miyako Sushi', 'Performance Marketing', '$5,000 - $10,000', 'Looking to increase our weekend bookings and promote our new Omakase set.', 'contacted', now() - interval '1 day'),
('Hoang Pham', 'h.pham@brewcoffee.vn', 'Brew Coffee Roasters', 'Brand Strategy & Identity', '$2,000 - $5,000', 'We are opening 3 new branches and need a cohesive brand identity refresh before the launch.', 'closed', now() - interval '3 days'),
('Anna Lee', 'anna@thevintage.com', 'The Vintage Lounge', 'Social Media & Content', 'Under $2,000', 'Need help managing our Instagram and creating viral TikTok content for our weekly events.', 'new', now() - interval '5 hours');

