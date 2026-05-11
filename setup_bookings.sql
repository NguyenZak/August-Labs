-- Create bookings table for restaurant management
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    guests INTEGER DEFAULT 2,
    note TEXT,
    status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow public to insert bookings (for customers)
CREATE POLICY "Allow public inserts to bookings" ON bookings FOR INSERT WITH CHECK (true);

-- Allow authenticated admins to manage bookings
CREATE POLICY "Allow admins to manage bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');
