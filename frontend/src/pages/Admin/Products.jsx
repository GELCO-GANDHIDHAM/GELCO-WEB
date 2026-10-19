import { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { 
  Edit, 
  Trash2, 
  Plus, 
  X, 
  Upload, 
  Search, 
  Eye, 
  EyeOff, 
  Star, 
  Layers, 
  FileText, 
  SlidersHorizontal,
  Package,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
  name: '',
  model: '',
  category: '',
  shortDescription: '',
  description: '',
  displayOrder: 0,
  isActive: true,
  images: [],
  features: [''],
  specifications: [{ key: '', value: '' }]
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'images', 'specs'
  const [formData, setFormData] = useState(INITIAL_FORM);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/admin/products?limit=200'),
        api.get('/admin/categories')
      ]);
      setProducts(prodRes.data?.data || []);
      setCategories(catRes.data?.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch catalog data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Products computation
  const filteredProducts = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    const words = trimmed.split(/\s+/).filter(Boolean);

    return products.filter((prod) => {
      let matchesSearch = true;
      if (words.length > 0) {
        const catName = (typeof prod.category === 'object' ? prod.category?.name : '')?.toLowerCase() || '';
        const name = (prod.name || '').toLowerCase();
        const model = (prod.model || '').toLowerCase();
        const desc = (prod.shortDescription || '').toLowerCase();
        const combined = `${name} ${model} ${catName} ${desc}`;

        matchesSearch = words.every((w) => combined.includes(w));
      }

      const prodCatId = prod.category?._id || prod.category;
      const matchesCat = selectedCatFilter ? prodCatId === selectedCatFilter : true;

      const matchesStatus = 
        statusFilter === 'all' 
          ? true 
          : statusFilter === 'active' 
          ? prod.isActive 
          : !prod.isActive;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, searchQuery, selectedCatFilter, statusFilter]);

  // Open Form for Adding New Product
  const handleAddNew = () => {
    setFormData({
      ...INITIAL_FORM,
      category: categories.length > 0 ? categories[0]._id : '',
      features: [''],
      specifications: [{ key: '', value: '' }],
      images: []
    });
    setEditId(null);
    setActiveTab('general');
    setShowForm(true);
  };

  // Open Form for Editing Existing Product
  const handleEdit = (prod) => {
    setFormData({
      name: prod.name || '',
      model: prod.model || '',
      category: prod.category?._id || prod.category || '',
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      displayOrder: prod.displayOrder ?? 0,
      isActive: prod.isActive ?? true,
      images: Array.isArray(prod.images) ? [...prod.images] : [],
      features: Array.isArray(prod.features) && prod.features.length > 0 ? [...prod.features] : [''],
      specifications: Array.isArray(prod.specifications) && prod.specifications.length > 0 
        ? prod.specifications.map(s => ({ key: s.key, value: s.value })) 
        : [{ key: '', value: '' }]
    });
    setEditId(prod._id);
    setActiveTab('general');
    setShowForm(true);
  };

  // Delete product with confirmation
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name || 'this product'}"?`)) {
      return;
    }
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Product removed successfully');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting product');
    }
  };

  // Quick toggle active / hidden status directly in table row
  const handleToggleStatus = async (prod) => {
    const updatedStatus = !prod.isActive;
    // Optimistic UI update
    setProducts(prev => prev.map(p => p._id === prod._id ? { ...p, isActive: updatedStatus } : p));
    try {
      await api.put(`/admin/products/${prod._id}`, { isActive: updatedStatus });
      toast.success(`Product ${updatedStatus ? 'activated' : 'hidden'}`);
    } catch (err) {
      // Revert on failure
      setProducts(prev => prev.map(p => p._id === prod._id ? { ...p, isActive: prod.isActive } : p));
      toast.error('Failed to update product status');
    }
  };

  // Image Upload directly to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    const uploadPayload = new FormData();
    uploadPayload.append('image', file);
    setUploadingImg(true);

    try {
      const res = await api.post('/upload', uploadPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newImage = {
        url: res.data.data.url,
        publicId: res.data.data.publicId,
        alt: formData.name || 'Gelco Product'
      };

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
      toast.success('Image uploaded to Cloudinary');
    } catch (err) {
      console.error('Image upload error:', err);
      toast.error(err.response?.data?.message || 'Image upload failed. Check Cloudinary settings.');
    } finally {
      setUploadingImg(false);
      e.target.value = '';
    }
  };

  // Remove image from formData & Cloudinary
  const handleRemoveImage = async (indexToRemove) => {
    const targetImage = formData.images[indexToRemove];
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));

    if (targetImage?.publicId) {
      try {
        await api.delete('/upload', { params: { publicId: targetImage.publicId } });
      } catch (err) {
        console.warn('Cloudinary delete notice:', err);
      }
    }
  };

  // Set image as main thumbnail (move to position 0)
  const handleSetPrimaryImage = (index) => {
    if (index === 0) return;
    const imagesCopy = [...formData.images];
    const [selected] = imagesCopy.splice(index, 1);
    imagesCopy.unshift(selected);
    setFormData(prev => ({ ...prev, images: imagesCopy }));
    toast.success('Primary thumbnail updated');
  };

  // Feature Bullet Handlers
  const handleFeatureChange = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData(prev => ({ ...prev, features: updated }));
  };

  const handleAddFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Specification Row Handlers
  const handleSpecChange = (index, field, value) => {
    const updated = [...formData.specifications];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, specifications: updated }));
  };

  const handleAddSpec = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const handleRemoveSpec = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  // Submit Product Form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Product name is required.');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category.');
      return;
    }

    // Clean features and specifications
    const cleanFeatures = formData.features.map(f => f.trim()).filter(Boolean);
    const cleanSpecs = formData.specifications
      .map(s => ({ key: s.key.trim(), value: s.value.trim() }))
      .filter(s => s.key && s.value);

    const payload = {
      ...formData,
      features: cleanFeatures,
      specifications: cleanSpecs
    };

    setSubmitting(true);
    try {
      if (editId) {
        const res = await api.put(`/admin/products/${editId}`, payload);
        toast.success('Product updated successfully!');
        setProducts(prev => prev.map(p => p._id === editId ? res.data.data : p));
      } else {
        const res = await api.post('/admin/products', payload);
        toast.success('Product created successfully!');
        setProducts(prev => [res.data.data, ...prev]);
      }
      setShowForm(false);
      setEditId(null);
      setFormData(INITIAL_FORM);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  // Stats calculation
  const totalCount = products.length;
  const activeCount = products.filter(p => p.isActive).length;
  const hiddenCount = totalCount - activeCount;

  return (
    <div className="space-y-8">
      {/* --- TOP HEADER & STATS --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark uppercase tracking-tight flex items-center gap-3">
            <Package className="h-8 w-8 text-brand-red" />
            Manage Products
          </h1>
          <p className="text-sm text-brand-gray-mid mt-1">
            Create, edit, organize, and upload images to Cloudinary for your product catalog.
          </p>
        </div>

        {!showForm && (
          <button
            onClick={handleAddNew}
            className="inline-flex items-center justify-center gap-2 bg-brand-red text-white px-5 py-3 rounded-xl font-bold uppercase text-xs tracking-wider shadow-lg shadow-brand-red/20 hover:bg-brand-red-dark transition-all transform active:scale-95"
          >
            <Plus className="h-4 w-4" /> Add New Product
          </button>
        )}
      </div>

      {/* --- STATS COUNTERS --- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-brand-gray-border shadow-sm">
          <span className="text-[0.7rem] font-black uppercase tracking-wider text-brand-gray-mid">Total Products</span>
          <div className="text-2xl font-black text-brand-dark mt-1">{totalCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-brand-gray-border shadow-sm">
          <span className="text-[0.7rem] font-black uppercase tracking-wider text-green-600">Active / Live</span>
          <div className="text-2xl font-black text-green-700 mt-1">{activeCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-brand-gray-border shadow-sm">
          <span className="text-[0.7rem] font-black uppercase tracking-wider text-amber-600">Hidden / Draft</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{hiddenCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-brand-gray-border shadow-sm">
          <span className="text-[0.7rem] font-black uppercase tracking-wider text-brand-gray-mid">Categories</span>
          <div className="text-2xl font-black text-brand-dark mt-1">{categories.length}</div>
        </div>
      </div>

      {/* --- ADD / EDIT PRODUCT FORM DRAWER --- */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl border border-brand-gray-border overflow-hidden animate-fadeIn">
          {/* Form Header */}
          <div className="bg-brand-dark px-6 py-4 flex items-center justify-between text-white border-b border-brand-gray/30">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red"></span>
              <h2 className="text-lg font-black uppercase tracking-wider">
                {editId ? 'Edit Product Details' : 'Create New Product'}
              </h2>
            </div>
            <button
              onClick={() => { setShowForm(false); setEditId(null); }}
              className="text-brand-gray-mid hover:text-white p-1 rounded-lg transition-colors"
              title="Close Form"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form Tab Navigation */}
          <div className="flex border-b border-brand-gray-border bg-brand-gray-light/60 px-6 gap-2 pt-3">
            <button
              type="button"
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'general'
                  ? 'border-brand-red text-brand-red bg-white rounded-t-lg'
                  : 'border-transparent text-brand-gray-mid hover:text-brand-dark'
              }`}
            >
              <FileText className="h-4 w-4" /> 1. General & Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('images')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'images'
                  ? 'border-brand-red text-brand-red bg-white rounded-t-lg'
                  : 'border-transparent text-brand-gray-mid hover:text-brand-dark'
              }`}
            >
              <Upload className="h-4 w-4" /> 2. Cloudinary Images ({formData.images.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'specs'
                  ? 'border-brand-red text-brand-red bg-white rounded-t-lg'
                  : 'border-transparent text-brand-gray-mid hover:text-brand-dark'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" /> 3. Features & Specifications
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* TAB 1: GENERAL & INFO */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1.5">
                      Product Name <span className="text-brand-red">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Earth Leakage Circuit Breaker"
                      className="w-full border border-brand-gray-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-red font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1.5">
                      Model Number
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={e => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g. GL-701 / 63A"
                      className="w-full border border-brand-gray-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-red font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1.5">
                      Product Category <span className="text-brand-red">*</span>
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-brand-gray-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-red bg-white font-medium"
                    >
                      <option value="">Select a Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1.5">
                      Display Priority Order
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={e => setFormData({ ...formData, displayOrder: e.target.value })}
                      className="w-full border border-brand-gray-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-red font-medium"
                      placeholder="0 (Lower shows first)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1.5">
                    Short Description (Product Card Tagline)
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief 1-2 sentence overview shown in catalog cards"
                    className="w-full border border-brand-gray-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-dark uppercase tracking-wide mb-1.5">
                    Full Product Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed explanation, operational context, and safety benefits..."
                    className="w-full border border-brand-gray-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div className="pt-2 border-t border-brand-gray-border">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-5 h-5 accent-brand-red rounded cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wide text-brand-dark block">
                        Visible to Public (Active)
                      </span>
                      <span className="text-[0.75rem] text-brand-gray-mid">
                        When unchecked, the product is hidden from visitors and catalog pages.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* TAB 2: CLOUDINARY IMAGES */}
            {activeTab === 'images' && (
              <div className="space-y-6">
                <div className="bg-brand-gray-light/60 p-6 rounded-xl border border-brand-gray-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide text-brand-dark">
                        Cloudinary Image Uploader
                      </h3>
                      <p className="text-xs text-brand-gray-mid mt-0.5">
                        Uploaded images are securely stored on Cloudinary with automatic optimization.
                      </p>
                    </div>

                    <label className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-wider cursor-pointer transition-all ${
                      uploadingImg 
                        ? 'bg-brand-gray text-white cursor-not-allowed' 
                        : 'bg-brand-dark text-white hover:bg-black shadow-md'
                    }`}>
                      <Upload className="h-4 w-4" />
                      {uploadingImg ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImg}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploadingImg && (
                    <div className="flex items-center gap-3 p-3 bg-red-50 border border-brand-red/30 rounded-lg text-brand-red text-xs font-bold animate-pulse mb-4">
                      <LoadingSpinner />
                      <span>Optimizing and uploading image to Cloudinary...</span>
                    </div>
                  )}

                  {/* Image Thumbnails Gallery */}
                  {formData.images.length === 0 ? (
                    <div className="border-2 border-dashed border-brand-gray-border rounded-xl p-8 text-center bg-white">
                      <Upload className="h-10 w-10 text-brand-gray-mid mx-auto mb-2 opacity-50" />
                      <p className="text-xs font-bold uppercase tracking-wider text-brand-dark">No Images Added Yet</p>
                      <p className="text-xs text-brand-gray-mid mt-1">Upload product photos, diagrams, or technical schematics.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`group relative bg-white border rounded-xl overflow-hidden shadow-sm p-2 flex flex-col ${
                            idx === 0 ? 'border-brand-red ring-2 ring-brand-red/20' : 'border-brand-gray-border'
                          }`}
                        >
                          <div className="h-32 w-full flex items-center justify-center bg-brand-gray-light/40 rounded-lg overflow-hidden relative">
                            <img
                              src={img.url}
                              alt={img.alt || `Product image ${idx + 1}`}
                              className="max-w-full max-h-full object-contain p-1 group-hover:scale-105 transition-transform"
                            />
                            {idx === 0 && (
                              <span className="absolute top-2 left-2 bg-brand-red text-white text-[0.65rem] font-black uppercase px-2 py-0.5 rounded-full shadow">
                                Primary
                              </span>
                            )}
                          </div>

                          <div className="mt-2 pt-2 border-t border-brand-gray-border/60 flex items-center justify-between text-xs">
                            {idx !== 0 ? (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(idx)}
                                className="text-brand-gray hover:text-brand-red font-bold text-[0.7rem] flex items-center gap-1"
                                title="Make this image the main thumbnail"
                              >
                                <Star className="h-3 w-3" /> Make Primary
                              </button>
                            ) : (
                              <span className="text-[0.7rem] font-bold text-green-700 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" /> Main Thumbnail
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                              title="Delete this image"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-[0.7rem] text-brand-gray-mid mt-3">
                    💡 The first image in the list is automatically used as the main thumbnail in catalogs.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: FEATURES & SPECS */}
            {activeTab === 'specs' && (
              <div className="space-y-8">
                {/* Key Features Bullet List */}
                <div className="bg-brand-gray-light/40 p-6 rounded-xl border border-brand-gray-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide text-brand-dark">
                        Key Features Bullet Points
                      </h3>
                      <p className="text-xs text-brand-gray-mid mt-0.5">
                        Highlighted bullet points displayed on the product details page.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-red hover:text-brand-red-dark"
                    >
                      <Plus className="h-4 w-4" /> Add Feature
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-gray-mid w-6 text-center">{idx + 1}.</span>
                        <input
                          type="text"
                          value={feature}
                          onChange={e => handleFeatureChange(idx, e.target.value)}
                          placeholder="e.g. Microprocessor controlled fast tripping mechanism"
                          className="flex-1 border border-brand-gray-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          disabled={formData.features.length === 1}
                          className="text-brand-gray-mid hover:text-brand-red p-2 disabled:opacity-30"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Specifications Key-Value Table */}
                <div className="bg-brand-gray-light/40 p-6 rounded-xl border border-brand-gray-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wide text-brand-dark">
                        Technical Specifications (Key - Value)
                      </h3>
                      <p className="text-xs text-brand-gray-mid mt-0.5">
                        Electrical, voltage, mechanical, and protection specifications table.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSpec}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-red hover:text-brand-red-dark"
                    >
                      <Plus className="h-4 w-4" /> Add Specification Row
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.specifications.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={spec.key}
                          onChange={e => handleSpecChange(idx, 'key', e.target.value)}
                          placeholder="Parameter (e.g. Operating Voltage)"
                          className="w-1/2 border border-brand-gray-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red bg-white font-medium"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                          placeholder="Value (e.g. 240V / 415V AC, 50Hz)"
                          className="w-1/2 border border-brand-gray-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSpec(idx)}
                          disabled={formData.specifications.length === 1}
                          className="text-brand-gray-mid hover:text-brand-red p-2 disabled:opacity-30"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Form Footer Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-brand-gray-border">
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditId(null); }}
                className="px-5 py-2.5 rounded-lg border border-brand-gray-border text-xs font-bold uppercase tracking-wider text-brand-gray hover:bg-brand-gray-light"
              >
                Cancel
              </button>

              <div className="flex items-center gap-3">
                {activeTab !== 'specs' ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab(activeTab === 'general' ? 'images' : 'specs')}
                    className="px-5 py-2.5 rounded-lg bg-brand-gray-light text-brand-dark text-xs font-bold uppercase tracking-wider hover:bg-brand-gray-border/60"
                  >
                    Next Step →
                  </button>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting || uploadingImg}
                  className="px-8 py-2.5 rounded-lg bg-brand-red text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-red/20 hover:bg-brand-red-dark disabled:bg-brand-gray transition-all"
                >
                  {submitting ? 'Saving Product...' : editId ? 'Update Product' : 'Save & Publish Product'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* --- FILTER & SEARCH BAR --- */}
      <div className="bg-white p-4 rounded-xl border border-brand-gray-border shadow-sm flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gray-mid" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products by title, model number..."
            className="w-full pl-10 pr-4 py-2 border border-brand-gray-border rounded-lg text-sm focus:outline-none focus:border-brand-red"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-mid hover:text-brand-dark"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-56">
          <select
            value={selectedCatFilter}
            onChange={e => setSelectedCatFilter(e.target.value)}
            className="w-full border border-brand-gray-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red bg-white"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-40">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full border border-brand-gray-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="hidden">Hidden Only</option>
          </select>
        </div>

        {(searchQuery || selectedCatFilter || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCatFilter('');
              setStatusFilter('all');
            }}
            className="text-xs font-bold text-brand-red hover:underline whitespace-nowrap px-2"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* --- PRODUCTS TABLE & LIST --- */}
      {loading ? (
        <LoadingSpinner text="Loading catalog from MongoDB..." />
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-gray-border p-12 text-center shadow-sm">
          <Package className="h-16 w-16 text-brand-gray-mid mx-auto mb-4 opacity-40" />
          <h3 className="text-lg font-black uppercase tracking-wide text-brand-dark">No Products Found</h3>
          <p className="text-sm text-brand-gray-mid max-w-md mx-auto mt-1 mb-6">
            {searchQuery || selectedCatFilter || statusFilter !== 'all'
              ? 'No products matched your search or filter criteria. Try resetting filters.'
              : 'Your product catalog is currently empty. Start adding your electrical items!'}
          </p>
          {!showForm && (
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl font-bold uppercase text-xs tracking-wider shadow-md hover:bg-brand-red-dark"
            >
              <Plus className="h-4 w-4" /> Add Your First Product
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-gray-border overflow-hidden">
          {/* --- MOBILE VIEW: SINGLE FRAME CARDS (NO SIDEWAYS SCROLL) --- */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredProducts.map((prod) => {
              const hasImage = prod.images && prod.images.length > 0;
              const thumbUrl = hasImage ? prod.images[0].url : null;
              const categoryName = prod.category?.name || 'Uncategorized';

              return (
                <div key={prod._id} className="p-3.5 flex gap-3.5 items-center bg-white hover:bg-brand-gray-light/30 transition-colors">
                  {/* Bigger Image Thumbnail */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-brand-gray-border bg-white flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0 relative shadow-2xs">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={prod.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center opacity-30 text-[0.65rem] font-bold">
                        <Package className="h-6 w-6" />
                        <span>No Image</span>
                      </div>
                    )}
                    {hasImage && prod.images.length > 1 && (
                      <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] px-1.5 py-0.2 rounded font-bold shadow-xs">
                        +{prod.images.length - 1}
                      </span>
                    )}
                  </div>

                  {/* Name, Model & Action Buttons in Single Frame */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red block truncate mb-0.5">
                        {categoryName}
                      </span>
                      <h3 className="font-extrabold text-sm text-brand-dark leading-snug line-clamp-2">
                        {prod.name}
                      </h3>
                      {prod.model && (
                        <span className="inline-block mt-1 font-mono text-[10px] bg-brand-gray-light text-brand-gray px-1.5 py-0.5 rounded font-semibold border border-brand-gray-border/60">
                          {prod.model}
                        </span>
                      )}
                    </div>

                    {/* Single Frame Actions: Live, Edit, Delete */}
                    <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-gray-100">
                      {/* Live Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(prod)}
                        title={`Click to ${prod.isActive ? 'hide' : 'activate'}`}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase transition-all ${
                          prod.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {prod.isActive ? (
                          <>
                            <Eye className="h-3 w-3" /> Live
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" /> Hidden
                          </>
                        )}
                      </button>

                      {/* Edit & Delete Action Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(prod)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(prod._id, prod.name)}
                          className="p-1.5 text-brand-red hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- DESKTOP TABLE VIEW --- */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-brand-gray-light">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-black text-brand-dark uppercase tracking-wider">
                    Thumbnail
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-black text-brand-dark uppercase tracking-wider">
                    Product Title & Model
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-black text-brand-dark uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-black text-brand-dark uppercase tracking-wider">
                    Specs & Features
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-black text-brand-dark uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-black text-brand-dark uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((prod) => {
                  const hasImage = prod.images && prod.images.length > 0;
                  const thumbUrl = hasImage ? prod.images[0].url : null;
                  const categoryName = prod.category?.name || 'Uncategorized';
                  const featureCount = prod.features?.length || 0;
                  const specCount = prod.specifications?.length || 0;

                  return (
                    <tr key={prod._id} className="hover:bg-brand-gray-light/40 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="w-14 h-14 rounded-lg border border-brand-gray-border bg-white flex items-center justify-center overflow-hidden p-1 relative shadow-sm">
                          {thumbUrl ? (
                            <img
                              src={thumbUrl}
                              alt={prod.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center opacity-30 text-[0.6rem] font-bold">
                              <Package className="h-5 w-5" />
                              <span>N/A</span>
                            </div>
                          )}
                          {hasImage && prod.images.length > 1 && (
                            <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[0.55rem] px-1 rounded font-bold">
                              +{prod.images.length - 1}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Product Name & Model */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-sm text-brand-dark hover:text-brand-red transition-colors">
                          {prod.name}
                        </div>
                        <div className="text-xs text-brand-gray-mid flex items-center gap-2 mt-0.5">
                          {prod.model ? (
                            <span className="bg-brand-gray-light px-2 py-0.5 rounded font-mono font-semibold text-brand-gray">
                              {prod.model}
                            </span>
                          ) : (
                            <span className="text-brand-gray-mid/60 italic">No model</span>
                          )}
                          <span className="text-[0.7rem] text-brand-gray-mid/70 font-mono">
                            /{prod.slug}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-block bg-brand-gray-light text-brand-dark text-xs font-bold px-2.5 py-1 rounded-md border border-brand-gray-border/60">
                          {categoryName}
                        </span>
                      </td>

                      {/* Specs & Features count */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-brand-gray font-medium">
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[0.7rem] font-bold">
                            {featureCount} Features
                          </span>
                          <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-[0.7rem] font-bold">
                            {specCount} Specs
                          </span>
                        </div>
                      </td>

                      {/* Quick Toggle Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(prod)}
                          title={`Click to ${prod.isActive ? 'hide' : 'activate'}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                            prod.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {prod.isActive ? (
                            <>
                              <Eye className="h-3.5 w-3.5" /> Live
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3.5 w-3.5" /> Hidden
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleEdit(prod)}
                          className="p-1.5 text-brand-gray hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors inline-flex"
                          title="Edit Product"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(prod._id, prod.name)}
                          className="p-1.5 text-brand-gray hover:text-brand-red rounded-lg hover:bg-red-50 transition-colors inline-flex"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-brand-gray-light/40 border-t border-brand-gray-border flex items-center justify-between text-xs text-brand-gray-mid">
            <span>
              Showing <strong className="text-brand-dark">{filteredProducts.length}</strong> of{' '}
              <strong className="text-brand-dark">{products.length}</strong> products
            </span>
            <span>Cloudinary Storage Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
