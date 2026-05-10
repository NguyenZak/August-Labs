-- Copy and paste this into the SQL Editor in your Supabase Dashboard

CREATE TABLE public.hero_content (
    id INT PRIMARY KEY DEFAULT 1,
    tag_en TEXT,
    tag_vi TEXT,
    title1_en TEXT,
    title1_vi TEXT,
    title2_en TEXT,
    title2_vi TEXT,
    desc_en TEXT,
    desc_vi TEXT,
    image_url TEXT,
    bookings_text TEXT,
    growth_percent TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert default row
INSERT INTO public.hero_content (
    id, tag_en, tag_vi, title1_en, title1_vi, title2_en, title2_vi, desc_en, desc_vi, image_url, bookings_text, growth_percent
) VALUES (
    1, 
    'F&B Marketing & Tech', 'F&B Marketing & Tech',
    'We build F&B brands that', 'Chúng tôi xây dựng thương hiệu',
    'dominate the market.', 'thống trị thị trường.',
    'August Agency is a premium creative powerhouse elevating F&B brands through cutting-edge design, strategic marketing, and state-of-the-art booking technology.',
    'August Agency là tổ hợp sáng tạo cao cấp giúp nâng tầm các thương hiệu F&B thông qua thiết kế đột phá, tiếp thị chiến lược và công nghệ đặt bàn tiên tiến.',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop',
    'Miyako Sushi',
    '+128.5%'
) ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Enable read access for all users" ON public.hero_content
    FOR SELECT USING (true);

-- Allow authenticated users (Admins) to update
CREATE POLICY "Enable update for authenticated users only" ON public.hero_content
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
