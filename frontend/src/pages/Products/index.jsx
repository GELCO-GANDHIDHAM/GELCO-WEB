import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/cards/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { Search, Menu, X, Check } from 'lucide-react';
import SearchWithSuggestions from '../../components/common/SearchWithSuggestions';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCat = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { limit: 100 };
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory) params.category = selectedCategory;
        
        const res = await api.get('/products', { params });
        setProducts(res.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchProducts();
      const newParams = {};
      if (searchTerm) newParams.search = searchTerm;
      if (selectedCategory) newParams.category = selectedCategory;
      setSearchParams(newParams);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, setSearchParams]);

  // Close sidebar on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-6 sm:py-10">
      {/* --- OFFCANVAS CATEGORY SIDEBAR --- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-brand-gray-border flex items-center justify-between bg-brand-dark text-white">
          <div className="flex items-center gap-2.5">
            <img src="/flower.png" alt="GELCO" className="w-7 h-7 object-contain" />
            <div>
              <span className="font-black uppercase tracking-wider text-sm sm:text-base block leading-none">
                Categories
              </span>
              <span className="text-[0.65rem] text-brand-red font-bold uppercase tracking-widest mt-0.5 block">
                Gelco Catalogue
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-brand-gray-mid hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('');
              setSidebarOpen(false);
            }}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-between ${
              selectedCategory === ''
                ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                : 'text-brand-gray hover:bg-brand-gray-light hover:text-brand-dark'
            }`}
          >
            <span>All Products</span>
            {selectedCategory === '' && <Check className="h-4 w-4" />}
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.slug);
                setSidebarOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                  : 'text-brand-gray hover:bg-brand-gray-light hover:text-brand-dark'
              }`}
            >
              <span className="truncate pr-2">{cat.name}</span>
              {selectedCategory === cat.slug && <Check className="h-4 w-4 flex-shrink-0" />}
            </button>
          ))}
        </div>

        {/* Drawer Footer */}
        {selectedCategory && (
          <div className="p-4 border-t border-brand-gray-border bg-brand-gray-light/60">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('');
                setSidebarOpen(false);
              }}
              className="w-full py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-brand-red border border-brand-red rounded-xl hover:bg-brand-red hover:text-white transition-all text-center"
            >
              Reset to All Products
            </button>
          </div>
        )}
      </aside>

      {/* --- MAIN PAGE CONTENT --- */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Page Title & Search / Filter Bar */}
        <div className="mb-6 sm:mb-8 space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-dark uppercase tracking-tight">
              Our Products
            </h1>
            <div className="h-1 w-16 sm:w-20 bg-brand-red mt-1"></div>
          </div>

          {/* Action Toolbar: Categories Trigger + Search Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Categories Trigger Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-2 bg-brand-dark text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-black transition-all shadow-xs active:scale-95 flex-shrink-0 group"
              title="Open Categories"
            >
              <Menu className="h-4 w-4 text-brand-red group-hover:scale-110 transition-transform" />
              <span>Categories</span>
              {selectedCategory && (
                <span className="w-2 h-2 rounded-full bg-brand-red" />
              )}
            </button>

            {/* Search Input with Live Suggestions */}
            <div className="flex-1 min-w-0">
              <SearchWithSuggestions
                value={searchTerm}
                onChange={(val) => setSearchTerm(val)}
                onSubmit={(val) => setSearchTerm(val)}
                placeholder="Search name, model number..."
                dropdownAlign="left"
                inputClassName="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-9 py-2 sm:py-2.5 text-xs sm:text-sm font-medium outline-none focus:border-brand-red transition-all shadow-xs placeholder:text-brand-gray-mid"
              />
            </div>
          </div>

          {/* Active Filter Indicator */}
          {(selectedCategory || searchTerm) && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] sm:text-xs text-brand-gray-mid font-semibold uppercase tracking-wider">Filtered By:</span>
              
              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 bg-brand-red/10 text-brand-red text-xs font-bold px-3 py-1 rounded-full border border-brand-red/20 shadow-2xs">
                  <span>Category: {activeCategoryObj?.name || selectedCategory}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('')}
                    className="hover:text-brand-red-dark ml-0.5"
                    title="Clear category"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}

              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 bg-brand-dark/10 text-brand-dark text-xs font-bold px-3 py-1 rounded-full border border-brand-dark/20 shadow-2xs">
                  <span>Search: "{searchTerm}"</span>
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="hover:text-black ml-0.5"
                    title="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('');
                  setSearchTerm('');
                }}
                className="text-[11px] sm:text-xs font-bold text-brand-red hover:underline ml-2"
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* --- PRODUCTS GRID --- */}
        <div>
          {loading ? (
            <LoadingSpinner text="Loading products..." />
          ) : error ? (
            <ErrorState message={error} onRetry={() => setSearchTerm(searchTerm)} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No Products Found"
              message="We couldn't find any products matching your search or category filter."
              actionText="Clear All Filters"
              onAction={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}