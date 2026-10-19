import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Edit, 
  Trash2, 
  Plus, 
  X, 
  Eye, 
  EyeOff, 
  Search, 
  RefreshCw, 
  Tags, 
  Package, 
  Loader2,
  AlertTriangle
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    displayOrder: 0,
    isActive: true,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filtered categories based on search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.slug && cat.slug.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setEditId(null);
    setShowModal(true);
  };

  const handleEdit = (cat) => {
    setFormData({
      name: cat.name,
      displayOrder: cat.displayOrder ?? 0,
      isActive: cat.isActive ?? true,
    });
    setEditId(cat._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editId) {
        await api.put(`/admin/categories/${editId}`, {
          name: formData.name.trim(),
          displayOrder: Number(formData.displayOrder) || 0,
          isActive: formData.isActive,
        });
        toast.success('Category updated successfully');
      } else {
        await api.post('/admin/categories', {
          name: formData.name.trim(),
          displayOrder: Number(formData.displayOrder) || 0,
          isActive: formData.isActive,
        });
        toast.success('New category created');
      }
      setShowModal(false);
      setEditId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving category');
    } finally {
      setSubmitting(false);
    }
  };

  // Instant Live / Hidden Toggle (also cascades to products!)
  const handleToggleStatus = async (cat) => {
    const newStatus = !cat.isActive;
    try {
      const res = await api.put(`/admin/categories/${cat._id}`, {
        isActive: newStatus,
      });

      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? { ...c, isActive: newStatus } : c))
      );

      if (newStatus === false) {
        toast.success(
          `Category hidden. All products in "${cat.name}" are now hidden from public view.`,
          { duration: 4500 }
        );
      } else {
        toast.success(
          `Category activated. Products in "${cat.name}" are now live.`,
          { duration: 4000 }
        );
      }
    } catch (err) {
      console.error('Failed to toggle status', err);
      toast.error('Failed to update category status');
    }
  };

  const handleDelete = async (id, name, productCount = 0) => {
    const confirmMessage = productCount > 0
      ? `Are you sure you want to delete "${name}"? This category contains ${productCount} products.`
      : `Are you sure you want to delete "${name}"?`;

    if (!window.confirm(confirmMessage)) return;

    setDeletingId(id);
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success('Category deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting category');
    } finally {
      setDeletingId(null);
    }
  };

  const activeCount = categories.filter((c) => c.isActive).length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-brand-gray-border rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red" />
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-red">
                Catalog Taxonomy
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-brand-dark uppercase tracking-tight">
              Manage Categories
            </h1>
            <p className="text-brand-gray text-xs sm:text-sm mt-1 max-w-2xl">
              Create, rename, or toggle category visibility. Hiding a category automatically hides all products inside it.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCategories}
              className="p-2.5 rounded-xl border border-brand-gray-border hover:bg-brand-gray-light text-brand-gray hover:text-brand-dark transition-all"
              title="Refresh categories"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-black text-xs sm:text-sm uppercase tracking-wider px-5 py-3 rounded-xl shadow-md hover:shadow-brand-red/30 transition-all active:scale-95 flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Stats & Search Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-brand-gray-border">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gray-mid" />
            <input
              type="text"
              placeholder="Search categories by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-gray-light/50 border border-brand-gray-border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm outline-none focus:border-brand-red focus:bg-white transition-all"
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

          <div className="flex items-center justify-between sm:justify-end gap-3 px-3 py-2 bg-brand-gray-light/60 rounded-xl border border-brand-gray-border/60">
            <span className="text-xs font-bold text-brand-gray-mid">
              Active: <strong className="text-green-700">{activeCount}</strong> / {categories.length}
            </span>
            <span className="text-xs font-bold text-brand-gray-mid">
              Hidden: <strong className="text-brand-red">{categories.length - activeCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* --- CATEGORY LIST (CLEAN SINGLE FRAME, NO IMAGE, NO HORIZONTAL SCROLL) --- */}
      {loading ? (
        <div className="bg-white rounded-2xl p-6 border border-brand-gray-border">
          <LoadingSpinner text="Loading categories..." />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-brand-gray-border">
          <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-red">
            <Tags className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-black text-brand-dark uppercase tracking-wide mb-1">
            {searchQuery ? 'No Matching Categories' : 'No Categories Found'}
          </h3>
          <p className="text-brand-gray text-xs sm:text-sm max-w-md mx-auto mb-6">
            {searchQuery
              ? 'Try searching with a different category name.'
              : 'Add your first product category using the button below.'}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-gray-border overflow-hidden">
          
          {/* --- MOBILE VIEW: SINGLE FRAME CARDS (NO SIDEWAYS SCROLL) --- */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredCategories.map((cat) => {
              const isDeleting = deletingId === cat._id;
              return (
                <div 
                  key={cat._id} 
                  className={`p-4 flex flex-col gap-3 transition-colors ${
                    cat.isActive ? 'bg-white' : 'bg-gray-50/70'
                  }`}
                >
                  {/* Category Name & Product Count */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-black text-sm text-brand-dark leading-snug">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] font-mono text-brand-gray-mid/80 block mt-0.5 truncate">
                        /{cat.slug}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-gray-light text-brand-dark border border-brand-gray-border/70 flex-shrink-0">
                      <Package className="w-3 h-3 text-brand-red" />
                      <span>{cat.productCount ?? 0}</span>
                    </span>
                  </div>

                  {/* Actions in Single Frame: Live/Hidden Toggle, Edit, Delete */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                    {/* Live / Hidden Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(cat)}
                      title={`Click to ${cat.isActive ? 'hide category & its products' : 'make category & its products live'}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-all ${
                        cat.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {cat.isActive ? (
                        <>
                          <Eye className="h-3.5 w-3.5" /> Live
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3.5 w-3.5" /> Hidden
                        </>
                      )}
                    </button>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(cat)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit Category Name"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDelete(cat._id, cat.name, cat.productCount)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-brand-red bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Category"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- DESKTOP VIEW: CLEAN STREAMLINED TABLE (NO IMAGE COLUMN) --- */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-brand-gray-light">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-brand-dark uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-brand-dark uppercase tracking-wider">
                    URL Slug
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-brand-dark uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-brand-dark uppercase tracking-wider">
                    Visibility Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-black text-brand-dark uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((cat) => {
                  const isDeleting = deletingId === cat._id;
                  return (
                    <tr 
                      key={cat._id} 
                      className={`hover:bg-brand-gray-light/40 transition-colors ${
                        cat.isActive ? '' : 'bg-gray-50/50'
                      }`}
                    >
                      {/* Category Name */}
                      <td className="px-6 py-4">
                        <span className="font-black text-sm text-brand-dark block">
                          {cat.name}
                        </span>
                      </td>

                      {/* URL Slug */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-brand-gray-mid">
                          /{cat.slug}
                        </span>
                      </td>

                      {/* Products Count */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-brand-gray-light text-brand-gray border border-brand-gray-border/60">
                          <Package className="w-3.5 h-3.5 text-brand-red" />
                          <span>{cat.productCount ?? 0} Products</span>
                        </span>
                      </td>

                      {/* Live / Hidden Button */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(cat)}
                          title={`Click to ${cat.isActive ? 'hide category & its products' : 'make category & its products live'}`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase transition-all ${
                            cat.isActive
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {cat.isActive ? (
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
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 text-brand-gray hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors inline-flex"
                          title="Edit Category Name"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </button>

                        <button
                          disabled={isDeleting}
                          onClick={() => handleDelete(cat._id, cat.name, cat.productCount)}
                          className="p-1.5 text-brand-gray hover:text-brand-red rounded-lg hover:bg-red-50 transition-colors inline-flex disabled:opacity-50"
                          title="Delete Category"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4.5 w-4.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-4.5 w-4.5" />
                          )}
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
              Showing <strong className="text-brand-dark">{filteredCategories.length}</strong> of{' '}
              <strong className="text-brand-dark">{categories.length}</strong> categories
            </span>
            <span className="text-[11px] text-brand-gray-mid hidden sm:inline">
              Hiding a category automatically hides all its products from the public catalogue.
            </span>
          </div>
        </div>
      )}

      {/* --- ADD / EDIT CATEGORY MODAL (JUST NAME, NO IMAGE) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-brand-gray-border animate-fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-brand-gray-border flex items-center justify-between bg-brand-dark text-white">
              <div className="flex items-center gap-2">
                <Tags className="w-5 h-5 text-brand-red" />
                <h3 className="font-black uppercase tracking-wider text-sm sm:text-base">
                  {editId ? 'Edit Category' : 'Add New Category'}
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
              {/* Category Name Input */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-brand-dark mb-1.5">
                  Category Name <span className="text-brand-red">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Earth Leakage Circuit Breakers"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-red font-medium"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-brand-dark mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                  className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-brand-red font-medium"
                />
              </div>

              {/* Active / Visibility Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-brand-red rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-brand-dark">
                    Active / Live on website
                  </span>
                </label>
                <p className="text-[11px] text-brand-gray-mid mt-1 pl-6">
                  If unchecked, this category and all its products will be hidden from visitors.
                </p>
              </div>

              {/* Action Buttons */}
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
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-brand-red/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editId ? 'Update Category' : 'Save Category'}</span>
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
