import { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  CheckSquare, 
  Square, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Layers, 
  Shield, 
  Zap, 
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  X,
  RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import { COMPANY } from '../../utils/constants';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function CatalogMaker() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const printAreaRef = useRef(null);

  // Fetch all products & categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          api.get('/products', { params: { limit: 100 } }),
          api.get('/categories')
        ]);

        const prods = prodRes.data?.data || [];
        const cats = catRes.data?.data || [];

        setProducts(prods);
        setCategories(cats);

        // By default, select all active products
        const allIds = new Set(prods.map((p) => p._id));
        setSelectedIds(allIds);
      } catch (err) {
        console.error('Failed to load products for catalog', err);
        toast.error('Could not load products for catalog');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      p.category?._id === selectedCategory ||
      p.category === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Selected products array
  const selectedProducts = products.filter((p) => selectedIds.has(p._id));

  // Selection handlers
  const toggleProduct = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    const all = new Set(products.map((p) => p._id));
    setSelectedIds(all);
    toast.success(`Selected all ${products.length} products`);
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
    toast('Cleared all product selections');
  };

  const selectFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredProducts.forEach((p) => next.add(p._id));
      return next;
    });
    toast.success(`Added ${filteredProducts.length} filtered products`);
  };

  // Trigger high-resolution Print-to-PDF (Native browser PDF save with 100% clickable links)
  const handlePrintPdf = () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select at least 1 product for the catalog');
      return;
    }

    const previousTitle = document.title;
    document.title = `GELCO_Product_Catalog_${selectedProducts.length}_Products`;
    
    // Switch to preview mode first if not already
    setPreviewMode(true);
    
    setTimeout(() => {
      window.print();
      document.title = previousTitle;
    }, 400);
  };

  // Direct jsPDF generation download
  const handleDirectDownloadPdf = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select at least 1 product for the catalog');
      return;
    }

    try {
      setIsDownloadingPdf(true);
      toast.loading('Generating PDF catalog, please wait...', { id: 'pdf-gen' });

      // Make sure preview is rendered
      setPreviewMode(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pages = printAreaRef.current?.querySelectorAll('.catalog-page');

      if (!pages || pages.length === 0) {
        throw new Error('No catalog pages found to render');
      }

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i];
        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#FFFFFF',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage('a4', 'p');
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }

      pdf.save(`GELCO_Official_Catalog_${selectedProducts.length}_Products.pdf`);
      toast.success('Catalog PDF downloaded successfully!', { id: 'pdf-gen' });
    } catch (err) {
      console.error('jsPDF generation failed:', err);
      toast.error('Direct PDF export encountered an error. Opening print preview...', { id: 'pdf-gen' });
      window.print();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const websiteUrl = window.location.origin || 'https://gelcogandhidham-eight.vercel.app';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.address)}`;

  return (
    <div className="space-y-6">
      
      {/* ============================================================ */}
      {/* 1. TOP HEADER & ACTION CONTROLS                              */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-gray-border shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-red">
              Product Catalog Generator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-dark uppercase tracking-tight flex items-center gap-3">
            <FileText className="h-7 w-7 text-brand-red" />
            Catalog Maker & PDF Studio
          </h1>
          <p className="text-xs sm:text-sm text-brand-gray font-medium mt-1.5 max-w-2xl">
            Select products and generate a multi-page PDF catalog with a cover page, individual technical product pages, and contact links.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
              previewMode
                ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                : 'bg-white text-brand-dark border-gray-300 hover:border-brand-red hover:text-brand-red'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{previewMode ? 'Exit Full Preview' : 'Live Preview'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPdf}
            disabled={selectedProducts.length === 0}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-brand-red/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="w-4 h-4" />
            <span>Download Catalog (Print PDF)</span>
          </button>

          <button
            type="button"
            onClick={handleDirectDownloadPdf}
            disabled={selectedProducts.length === 0 || isDownloadingPdf}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Download .PDF file directly to your device"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingPdf ? 'Generating...' : 'Direct PDF File'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. STATS BAR & QUICK SELECTION CONTROLS                      */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-gray-border shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        {/* Selection Stats */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-gray uppercase">Selected:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-red/10 text-brand-red text-xs font-black">
              {selectedProducts.length} of {products.length} Products
            </span>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-200 pl-4 sm:pl-6">
            <span className="text-xs font-bold text-brand-gray uppercase">Catalog Size:</span>
            <span className="text-xs font-black text-brand-dark">
              {selectedProducts.length > 0 ? selectedProducts.length + 2 : 0} Pages (Cover + Products + Back Cover)
            </span>
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-brand-dark rounded-lg text-xs font-bold uppercase transition-colors"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={deselectAll}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-brand-dark rounded-lg text-xs font-bold uppercase transition-colors"
          >
            Clear All
          </button>
          {filteredProducts.length < products.length && (
            <button
              type="button"
              onClick={selectFiltered}
              className="px-3 py-1.5 bg-brand-red/10 hover:bg-brand-red/20 text-brand-red rounded-lg text-xs font-bold uppercase transition-colors"
            >
              Select Filtered ({filteredProducts.length})
            </button>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. CATEGORY TABS & SEARCH BAR                                */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-gray-border shadow-xs space-y-4 print:hidden">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-brand-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by model or name to include in catalog..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-dark"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-black uppercase transition-all ${
              selectedCategory === 'all'
                ? 'bg-brand-red text-white shadow-xs'
                : 'bg-gray-100 text-brand-gray hover:bg-gray-200 hover:text-brand-dark'
            }`}
          >
            All Categories ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter((p) => p.category?._id === cat._id || p.category === cat._id).length;
            const isSelected = selectedCategory === cat._id;
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-3 py-1.5 rounded-full text-xs font-black uppercase transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-brand-red text-white shadow-xs'
                    : 'bg-gray-100 text-brand-gray hover:bg-gray-200 hover:text-brand-dark'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-brand-dark'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. PRODUCT SELECTION GRID (Shown when NOT in full preview)   */}
      {/* ============================================================ */}
      {!previewMode && (
        <div className="space-y-4 print:hidden">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black uppercase tracking-wider text-brand-dark">
              Click any product to toggle its inclusion in the catalog:
            </h2>
            <span className="text-xs text-brand-gray font-medium">
              Showing {filteredProducts.length} items
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-brand-gray-border">
              <RefreshCw className="w-8 h-8 text-brand-red animate-spin mx-auto mb-3" />
              <p className="text-sm font-bold text-brand-dark uppercase">Loading products catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-brand-gray-border">
              <Layers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-brand-dark uppercase">No products match your filter</p>
              <p className="text-xs text-brand-gray mt-1">Try clearing the search query or selecting All Categories</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const isSelected = selectedIds.has(product._id);
                const hasImage = product.images && product.images.length > 0;

                return (
                  <div
                    key={product._id}
                    onClick={() => toggleProduct(product._id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between relative select-none ${
                      isSelected
                        ? 'bg-white border-brand-red shadow-md ring-2 ring-brand-red/20'
                        : 'bg-white/70 border-gray-200 hover:border-gray-300 opacity-70'
                    }`}
                  >
                    {/* Top Status & Checkbox */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-brand-red flex-shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-brand-red' : 'text-gray-400'}`}>
                          {isSelected ? 'Included in Catalog' : 'Excluded'}
                        </span>
                      </div>

                      {product.model && (
                        <span className="text-[10px] font-mono font-bold bg-gray-100 text-brand-dark px-2 py-0.5 rounded">
                          {product.model}
                        </span>
                      )}
                    </div>

                    {/* Product Image / Fallback Thumbnail */}
                    <div className="h-32 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-3 border border-gray-100">
                      {hasImage ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-center">
                          <img src="/flower.png" alt="GELCO" className="h-10 w-10 mx-auto object-contain opacity-40 mb-1" />
                          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
                            {product.model || 'GELCO PLUS'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-brand-red block mb-1">
                        {product.category?.name || 'Industrial Equipment'}
                      </span>
                      <h3 className="font-extrabold text-brand-dark text-xs sm:text-sm line-clamp-2 leading-tight mb-2">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 text-[10px] text-brand-gray font-medium pt-2 border-t border-gray-100">
                        <span>{product.specifications?.length || 0} Specs</span>
                        <span>•</span>
                        <span>{product.features?.length || 0} Features</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. PRINT-READY CATALOG DOCUMENT (A4 MULTI-PAGE FORMAT)        */}
      {/* Rendered live on screen when Preview is active, AND used     */}
      {/* by window.print() / jsPDF for exact PDF document output.     */}
      {/* ============================================================ */}
      <div 
        ref={printAreaRef}
        className={`${previewMode ? 'block' : 'hidden print:block'} space-y-8 print:space-y-0`}
      >
        <div className="bg-brand-dark text-white p-4 rounded-xl flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-brand-red" />
            <span className="font-bold text-xs uppercase tracking-wider">
              Catalog Multi-Page Live Preview ({selectedProducts.length + 2} Total Pages)
            </span>
          </div>
          <button
            onClick={() => setPreviewMode(false)}
            className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg font-bold uppercase transition-colors"
          >
            Back to Selection Grid
          </button>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* PAGE 1: COVER PAGE                                           */}
        {/* ------------------------------------------------------------ */}
        <div className="catalog-page a4-page bg-white relative flex flex-col justify-between shadow-2xl mx-auto overflow-hidden print:shadow-none">
          
          {/* Top Brand Header Bar */}
          <div className="p-8 sm:p-12 pb-4 flex items-center justify-between border-b-2 border-brand-red">
            <div className="flex items-center gap-3">
              <img src="/flower.png" alt="GELCO" className="h-14 w-14 object-contain" />
              <div className="flex flex-col">
                <img src="/gelco_text.png" alt="GELCO" className="h-8 object-contain self-start" />
                <span className="text-[11px] font-black uppercase tracking-widest text-brand-dark mt-0.5">
                  Plus Electricals
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-red bg-brand-red/10 px-3 py-1 rounded-full inline-block">
                Authorized Catalog
              </span>
              <p className="text-xs font-bold text-brand-dark mt-1">Edition 2026 – 2027</p>
            </div>
          </div>

          {/* Cover Middle Hero Showcase Banner */}
          <div className="px-8 sm:px-12 py-6 flex-1 flex flex-col justify-center">
            
            {/* Tagline Typography from Reference Photo */}
            <div className="mb-6">
              <span className="block text-xl sm:text-2xl font-light text-brand-dark leading-none">
                Powerful
              </span>
              <span className="block text-4xl sm:text-6xl font-black text-brand-red leading-[0.95] tracking-tight my-1">
                Security
              </span>
              <span className="block text-lg sm:text-2xl font-normal text-brand-dark leading-none pl-12 sm:pl-16">
                always<span className="text-brand-red font-black">.</span>
              </span>
            </div>

            {/* Showcase Artwork Container */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg relative bg-neutral-900 mb-6">
              <img
                src="/images/hero-showcase.png"
                alt="GELCO Industrial Showcase"
                className="w-full h-auto object-cover block"
              />
            </div>

            {/* Catalog Title Block */}
            <div className="bg-gray-50 border-l-4 border-brand-red p-6 rounded-r-xl">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-dark uppercase tracking-tight">
                Official Product Specification Catalog
              </h2>
              <p className="text-xs sm:text-sm text-brand-gray font-medium mt-1 leading-relaxed">
                Complete engineering range of Three-Phase DOL Motor Starters, Earth Leakage Circuit Breakers (ELCB), Automatic Voltage Stabilizers, Electronic Phase Changers, and Astronomical Timers.
              </p>
              
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-brand-dark">
                <span className="flex items-center gap-1.5 text-brand-red">
                  <CheckCircle2 className="w-4 h-4" /> {selectedProducts.length} Equipment Models Featured
                </span>
                <span>•</span>
                <span>Gandhidham, Gujarat</span>
                <span>•</span>
                <span>100% Tested & Certified</span>
              </div>
            </div>

          </div>

          {/* Cover Footer Strip */}
          <div className="bg-brand-dark text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red" />
              <span className="font-black uppercase tracking-wider">GELCO PLUS ELECTRICALS</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">Gandhidham (Kutch), Gujarat</span>
            </div>
            <div className="font-mono text-gray-400 text-[11px]">
              Page 1 of {selectedProducts.length + 2}
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------ */}
        {/* PAGES 2 to N: EXACTLY 1 PRODUCT PER PAGE                     */}
        {/* ------------------------------------------------------------ */}
        {selectedProducts.map((product, idx) => {
          const pageNum = idx + 2;
          const totalPages = selectedProducts.length + 2;
          const hasImage = product.images && product.images.length > 0;

          return (
            <div
              key={product._id}
              className="catalog-page a4-page bg-white relative flex flex-col justify-between shadow-2xl mx-auto overflow-hidden print:shadow-none print:break-before-page"
            >
              
              {/* Product Page Header */}
              <div className="p-6 sm:p-8 pb-3 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <img src="/flower.png" alt="GELCO" className="h-8 w-8 object-contain" />
                  <img src="/gelco_text.png" alt="GELCO" className="h-5 object-contain" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-dark pl-2 border-l border-gray-300">
                    Plus Electricals
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-brand-red/10 text-brand-red px-2.5 py-1 rounded-full">
                    {product.category?.name || 'Equipment'}
                  </span>
                  {product.model && (
                    <span className="text-xs font-mono font-black bg-brand-dark text-white px-2.5 py-0.5 rounded">
                      Model: {product.model}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Page Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-start space-y-5 overflow-hidden">
                
                {/* Title & Short Description */}
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tight leading-snug">
                    {product.name}
                  </h1>
                  {product.shortDescription && (
                    <p className="text-xs sm:text-sm text-brand-gray font-medium mt-1 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  )}
                </div>

                {/* Visual Image / Technical Spec Banner */}
                <div className="h-44 sm:h-52 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl border border-gray-200 p-4 flex items-center justify-center relative overflow-hidden shadow-xs">
                  {hasImage ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain select-none"
                    />
                  ) : (
                    /* High-End Vector Representation Card */
                    <div className="flex items-center gap-6 text-left w-full max-w-md">
                      <div className="w-20 h-20 bg-brand-red/10 border-2 border-brand-red/30 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                        <Zap className="w-10 h-10 text-brand-red" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-black uppercase tracking-widest text-brand-red">
                          GELCO HIGH RELIABILITY SERIES
                        </span>
                        <h4 className="text-base font-black text-brand-dark uppercase mt-0.5">
                          {product.model || 'Standard Unit'}
                        </h4>
                        <p className="text-xs text-brand-gray font-medium">
                          Built with heavy-duty contacts, flame-retardant housing & precision trip mechanisms.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comprehensive Description */}
                {product.description && (
                  <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-200/80">
                    <h3 className="text-xs font-black uppercase tracking-wider text-brand-dark mb-1">
                      Product Overview
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed font-normal">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Key Features (Bullets) */}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-brand-dark mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-red" />
                      Key Features & Protections
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-gray-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-red flex-shrink-0 mt-0.5" />
                          <span className="leading-tight font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Specifications Table */}
                {product.specifications && product.specifications.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-brand-dark mb-2 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-brand-red" />
                      Technical Specifications
                    </h3>
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="bg-brand-dark text-white text-[10px] uppercase font-black tracking-wider">
                            <th className="py-2 px-3.5 w-1/3">Parameter</th>
                            <th className="py-2 px-3.5 w-2/3">Specification Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {product.specifications.map((spec, sIdx) => (
                            <tr key={sIdx} className={sIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}>
                              <td className="py-2 px-3.5 font-bold text-brand-dark text-[11px]">
                                {spec.key}
                              </td>
                              <td className="py-2 px-3.5 font-medium text-gray-800 text-[11px]">
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>

              {/* Running Product Page Footer */}
              <div className="bg-gray-100 p-4 sm:p-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-gray">
                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${COMPANY.phone}`}
                    className="hover:text-brand-red font-bold flex items-center gap-1 text-[11px] print:text-black"
                  >
                    <Phone className="w-3 h-3 text-brand-red" />
                    <span>Inquiry: {COMPANY.phoneDisplay}</span>
                  </a>
                  <span>•</span>
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand-red font-bold flex items-center gap-1 text-[11px] print:text-black"
                  >
                    <Globe className="w-3 h-3 text-brand-red" />
                    <span>gelcogandhidham-eight.vercel.app</span>
                  </a>
                </div>

                <div className="font-mono text-gray-500 font-bold text-[10px]">
                  Page {pageNum} of {totalPages}
                </div>
              </div>

            </div>
          );
        })}

        {/* ------------------------------------------------------------ */}
        {/* FINAL PAGE: CLOSING BACK COVER & CLICKABLE CONTACT LINKS     */}
        {/* ------------------------------------------------------------ */}
        <div className="catalog-page a4-page bg-white relative flex flex-col justify-between shadow-2xl mx-auto overflow-hidden print:shadow-none print:break-before-page">
          
          {/* Top Brand Banner */}
          <div className="p-8 sm:p-12 pb-4 flex items-center justify-between border-b-2 border-brand-red">
            <div className="flex items-center gap-3">
              <img src="/flower.png" alt="GELCO" className="h-12 w-12 object-contain" />
              <div className="flex flex-col">
                <img src="/gelco_text.png" alt="GELCO" className="h-7 object-contain self-start" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark mt-0.5">
                  Plus Electricals
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-brand-gray">
              Direct Contact & Distribution
            </span>
          </div>

          {/* Middle: 4 High-Impact Clickable Contact Cards */}
          <div className="p-8 sm:p-12 flex-1 flex flex-col justify-center space-y-6">
            
            <div className="text-center max-w-xl mx-auto mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-brand-red bg-brand-red/10 px-3.5 py-1 rounded-full inline-block mb-3">
                Connect With Us
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-dark uppercase tracking-tight">
                Order, Dealership & Technical Inquiry
              </h2>
              <p className="text-xs sm:text-sm text-brand-gray font-medium mt-1">
                Click on any contact method below to instantly call, send a WhatsApp message, locate our office, or visit the live digital catalog.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 1. Phone Hotline (Clickable tel: link) */}
              <a
                href={`tel:${COMPANY.phone}`}
                className="bg-gray-50 hover:bg-red-50/50 border border-gray-200 hover:border-brand-red/50 rounded-2xl p-5 transition-all flex items-start gap-4 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors shadow-xs flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-red block">
                    Direct Call Hotline
                  </span>
                  <h4 className="font-extrabold text-brand-dark text-base mt-0.5 group-hover:text-brand-red transition-colors">
                    {COMPANY.phoneDisplay}
                  </h4>
                  <p className="text-xs text-brand-gray mt-1 font-medium">
                    Contact: {COMPANY.contact}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-red mt-2">
                    Click to Call <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>

              {/* 2. WhatsApp Live Chat (Clickable WhatsApp link) */}
              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hello GELCO PLUS ELECTRICALS, I am inquiring about product catalog pricing and dealership.")}`}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-50 hover:bg-emerald-50/50 border border-gray-200 hover:border-emerald-500/50 rounded-2xl p-5 transition-all flex items-start gap-4 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs flex-shrink-0">
                  <ExternalLink className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                    Instant WhatsApp Support
                  </span>
                  <h4 className="font-extrabold text-brand-dark text-base mt-0.5 group-hover:text-emerald-700 transition-colors">
                    +{COMPANY.whatsapp}
                  </h4>
                  <p className="text-xs text-brand-gray mt-1 font-medium">
                    Fast quotes, product PDF sheets & specs.
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-2">
                    Chat on WhatsApp <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>

              {/* 3. Office & Distribution Address (Clickable Google Maps link) */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-50 hover:bg-blue-50/50 border border-gray-200 hover:border-blue-500/50 rounded-2xl p-5 transition-all flex items-start gap-4 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                    Showroom & Distribution Center
                  </span>
                  <h4 className="font-extrabold text-brand-dark text-xs sm:text-sm mt-0.5 leading-snug">
                    {COMPANY.address}
                  </h4>
                  <p className="text-xs text-brand-gray mt-1 font-medium">
                    {COMPANY.city}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 mt-2">
                    Open in Google Maps <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>

              {/* 4. Official Web Storefront (Clickable Website link) */}
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-50 hover:bg-purple-50/50 border border-gray-200 hover:border-purple-500/50 rounded-2xl p-5 transition-all flex items-start gap-4 group"
              >
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-xs flex-shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 block">
                    Live Web Portal
                  </span>
                  <h4 className="font-extrabold text-brand-dark text-sm mt-0.5">
                    gelcogandhidham-eight.vercel.app
                  </h4>
                  <p className="text-xs text-brand-gray mt-1 font-medium">
                    Search active stock, submit online quotes & video demo.
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-600 mt-2">
                    Visit Online Portal <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>

            </div>

            {/* Quality Certification Trust Badge */}
            <div className="bg-neutral-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-red flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase">100% Quality Assurance Tested</h4>
                  <p className="text-xs text-gray-300">
                    Engineered for extreme grid voltage fluctuations and harsh agricultural environments.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-white/10 px-3 py-1.5 rounded-full text-white/90">
                GELCO PLUS VERIFIED
              </span>
            </div>

          </div>

          {/* Back Cover Footer Strip */}
          <div className="bg-brand-dark text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red" />
              <span className="font-black uppercase tracking-wider">GELCO PLUS ELECTRICALS</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">All Rights Reserved © {new Date().getFullYear()}</span>
            </div>
            <div className="font-mono text-gray-400 text-[11px]">
              Page {selectedProducts.length + 2} of {selectedProducts.length + 2} (End of Catalog)
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 6. EMBEDDED PRINT STYLES FOR EXACT A4 PDF OUTPUT             */}
      {/* ============================================================ */}
      <style>{`
        .a4-page {
          width: 100%;
          max-width: 800px;
          min-height: 1120px;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }

          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          header, aside, nav, .print\\:hidden {
            display: none !important;
          }

          .catalog-page {
            width: 210mm !important;
            min-height: 297mm !important;
            height: 297mm !important;
            max-width: 210mm !important;
            padding: 0 !important;
            margin: 0 !important;
            page-break-after: always !important;
            break-after: page !important;
            box-shadow: none !important;
            border: none !important;
          }

          .catalog-page:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          a {
            text-decoration: underline !important;
            color: inherit !important;
          }
        }
      `}</style>

    </div>
  );
}
