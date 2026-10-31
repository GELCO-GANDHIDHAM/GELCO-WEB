import { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Download,
  Printer, 
  Eye, 
  CheckSquare, 
  Square, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Globe, 
  Layers, 
  Shield, 
  Zap, 
  ExternalLink,
  X,
  RefreshCw,
  Loader2
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
    
    // Switch to preview mode first
    setPreviewMode(true);
    
    setTimeout(() => {
      window.print();
      document.title = previousTitle;
    }, 400);
  };

  // Direct jsPDF generation download with 100% clickable native hyperlinks
  const handleDirectDownloadPdf = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select at least 1 product for the catalog');
      return;
    }

    try {
      setIsDownloadingPdf(true);
      toast.loading('Preparing high-resolution catalog with clickable links...', { id: 'pdf-gen' });

      // Switch to preview mode to render DOM nodes
      setPreviewMode(true);
      await new Promise((resolve) => setTimeout(resolve, 600));

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pages = printAreaRef.current?.querySelectorAll('.catalog-page');

      if (!pages || pages.length === 0) {
        throw new Error('No catalog pages found to render');
      }

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i];
        toast.loading(`Processing page ${i + 1} of ${pages.length}...`, { id: 'pdf-gen' });

        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#FFFFFF',
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage('a4', 'p');
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

        // Extract and embed clickable hyperlinks into the PDF document
        const links = pageEl.querySelectorAll('a[href]');
        const pageRect = pageEl.getBoundingClientRect();

        links.forEach((linkEl) => {
          const linkRect = linkEl.getBoundingClientRect();
          if (linkRect.width > 0 && linkRect.height > 0) {
            const x = ((linkRect.left - pageRect.left) / pageRect.width) * 210;
            const y = ((linkRect.top - pageRect.top) / pageRect.height) * 297;
            const w = (linkRect.width / pageRect.width) * 210;
            const h = (linkRect.height / pageRect.height) * 297;
            
            const href = linkEl.getAttribute('href') || linkEl.href;
            if (href && !href.startsWith('#')) {
              pdf.link(x, y, w, h, { url: href });
            }
          }
        });
      }

      pdf.save(`GELCO_Official_Catalog_${selectedProducts.length}_Products.pdf`);
      toast.success('Catalog PDF with clickable links downloaded successfully!', { id: 'pdf-gen' });
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
    <div className="space-y-6 print:space-y-0 print:p-0 print:m-0">
      
      {/* ============================================================ */}
      {/* 1. TOP HEADER & ACTION CONTROLS                              */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl px-5 py-4 border border-brand-gray-border shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-brand-red flex-shrink-0" />
          <div>
            <h1 className="text-base sm:text-lg font-black text-brand-dark uppercase tracking-tight leading-tight">
              Catalog Maker &amp; PDF Studio
            </h1>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-red">
              Product Catalog Generator
            </span>
          </div>
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
            <span>{previewMode ? 'Exit Preview' : 'Live Preview'}</span>
          </button>

          <button
            type="button"
            onClick={handleDirectDownloadPdf}
            disabled={selectedProducts.length === 0 || isDownloadingPdf}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-brand-red-dark text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-brand-red/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloadingPdf ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download Catalog PDF'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPdf}
            disabled={selectedProducts.length === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Open browser print dialog"
          >
            <Printer className="w-4 h-4" />
            <span>Print via Browser</span>
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
        className={`${previewMode ? 'block' : 'hidden print:block'} space-y-8 print:space-y-0 print:m-0 print:p-0 print:w-full`}
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
          <div className="p-8 sm:p-12 pb-4 flex items-center justify-between border-b-2 border-brand-red flex-shrink-0">
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
          <div className="px-8 sm:px-12 py-6 flex-1 flex flex-col justify-center overflow-hidden">
            
            {/* Tagline Typography from Reference Photo */}
            <div className="mb-6 flex-shrink-0">
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
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg relative bg-neutral-900 mb-6 flex-shrink-0">
              <img
                src="/images/hero-showcase.png"
                alt="GELCO Industrial Showcase"
                className="w-full h-auto max-h-64 sm:max-h-72 object-cover block"
              />
            </div>

            {/* Catalog Title Block */}
            <div className="bg-gray-50 border-l-4 border-brand-red p-6 rounded-r-xl flex-shrink-0">
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
                <span>100% Tested &amp; Certified</span>
              </div>
            </div>

          </div>

          {/* Cover Footer Strip */}
          <div className="bg-brand-dark text-white p-6 sm:p-8 flex items-center justify-between text-xs flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red" />
              <span className="font-black uppercase tracking-wider text-[11px]">GELCO PLUS ELECTRICALS</span>
              <span className="text-gray-400 text-[10px]">|</span>
              <span className="text-gray-300 text-[10px]">Gandhidham (Kutch), Gujarat</span>
            </div>
            <div className="font-mono text-gray-400 text-[10px]">
              Cover Page • 1 of {selectedProducts.length + 2}
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
              className="catalog-page a4-page bg-white relative flex flex-col justify-between shadow-xl mx-auto overflow-hidden print:shadow-none"
            >

              {/* Product Page Header */}
              <div className="px-6 py-2 flex items-center justify-between gap-3 border-b border-gray-200 flex-shrink-0" style={{minHeight: '44px'}}>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <img src="/flower.png" alt="GELCO" className="h-6 w-6 object-contain" />
                  <img src="/gelco_text.png" alt="GELCO" className="h-4 object-contain" />
                  <span className="text-[8px] font-black uppercase tracking-wider text-brand-dark pl-2 border-l border-gray-300">
                    Plus Electricals
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[9px] font-black uppercase tracking-wider bg-brand-red/10 text-brand-red px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    {product.category?.name || 'Equipment'}
                  </span>
                  {product.model && (
                    <span className="text-[9px] font-mono font-black bg-brand-dark text-white px-2.5 py-0.5 rounded whitespace-nowrap">
                      {product.model}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Page Body */}
              <div className="px-6 py-2 flex-1 flex flex-col gap-2.5 overflow-hidden">
                
                {/* Title & Short Description */}
                <div>
                  <h1 className="text-base font-black text-brand-dark uppercase tracking-tight leading-snug">
                    {product.name}
                  </h1>
                  {product.shortDescription && (
                    <p className="text-[11px] text-brand-gray font-medium mt-0.5 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  )}
                </div>

                {/* Visual Image / Technical Spec Banner */}
                <div className="h-36 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-xl border border-gray-200 p-3 flex items-center justify-center relative overflow-hidden shadow-xs flex-shrink-0">
                  {hasImage ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain select-none"
                    />
                  ) : (
                    <div className="flex items-center gap-4 text-left w-full max-w-md">
                      <div className="w-16 h-16 bg-brand-red/10 border border-brand-red/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Zap className="w-8 h-8 text-brand-red" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest text-brand-red">
                          GELCO HIGH RELIABILITY SERIES
                        </span>
                        <h4 className="text-sm font-black text-brand-dark uppercase mt-0.5">
                          {product.model || 'Standard Unit'}
                        </h4>
                        <p className="text-[11px] text-brand-gray font-medium">
                          Built with heavy-duty contacts, flame-retardant ABS/sheet metal housing & precision trip mechanisms.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comprehensive Description */}
                {product.description && (
                  <div className="bg-gray-50/70 p-3 rounded-lg border border-gray-200/80">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-brand-dark mb-0.5">
                      Product Overview
                    </h3>
                    <p className="text-[11px] text-gray-700 leading-relaxed font-normal">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Key Features (Bullets) */}
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-brand-dark mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-brand-red" />
                      Key Features & Protections
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {product.features.slice(0, 8).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-1.5 text-[11px] text-gray-800">
                          <CheckCircle2 className="w-3 h-3 text-brand-red flex-shrink-0 mt-0.5" />
                          <span className="leading-tight font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Specifications Table */}
                {product.specifications && product.specifications.length > 0 && (
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-brand-dark mb-1.5 flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-brand-red" />
                      Technical Specifications
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-brand-dark text-white text-[9px] uppercase font-black tracking-wider">
                            <th className="py-1.5 px-3 w-1/3">Parameter</th>
                            <th className="py-1.5 px-3 w-2/3">Specification Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {product.specifications.slice(0, 10).map((spec, sIdx) => (
                            <tr key={sIdx} className={sIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}>
                              <td className="py-1.5 px-3 font-bold text-brand-dark text-[10px]">
                                {spec.key}
                              </td>
                              <td className="py-1.5 px-3 font-medium text-gray-800 text-[10px]">
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
              <div className="bg-gray-100 px-6 py-2 border-t border-gray-200 flex items-center justify-between text-xs text-brand-gray">
                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${COMPANY.phone}`}
                    className="hover:text-brand-red font-bold flex items-center gap-1 text-[10px] print:text-black"
                  >
                    <Phone className="w-3 h-3 text-brand-red" />
                    <span>Inquiry: {COMPANY.phoneDisplay}</span>
                  </a>
                  <span>•</span>
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand-red font-bold flex items-center gap-1 text-[10px] print:text-black"
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
        {/* (Calibrated for strict 1-page A4 height)                     */}
        {/* ------------------------------------------------------------ */}
        <div className="catalog-page a4-page bg-white relative flex flex-col justify-between shadow-xl mx-auto overflow-hidden print:shadow-none">
          
          {/* Top Brand Banner */}
          <div className="px-6 py-4 flex items-center justify-between border-b-2 border-brand-red">
            <div className="flex items-center gap-2.5">
              <img src="/flower.png" alt="GELCO" className="h-10 w-10 object-contain" />
              <div className="flex flex-col">
                <img src="/gelco_text.png" alt="GELCO" className="h-6 object-contain self-start" />
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
          <div className="px-6 py-4 flex-1 flex flex-col justify-center space-y-4 overflow-hidden">
            
            <div className="text-center max-w-xl mx-auto mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-red bg-brand-red/10 px-3 py-0.5 rounded-full inline-block mb-1.5">
                Connect With Us
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-brand-dark uppercase tracking-tight">
                Order, Dealership & Technical Inquiry
              </h2>
              <p className="text-xs text-brand-gray font-medium mt-0.5">
                Click on any contact card below to instantly call, message via WhatsApp, locate our showroom, or visit the live digital catalog.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* 1. Phone Hotline (Clickable tel: link) */}
              <a
                href={`tel:${COMPANY.phone}`}
                className="bg-gray-50 hover:bg-red-50/50 border border-gray-200 hover:border-brand-red/50 rounded-xl p-3.5 transition-all flex items-start gap-3 group"
              >
                <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors shadow-xs flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-brand-red block">
                    Direct Call Hotline
                  </span>
                  <h4 className="font-extrabold text-brand-dark text-sm mt-0.5 group-hover:text-brand-red transition-colors">
                    {COMPANY.phoneDisplay}
                  </h4>
                  <p className="text-[11px] text-brand-gray mt-0.5 font-medium">
                    Contact: {COMPANY.contact}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-brand-red mt-1">
                    Click to Call <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </a>

              {/* 2. WhatsApp Live Chat (Clickable WhatsApp link) */}
              <a
                href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hello GELCO PLUS ELECTRICALS, I am inquiring about product catalog pricing and dealership.")}`}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-50 hover:bg-emerald-50/50 border border-gray-200 hover:border-emerald-500/50 rounded-xl p-3.5 transition-all flex items-start gap-3 group"
              >
                <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-xs flex-shrink-0">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 block">
                    Instant WhatsApp Support
                  </span>
                  <h4 className="font-extrabold text-brand-dark text-sm mt-0.5 group-hover:text-emerald-700 transition-colors">
                    +{COMPANY.whatsapp}
                  </h4>
                  <p className="text-[11px] text-brand-gray mt-0.5 font-medium">
                    Fast quotes, product PDF sheets & specs.
                  </p>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 mt-1">
                    Chat on WhatsApp <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </a>

              {/* 3. Office & Distribution Address (Clickable Google Maps link) */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-50 hover:bg-blue-50/50 border border-gray-200 hover:border-blue-500/50 rounded-xl p-3.5 transition-all flex items-start gap-3 group"
              >
                <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 block">
                    Showroom & Distribution Center
                  </span>
                  <h4 className="font-extrabold text-brand-dark text-xs mt-0.5 leading-snug">
                    {COMPANY.address}
                  </h4>
                  <p className="text-[10px] text-brand-gray mt-0.5 font-medium">
                    {COMPANY.city}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-600 mt-1">
                    Open in Google Maps <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </a>

              {/* 4. Official Web Storefront (Clickable Website link) */}
              <a
                href={websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-50 hover:bg-purple-50/50 border border-gray-200 hover:border-purple-500/50 rounded-xl p-3.5 transition-all flex items-start gap-3 group"
              >
                <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-xs flex-shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-purple-600 block">
                    Live Web Portal
                  </span>
                  <h4 className="font-extrabold text-brand-dark text-xs mt-0.5">
                    gelcogandhidham-eight.vercel.app
                  </h4>
                  <p className="text-[10px] text-brand-gray mt-0.5 font-medium">
                    Search active stock, submit online inquiries & video demo.
                  </p>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-600 mt-1">
                    Visit Online Portal <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </a>

            </div>

            {/* Quality Certification Trust Badge */}
            <div className="bg-neutral-900 text-white rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-red flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-black text-xs uppercase">100% Quality Assurance Tested</h4>
                  <p className="text-[10px] text-gray-300">
                    Engineered for extreme grid voltage fluctuations and harsh agricultural environments.
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold bg-white/10 px-2.5 py-1 rounded-full text-white/90">
                GELCO PLUS VERIFIED
              </span>
            </div>

          </div>

          {/* Back Cover Footer Strip */}
          <div className="bg-brand-dark text-white px-6 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-red" />
              <span className="font-black uppercase tracking-wider text-[11px]">GELCO PLUS ELECTRICALS</span>
              <span className="text-gray-400 text-[10px]">|</span>
              <span className="text-gray-300 text-[10px]">All Rights Reserved © {new Date().getFullYear()}</span>
            </div>
            <div className="font-mono text-gray-400 text-[10px]">
              Page {selectedProducts.length + 2} of {selectedProducts.length + 2} (End of Catalog)
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* 6. EMBEDDED PRINT STYLES FOR EXACT A4 PDF OUTPUT             */}
      {/* Calibrated so no page element spills over to empty pages     */}
      {/* ============================================================ */}
      <style>{`
        .a4-page {
          width: 100%;
          max-width: 794px;
          min-height: 1120px;
          box-sizing: border-box;
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #FFFFFF !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 100% !important;
            height: 100% !important;
          }

          header, aside, nav, .print\\:hidden {
            display: none !important;
          }

          main,
          [class*="md:ml-"],
          [class*="lg:ml-"] {
            margin: 0 !important;
            margin-left: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: visible !important;
          }

          .catalog-page {
            width: 100% !important;
            height: 280mm !important;
            max-height: 280mm !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: always !important;
            break-after: page !important;
            overflow: hidden !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
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
