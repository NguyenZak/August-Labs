-- Cấp quyền đọc công khai cho bảng settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.settings;
DROP POLICY IF EXISTS "Allow public read access on settings" ON public.settings;

CREATE POLICY "Enable read access for all users" ON public.settings
FOR SELECT USING (true);
