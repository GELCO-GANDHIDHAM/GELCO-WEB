import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight, Tag } from 'lucide-react';
import api from '../../services/api';

export default function SearchWithSuggestions({
  value = '',
  onChange,
  onSubmit,
  placeholder = 'Search by name or model number...',
  className = '',
  inputClassName = '',
  dropdownAlign = 'left', // 'left' | 'right'
  onSelectProduct,
  autoNavigate = true,
  embedded = false, // if true, behaves like in-page filter
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Sync internal query with prop value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get('/products', {
          params: { search: trimmed, limit: 6 },
        });
        setSuggestions(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch search suggestions:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e) => {
    const newVal = e.target.value;
    setQuery(newVal);
    if (onChange) onChange(newVal);
    if (newVal.trim().length >= 1) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    if (onChange) onChange('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    if (onSubmit) {
      onSubmit(query);
    } else if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleItemClick = (product) => {
    setIsOpen(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    }
    if (autoNavigate && product.slug) {
      navigate(`/products/${product.slug}`);
    }
  };

  // Helper to highlight matching text in title/model
  const highlightMatch = (text, match) => {
    if (!text) return '';
    if (!match || !match.trim()) return text;
    const parts = text.split(new RegExp(`(${match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === match.toLowerCase() ? (
        <span key={i} className="text-brand-red font-black underline decoration-brand-red/30">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative w-full">
        {/* Search Icon */}
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-gray-mid pointer-events-none flex items-center justify-center">
          <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim().length >= 1) setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsOpen(false);
          }}
          placeholder={placeholder}
          className={
            inputClassName ||
            'w-full bg-brand-gray-light border border-brand-gray-border focus:border-brand-red focus:bg-white text-xs sm:text-sm font-medium rounded-full pl-9 pr-8 py-1.5 sm:py-2 outline-none transition-all placeholder:text-brand-gray-mid shadow-2xs'
          }
          autoComplete="off"
          spellCheck="false"
        />

        {/* Loading Spinner or Clear Button */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && (
            <Loader2 className="h-3.5 w-3.5 text-brand-red animate-spin" />
          )}
          {query && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-brand-gray-mid hover:text-brand-dark hover:bg-gray-200 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* Floating Suggestions Dropdown */}
      {isOpen && query.trim().length >= 1 && (
        <div
          className={`absolute top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-200/90 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 ${
            dropdownAlign === 'right'
              ? 'right-0 w-[290px] xs:w-[340px] sm:w-[420px]'
              : 'left-0 right-0 min-w-[280px] xs:min-w-[320px] sm:min-w-[380px] max-w-lg'
          }`}
        >
          {/* Dropdown Header */}
          <div className="px-3.5 py-2 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-brand-gray-mid">
            <span>Product Suggestions</span>
            {suggestions.length > 0 && (
              <span className="text-brand-red font-bold">{suggestions.length} Found</span>
            )}
          </div>

          {/* Suggestions List */}
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 scrollbar-thin">
            {suggestions.length > 0 ? (
              suggestions.map((item) => {
                const imgUrl = item.images && item.images.length > 0 ? item.images[0].url : '/flower.png';
                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className="w-full text-left p-2.5 sm:p-3 hover:bg-brand-red/5 flex items-center gap-3 transition-colors group cursor-pointer"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gray-50 border border-gray-200 flex-shrink-0 p-1 flex items-center justify-center overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-brand-dark group-hover:text-brand-red transition-colors truncate leading-tight">
                        {highlightMatch(item.name, query.trim())}
                      </h4>

                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {/* Model Number Tag */}
                        {item.model && (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 leading-none">
                            <Tag className="w-2.5 h-2.5 text-brand-red" />
                            <span>{highlightMatch(item.model, query.trim())}</span>
                          </span>
                        )}

                        {/* Category Name */}
                        {item.category?.name && (
                          <span className="text-[10px] font-semibold text-brand-gray-mid truncate">
                            {item.category.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-red group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </button>
                );
              })
            ) : !loading ? (
              <div className="py-6 px-4 text-center">
                <p className="text-xs sm:text-sm font-bold text-brand-dark">No products found</p>
                <p className="text-[11px] text-brand-gray-mid mt-0.5">
                  Try searching by product name (e.g. "ELCB") or model number (e.g. "32DP")
                </p>
              </div>
            ) : null}
          </div>

          {/* Dropdown Footer: View All Results CTA */}
          {suggestions.length > 0 && (
            <div className="p-2 border-t border-gray-100 bg-gray-50/60">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-brand-red text-brand-dark hover:text-white border border-gray-200 hover:border-brand-red text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer shadow-2xs"
              >
                <span>View all results for "{query.trim()}"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
