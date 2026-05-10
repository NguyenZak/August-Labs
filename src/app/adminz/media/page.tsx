import MediaExplorer from "@/components/admin/MediaExplorer";

export default function MediaLibraryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline text-gray-900 mb-2">Thư viện Media</h1>
        <p className="text-gray-500">Quản lý toàn bộ tài sản hình ảnh và file của August Agency.</p>
      </div>

      <MediaExplorer />
    </div>
  );
}
