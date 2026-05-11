"use client";

import { useState, useEffect } from "react";
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Plus, 
  Upload, 
  ChevronRight, 
  MoreVertical, 
  Trash2, 
  ExternalLink,
  Copy,
  Search,
  Grid,
  List as ListIcon,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { getMediaAssets, createFolder, uploadMediaAsset, deleteAsset } from "@/app/actions/media";
import { useToast } from "@/context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface Asset {
  id: string;
  name: string;
  url: string | null;
  type: string;
  parent_id: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

export default function MediaExplorer({ onSelect }: { onSelect?: (url: string) => void }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState<Asset | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Asset[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("name_asc");
  const [deleteConfirm, setDeleteConfirm] = useState<string[] | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchAssets();
  }, [currentFolder]);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const data = await getMediaAssets(currentFolder?.id || null);
      setAssets(data || []);
    } catch (error: any) {
      toast("Lỗi khi tải dữ liệu: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt("Nhập tên thư mục mới:");
    if (!name) return;

    try {
      await createFolder(name, currentFolder?.id || null);
      toast("Đã tạo thư mục thành công!", "success");
      fetchAssets();
    } catch (error: any) {
      toast("Lỗi khi tạo thư mục: " + error.message, "error");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const allFiles = Array.from(files);
    const validFiles = allFiles.filter(f => f.size <= MAX_SIZE);
    const tooLargeFiles = allFiles.filter(f => f.size > MAX_SIZE);

    if (tooLargeFiles.length > 0) {
      toast(`${tooLargeFiles.length} file vượt quá 10MB và đã bị loại bỏ.`, "error");
    }

    if (validFiles.length === 0) {
      setIsUploading(false);
      return;
    }

    const totalFiles = validFiles.length;
    setUploadProgress({ current: 0, total: totalFiles });
    toast(`Đang chuẩn bị tải lên ${totalFiles} file...`, "info");

    try {
      let completedCount = 0;
      const uploadPromises = validFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await uploadMediaAsset(formData, currentFolder?.id || null);
          completedCount++;
          setUploadProgress({ current: completedCount, total: totalFiles });
          return res;
        } catch (err) {
          completedCount++;
          setUploadProgress({ current: completedCount, total: totalFiles });
          throw err;
        }
      });

      const results = await Promise.allSettled(uploadPromises);
      const succeeded = results.filter(r => r.status === 'fulfilled').length;
      const failed = totalFiles - succeeded;

      if (failed === 0) {
        toast(`Đã tải lên toàn bộ ${succeeded} file thành công!`, "success");
      } else {
        toast(`Hoàn thành: ${succeeded} thành công, ${failed} thất bại.`, failed > 0 ? "warning" : "success");
      }
      
      fetchAssets();
      // Reset progress after a short delay
      setTimeout(() => setUploadProgress({ current: 0, total: 0 }), 2000);
    } catch (error: any) {
      toast("Lỗi hệ thống khi upload: " + error.message, "error");
      setUploadProgress({ current: 0, total: 0 });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      toast(`Đang xóa ${deleteConfirm.length} mục...`, "info");
      const deletePromises = deleteConfirm.map(id => deleteAsset(id));
      await Promise.all(deletePromises);
      
      toast("Đã xóa các mục đã chọn!", "success");
      fetchAssets();
      setDeleteConfirm(null);
      setSelectedIds([]);
    } catch (error: any) {
      toast("Lỗi khi xóa: " + error.message, "error");
    }
  };

  const toggleSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredAssets.length) {
      setSelectedIds([]);
    } else {
      if (filteredAssets.length > 10) {
        const confirmed = window.confirm(`Bạn có chắc chắn muốn chọn tất cả ${filteredAssets.length} mục không?`);
        if (!confirmed) return;
      }
      setSelectedIds(filteredAssets.map(a => a.id));
    }
  };

  const handleConfirmMultiSelect = () => {
    if (!onSelect) return;
    
    // Get URLs of all selected assets
    const selectedUrls = assets
      .filter(a => selectedIds.includes(a.id) && a.url)
      .map(a => a.url as string);
    
    if (selectedUrls.length > 0) {
      // If the caller expects multiple (we'll check this by calling it for each or passing array)
      // For now, let's assume we call onSelect for each to stay compatible with existing single-pick ImageUpload
      selectedUrls.forEach(url => onSelect(url));
      setSelectedIds([]);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast("Đã sao chép liên kết vào bộ nhớ tạm!", "success");
  };

  const enterFolder = (folder: Asset) => {
    setCurrentFolder(folder);
    setBreadcrumbs([...breadcrumbs, folder]);
  };

  const goBackTo = (index: number) => {
    if (index === -1) {
      setCurrentFolder(null);
      setBreadcrumbs([]);
    } else {
      const folder = breadcrumbs[index];
      setCurrentFolder(folder);
      setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    }
  };

  const sortedAssets = [...assets].sort((a, b) => {
    // Folders always first
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;

    switch (sortBy) {
      case "name_asc": return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      case "name_desc": return b.name.localeCompare(a.name, undefined, { numeric: true, sensitivity: 'base' });
      case "date_desc": return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "date_asc": return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "size_desc": return (b.size || 0) - (a.size || 0);
      case "size_asc": return (a.size || 0) - (b.size || 0);
      default: return 0;
    }
  });

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "---";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filteredAssets = sortedAssets.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
      {/* Header / Toolbar */}
      <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={selectAll}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm font-bold ${
              selectedIds.length === filteredAssets.length && filteredAssets.length > 0
                ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
              selectedIds.length === filteredAssets.length && filteredAssets.length > 0 ? 'bg-white border-white' : 'bg-transparent border-gray-300'
            }`}>
              {selectedIds.length === filteredAssets.length && filteredAssets.length > 0 && <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />}
            </div>
            {selectedIds.length === filteredAssets.length && filteredAssets.length > 0 ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </button>

          <div className="flex items-center bg-white rounded-xl border border-gray-200 px-3 py-2 shadow-sm">
            <Search className="text-gray-400 w-4 h-4 mr-2" />
            <input 
              placeholder="Tìm kiếm file..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-48" 
            />
          </div>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 outline-none shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
          >
            <option value="name_asc">Tên (A-Z)</option>
            <option value="name_desc">Tên (Z-A)</option>
            <option value="date_desc">Mới nhất</option>
            <option value="date_asc">Cũ nhất</option>
            <option value="size_desc">Lớn nhất</option>
            <option value="size_asc">Nhỏ nhất</option>
          </select>

          <div className="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
            <button 
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-pink-50 text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-pink-50 text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <button 
              type="button"
              onClick={() => setDeleteConfirm(selectedIds)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all border border-red-100"
            >
              <Trash2 size={18} />
              Xóa {selectedIds.length} mục
            </button>
          )}
          <button 
            type="button"
            onClick={handleCreateFolder}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
          >
            <Plus size={18} />
            Thư mục mới
          </button>
          <label className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pink-500 text-white font-bold text-sm hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/25 cursor-pointer active:scale-95">
            <Upload size={18} />
            Tải file lên
            <input type="file" multiple className="hidden" onChange={handleUpload} disabled={isUploading} />
          </label>
        </div>
      </div>

      {/* Breadcrumbs & Progress */}
      <div className="px-6 py-3 border-b border-gray-50 flex items-center justify-between gap-2 text-sm relative">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => goBackTo(-1)}
            className="text-gray-400 hover:text-pink-500 transition-colors font-medium"
          >
            Media Library
          </button>
          {breadcrumbs.map((folder, i) => (
            <div key={folder.id} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-gray-300" />
              <button 
                onClick={() => goBackTo(i)}
                className={`font-medium ${i === breadcrumbs.length - 1 ? 'text-gray-900' : 'text-gray-400 hover:text-pink-500'}`}
              >
                {folder.name}
              </button>
            </div>
          ))}
        </div>

        {uploadProgress.total > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-pink-500 animate-pulse">
              Đang tải: {uploadProgress.current} / {uploadProgress.total}
            </span>
            <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Explorer Content */}
      <div className="flex-1 p-6">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-pink-500" />
            <p className="font-medium">Đang tải dữ liệu...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Folder size={40} className="text-gray-200" />
            </div>
            <p className="font-medium">Thư mục này trống</p>
            <p className="text-xs">Hãy tải ảnh lên hoặc tạo thư mục mới</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <AnimatePresence>
              {filteredAssets.map((asset) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  layout
                  className="group relative"
                >
                  <div 
                    onClick={() => {
                      if (asset.type === 'folder') {
                        enterFolder(asset);
                      } else if (onSelect && asset.url) {
                        onSelect(asset.url);
                      } else {
                        toggleSelect(asset.id);
                      }
                    }}
                    className={`aspect-square rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center p-4 gap-2 relative ${
                      selectedIds.includes(asset.id)
                        ? 'border-pink-500 bg-pink-50/30 ring-2 ring-pink-500/20'
                        : asset.type === 'folder' 
                          ? 'bg-amber-50 border-amber-100 hover:bg-amber-100/50' 
                          : 'bg-white border-gray-100 hover:shadow-xl hover:border-pink-200'
                    }`}
                  >
                    {/* Checkbox */}
                    <div 
                      className={`absolute top-3 left-3 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        selectedIds.includes(asset.id) ? 'bg-pink-500 border-pink-500' : 'bg-white/80 border-gray-200'
                      }`}
                      onClick={(e) => toggleSelect(asset.id, e)}
                    >
                      {selectedIds.includes(asset.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>

                    {asset.type === 'folder' ? (
                      <Folder className="w-12 h-12 text-amber-400 fill-amber-400/20" />
                    ) : (
                      <div className="w-full h-full rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                        {asset.url ? (
                          <img src={asset.url} className="w-full h-full object-cover" alt={asset.name} />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-200" />
                        )}
                      </div>
                    )}
                    <span className="text-[11px] font-bold text-gray-700 text-center truncate w-full px-1">
                      {asset.name}
                    </span>
                  </div>

                  {/* Actions Menu (Floating) */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    {asset.type !== 'folder' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(asset.url || ""); }}
                        className="p-1.5 bg-white text-gray-500 rounded-lg shadow-lg hover:text-pink-500 border border-gray-100"
                        title="Copy Link"
                      >
                        <Copy size={12} />
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm([asset.id]); }}
                      className="p-1.5 bg-white text-gray-500 rounded-lg shadow-lg hover:text-red-500 border border-gray-100"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-1">
             <table className="w-full text-left">
                <thead className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <div 
                        onClick={selectAll}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                          selectedIds.length === filteredAssets.length && filteredAssets.length > 0 ? 'bg-pink-500 border-pink-500' : 'bg-white border-gray-200'
                        }`}
                      >
                        {selectedIds.length === filteredAssets.length && filteredAssets.length > 0 && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </th>
                    <th className="px-4 py-3">Tên file</th>
                    <th className="px-4 py-3">Loại</th>
                    <th className="px-4 py-3">Dung lượng</th>
                    <th className="px-4 py-3">Ngày tạo</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map(asset => (
                    <tr 
                      key={asset.id} 
                      className={`hover:bg-gray-50 transition-colors group ${selectedIds.includes(asset.id) ? 'bg-pink-50/30' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div 
                          onClick={() => toggleSelect(asset.id)}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all ${
                            selectedIds.includes(asset.id) ? 'bg-pink-500 border-pink-500' : 'bg-white border-gray-200'
                          }`}
                        >
                          {selectedIds.includes(asset.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => asset.type === 'folder' ? enterFolder(asset) : null}>
                          {asset.type === 'folder' ? <Folder className="text-amber-400" size={18} /> : <ImageIcon className="text-pink-400" size={18} />}
                          <span className="text-sm font-bold text-gray-700">{asset.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 capitalize">{asset.type}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 font-medium">
                        {formatSize(asset.size)}
                        {asset.width && asset.height && (
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {asset.width} x {asset.height} px
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(asset.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                           {asset.url && (
                             <button onClick={(e) => { e.stopPropagation(); copyToClipboard(asset.url || ""); }} className="p-2 text-gray-400 hover:text-pink-500"><Copy size={14} /></button>
                           )}
                           <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm([asset.id]); }} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        )}
      </div>

      {/* Floating Confirm Button for Multi-select Picker */}
      <AnimatePresence>
        {onSelect && selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <button 
              type="button"
              onClick={handleConfirmMultiSelect}
              className="flex items-center gap-2 px-8 py-4 bg-pink-500 text-white rounded-full font-bold shadow-2xl hover:bg-pink-600 transition-all transform hover:scale-105 active:scale-95 ring-4 ring-white"
            >
              Xác nhận chọn {selectedIds.length} mục
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog 
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Xóa mục đã chọn"
        message="Bạn có chắc chắn muốn xóa mục này không? Nếu là thư mục, tất cả nội dung bên trong cũng sẽ bị xóa."
        isDanger
      />
    </div>
  );
}
