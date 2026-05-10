-- Copy and paste this into the SQL Editor in your Supabase Dashboard

-- 1. Create the projects table
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_vi TEXT NOT NULL,
    image_url TEXT NOT NULL,
    bg_color TEXT DEFAULT 'bg-gray-50',
    stat_highlight TEXT,
    challenge_en TEXT,
    challenge_vi TEXT,
    strategy_en TEXT,
    strategy_vi TEXT,
    stat1_val TEXT,
    stat1_label_en TEXT,
    stat1_label_vi TEXT,
    stat2_val TEXT,
    stat2_label_en TEXT,
    stat2_label_vi TEXT,
    stat3_val TEXT,
    stat3_label_en TEXT,
    stat3_label_vi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insert 10 premium dummy projects
INSERT INTO public.projects (client, slug, category, title_en, title_vi, image_url, bg_color, stat_highlight)
VALUES
('Miyako Sushi', 'miyako-sushi', 'Restaurant Chains', 'Increase 240% booking revenue with O2O Strategy', 'Tăng 240% doanh thu booking với O2O Strategy', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop', 'bg-blue-50', '+240%'),
('The Coffee House', 'the-coffee-house', 'Cafe & Bakery', 'Brand Repositioning for Gen Z audience', 'Tái định vị thương hiệu cho đối tượng Gen Z', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop', 'bg-amber-50', '2.5M Reach'),
('GrabFood', 'grab-food', 'App & Tech', 'Growth Strategy for Merchant Ecosystem', 'Chiến lược tăng trưởng cho hệ sinh thái đối tác', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2028&auto=format&fit=crop', 'bg-green-50', '+180% Growth'),
('Morico Vietnam', 'morico-vietnam', 'Fine Dining', 'Social Media Management & Creative Production', 'Quản trị mạng xã hội & Sản xuất nội dung sáng tạo', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop', 'bg-orange-50', '+50k Followers'),
('Katinat', 'katinat-coffee', 'Cafe & Bakery', 'Viral Campaign for Seasonal Product Launch', 'Chiến dịch Viral ra mắt sản phẩm theo mùa', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop', 'bg-pink-50', 'Top 1 Trending'),
('Uniqlo', 'uniqlo-vn', 'App & Tech', 'Omnichannel UX/UI Design for E-commerce App', 'Thiết kế UX/UI đa kênh cho ứng dụng thương mại điện tử', 'https://images.unsplash.com/photo-1534452285544-21950d87a7b8?q=80&w=2070&auto=format&fit=crop', 'bg-gray-50', '1M+ Downloads'),
('Pizza 4P''s', 'pizza-4ps', 'App & Tech', 'Cross-platform CRM & Loyalty System Development', 'Phát triển hệ thống CRM & Loyalty đa nền tảng', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop', 'bg-blue-50', '1.2M Users'),
('Haidilao Hotpot', 'haidilao-vn', 'Restaurant Chains', 'Multi-channel Performance Ads boosting foot traffic', 'Quảng cáo Performance đa kênh tăng lượng khách đến quán', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop', 'bg-red-50', '-35% CAC'),
('Godmother Bakehouse', 'godmother-bakehouse', 'Fine Dining', 'Premium Brand Identity & Visual Storytelling', 'Nhận diện thương hiệu cao cấp & Kể chuyện bằng hình ảnh', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop', 'bg-amber-50', 'Award Winning'),
('VinFast Global', 'vinfast-global', 'App & Tech', 'Strategic Marketing for International Market Entry', 'Marketing chiến lược cho việc thâm nhập thị trường quốc tế', 'https://images.unsplash.com/photo-1617788130012-02ba717bc512?q=80&w=2070&auto=format&fit=crop', 'bg-gray-50', 'Global Launch');

-- 3. Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Anyone can view projects
CREATE POLICY "Enable read access for all users" ON public.projects
    FOR SELECT USING (true);

-- Only authenticated users can insert, update, delete
CREATE POLICY "Enable insert for authenticated users only" ON public.projects
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON public.projects
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON public.projects
    FOR DELETE TO authenticated USING (true);
