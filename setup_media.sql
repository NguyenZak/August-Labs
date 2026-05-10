CREATE TABLE IF NOT EXISTS media_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT, -- NULL for folders
    type TEXT NOT NULL, -- 'image', 'file', 'folder'
    parent_id UUID REFERENCES media_assets(id) ON DELETE CASCADE,
    folder_path TEXT DEFAULT '/', -- For easier querying
    size BIGINT,
    mime_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster navigation
CREATE INDEX IF NOT EXISTS idx_media_parent ON media_assets(parent_id);
