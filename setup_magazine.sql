-- Create posts table for Magazine
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title_en TEXT NOT NULL,
    title_vi TEXT NOT NULL,
    excerpt_en TEXT,
    excerpt_vi TEXT,
    content_en TEXT,
    content_vi TEXT,
    image_url TEXT,
    category TEXT DEFAULT 'Strategy',
    author TEXT DEFAULT 'August Team',
    status TEXT DEFAULT 'draft', -- draft, published
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can read published posts" ON posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can do everything on posts" ON posts
    FOR ALL USING (auth.role() = 'authenticated');
