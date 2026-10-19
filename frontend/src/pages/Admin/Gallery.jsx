import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  X, 
  Loader2, 
  RefreshCw,
  Sparkles,
  Layers
} from 'lucide-react';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Showcase',
    order: 0,
    isActive: true,
    image: {
      url: '',
      publicId: '',
      alt: '',
    },
  });

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gallery/admin');
      setPhotos(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load gallery photos', err);
      toast.error('Failed to fetch gallery photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Handle File Upload to Cloudinary
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image size must be under 8MB');
      return;
    }

    const payload = new FormData();
    payload.append('image', file);
    setUploading(true);

    try {
      const res = await api.post('/upload', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData((prev) => ({
        ...prev,
        image: {
          url: res.data.data.url,
          publicId: res.data.data.publicId,
          alt: prev.title || file.name,
        },
      }));
      toast.success('Image uploaded to Cloudinary');
    } catch (err) {
      console.error('Upload error', err);
      toast.error('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      category: 'Showcase',
      order: photos.length + 1,
      isActive: true,
      image: {
        url: '',
        publicId: '',
        alt: '',
      },
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image.url) {
      toast.error('Please upload an image or provide an image URL');
      return;
    }

    setSaving(true);
    try {
      await api.post('/gallery', formData);
      toast.success('Photo added to gallery successfully');
      setShowModal(false);
      fetchPhotos();
    } catch (err) {
      console.error('Save error', err);
      toast.error(err.response?.data?.message || 'Failed to save gallery photo');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (photo) => {
    try {
      await api.put(`/gallery/${photo._id}`, {
        isActive: !photo.isActive,
      });
      setPhotos((prev) =>
        prev.map((p) => (p._id === photo._id ? { ...p, isActive: !p.isActive } : p))
      );
      toast.success(photo.isActive ? 'Photo hidden from home slider' : 'Photo activated on home slider');
    } catch (err) {
      console.error('Status update failed', err);
      toast.error('Failed to update photo status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title || 'this photo'}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/gallery/${id}`);
      setPhotos((prev) => prev.filter((p) => p._id !== id));
      toast.success('Photo removed from gallery');
    } catch (err) {
      console.error('Delete error', err);
      toast.error('Failed to delete photo');
    } finally {
      setDeletingId(null);
    }
  };

  const activeCount = photos.filter((p) => p.isActive).length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-brand-gray-border rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red" />
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-red">
                Home Slider Manager
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-brand-dark uppercase tracking-tight">
              Photo Gallery Management
            </h1>
            <p className="text-brand-gray text-xs sm:text-sm mt-1 max-w-2xl">
              Add, toggle, and delete images displayed in the home page single-frame slider. Photos slide automatically every 5 seconds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchPhotos}
              className="p-2.5 rounded-xl border border-brand-gray-border hover:bg-brand-gray-light text-brand-gray hover:text-brand-dark transition-all"
              title="Refresh photos"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-black text-xs sm:text-sm uppercase tracking-wider px-5 py-3 rounded-xl shadow-md hover:shadow-brand-red/30 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Photo</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-brand-gray-border">
          <div className="bg-brand-gray-light/60 rounded-xl p-3 sm:p-4 border border-brand-gray-border/70">
            <span className="text-[10px] sm:text-xs font-bold text-brand-gray-mid uppercase tracking-wider block">
              Total Gallery Photos
            </span>
            <span className="text-xl sm:text-2xl font-black text-brand-dark mt-0.5 block">
              {photos.length}
            </span>
          </div>

          <div className="bg-brand-gray-light/60 rounded-xl p-3 sm:p-4 border border-brand-gray-border/70">
            <span className="text-[10px] sm:text-xs font-bold text-brand-gray-mid uppercase tracking-wider block">
              Active in 5s Slider
            </span>
            <span className="text-xl sm:text-2xl font-black text-green-600 mt-0.5 block">
              {activeCount}
            </span>
          </div>

          <div className="bg-brand-gray-light/60 rounded-xl p-3 sm:p-4 border border-brand-gray-border/70 col-span-2 sm:col-span-1">
            <span className="text-[10px] sm:text-xs font-bold text-brand-gray-mid uppercase tracking-wider block">
              Slider Timing
            </span>
            <span className="text-xl sm:text-2xl font-black text-brand-red mt-0.5 block">
              5.0 Seconds
            </span>
          </div>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-4 border border-gray-200 animate-pulse h-80 flex flex-col justify-between">
              <div className="bg-gray-200 h-44 rounded-xl w-full" />
              <div className="space-y-2 mt-4">
                <div className="bg-gray-200 h-4 rounded w-3/4" />
                <div className="bg-gray-200 h-3 rounded w-1/2" />
              </div>
              <div className="bg-gray-200 h-8 rounded-lg mt-4 w-full" />
            </div>
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-brand-gray-border">
          <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-red">
            <ImageIcon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-black text-brand-dark uppercase tracking-wide mb-1">
            No Gallery Photos Yet
          </h3>
          <p className="text-brand-gray text-xs sm:text-sm max-w-md mx-auto mb-6">
            Upload high-resolution images of your electrical products, starters, and control setups to display in the Home single-frame slider.
          </p>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Upload First Photo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {photos.map((item, index) => {
            const imgUrl = item.image?.url || item.url;
            const isDeleting = deletingId === item._id;

            return (
              <div
                key={item._id || index}
                className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs hover:shadow-lg flex flex-col ${
                  item.isActive ? 'border-brand-gray-border hover:border-brand-red/40' : 'border-gray-200 opacity-60'
                }`}
              >
                {/* Photo Image Frame */}
                <div className="relative aspect-[16/10] w-full bg-neutral-900 overflow-hidden flex items-center justify-center">
                  <img
                    src={imgUrl}
                    alt={item.title || 'Gallery Item'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Order Badge (Top Left) */}
                  <div className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                    Slide #{item.order || index + 1}
                  </div>

                  {/* Category Pill (Top Right) */}
                  <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full bg-brand-red text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                    {item.category || 'Showcase'}
                  </div>
                </div>

                {/* Card Info Body */}
                <div className="p-4 sm:p-5 flex flex-col flex-grow">
                  <h3 className="font-extrabold text-sm sm:text-base text-brand-dark leading-snug line-clamp-2 mb-2">
                    {item.title || 'Untitled Photo'}
                  </h3>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    {/* Toggle Active / Hide Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        item.isActive
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={item.isActive ? 'Click to hide from slider' : 'Click to show in slider'}
                    >
                      {item.isActive ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>

                    {/* Delete Photo Button */}
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDelete(item._id, item.title)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-red hover:bg-brand-red/10 border border-brand-red/20 transition-all disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- ADD NEW PHOTO MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-brand-gray-border animate-fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-brand-gray-border flex items-center justify-between bg-brand-dark text-white">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-red" />
                <h3 className="font-black uppercase tracking-wider text-sm sm:text-base">
                  Add Photo to Gallery
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-brand-gray-mid hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-brand-dark mb-1.5">
                  Photo Image <span className="text-brand-red">*</span>
                </label>

                {formData.image.url ? (
                  <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-neutral-900 border border-brand-gray-border group">
                    <img
                      src={formData.image.url}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          image: { url: '', publicId: '', alt: '' },
                        }))
                      }
                      className="absolute top-2.5 right-2.5 p-1.5 bg-black/75 hover:bg-brand-red text-white rounded-lg transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 hover:border-brand-red bg-gray-50/50 hover:bg-brand-red/5 p-6 cursor-pointer transition-all">
                    {uploading ? (
                      <div className="flex flex-col items-center justify-center py-4 text-brand-red">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-xs font-bold">Uploading to Cloudinary...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center mb-2">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-0.5">
                          Click to upload photo
                        </span>
                        <span className="text-[11px] text-brand-gray">
                          PNG, JPG, or WebP up to 8MB
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Optional direct URL input */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-brand-gray-mid">Or URL:</span>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image.url}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        image: { ...prev.image, url: e.target.value },
                      }))
                    }
                    className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-brand-dark mb-1">
                  Photo Title / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Heavy Duty Submersible Starter Panel"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-red"
                />
              </div>

              {/* Category & Order Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-brand-dark mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Starters, Stabilizers"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-brand-dark mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full text-xs sm:text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-brand-red rounded cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-brand-dark cursor-pointer select-none">
                  Display this photo in the home 5-second slider
                </label>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold uppercase tracking-wider text-brand-gray hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-brand-red/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Add to Gallery</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
