import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import WhatsAppButton from '../../components/common/WhatsAppButton';
import ProductImageSlider from '../../components/common/ProductImageSlider';
import ProductCard from '../../components/cards/ProductCard';
import WhatsAppIcon from '../../components/common/WhatsAppIcon';
import { 
  ArrowLeft, 
  Check, 
  Copy, 
  Share2, 
  PhoneCall, 
  ShieldCheck, 
  Zap, 
  Truck, 
  FileText, 
  Sliders, 
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { COMPANY } from '../../utils/constants';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedModel, setCopiedModel] = useState(false);
  const [specSearch, setSpecSearch] = useState('');
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.75;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        const productData = res.data.data;
        setProduct(productData);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Fetch multiple diverse recommended products (~7 products across categories)
        try {
          const allRes = await api.get('/products?limit=24');
          const allList = allRes.data.data || [];
          
          // Filter out current product
          const candidates = allList.filter(p => p._id !== productData._id);
          
          // Prioritize same category first, then diverse other categories
          const sameCat = candidates.filter(p => p.category?._id === productData.category?._id || p.category?.slug === productData.category?.slug);
          const otherCats = candidates.filter(p => p.category?._id !== productData.category?._id && p.category?.slug !== productData.category?.slug);
          
          const combined = [...sameCat, ...otherCats].slice(0, 7);
          setRelatedProducts(combined);
        } catch (e) {
          console.error('Failed to load recommended products', e);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/products');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch (err) {
      console.error('Could not copy link', err);
    }
  };

  const handleCopyModel = async () => {
    if (!product?.model) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(product.model);
        setCopiedModel(true);
        setTimeout(() => setCopiedModel(false), 2000);
      }
    } catch (err) {
      console.error('Could not copy model', err);
    }
  };

  if (loading) {
    return (
      <div className="py-24 min-h-screen bg-[#FBFBFC] flex items-center justify-center">
        <LoadingSpinner text="Retrieving product specifications..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 min-h-screen bg-[#FBFBFC] flex items-center justify-center px-4">
        <ErrorState message={error} />
      </div>
    );
  }

  if (!product) return null;

  const whatsappMsg = `Hello GELCO PLUS ELECTRICALS,\n\nI am interested in:\nProduct: ${product.name}\nModel: ${product.model || 'N/A'}\n\nPlease share price, specifications, and availability.\n\nLink: ${window.location.href}`;
  const catName = product.category?.name || 'Electrical Solutions';
  const catSlug = product.category?.slug || '';

  // Filtered specs
  const filteredSpecs = product.specifications?.filter(spec => {
    if (!specSearch.trim()) return true;
    const term = specSearch.toLowerCase();
    return spec.key?.toLowerCase().includes(term) || spec.value?.toLowerCase().includes(term);
  }) || [];

  return (
    <div className="bg-[#FCFCFD] min-h-screen pb-10 sm:pb-16 text-brand-dark selection:bg-brand-red selection:text-white">
      {/* --- TOP STICKY UTILITY / BREADCRUMB BAR --- */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-10 sm:h-14 flex items-center justify-between gap-3">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-extrabold uppercase tracking-wider text-brand-gray hover:text-brand-red transition-all group"
          >
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 group-hover:bg-brand-red/10 border border-gray-200 group-hover:border-brand-red/30 flex items-center justify-center transition-colors">
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-dark group-hover:text-brand-red group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span>Back</span>
          </button>

          {/* Breadcrumbs for Tablet/Desktop */}
          <nav className="hidden md:flex items-center gap-2 text-xs font-semibold text-brand-gray-mid">
            <Link to="/" className="hover:text-brand-red transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-brand-red transition-colors">Products</Link>
            <span>/</span>
            {catSlug ? (
              <Link to={`/products?category=${catSlug}`} className="hover:text-brand-red transition-colors">
                {catName}
              </Link>
            ) : (
              <span>{catName}</span>
            )}
            <span>/</span>
            <span className="text-brand-dark font-bold truncate max-w-[200px]">{product.name}</span>
          </nav>

          {/* Action Tools (Share Link) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all border ${
                copiedLink
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white hover:bg-gray-50 border-gray-200 text-brand-dark hover:border-gray-300 shadow-2xs'
              }`}
              title="Copy shareable link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-brand-gray" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- HERO PRODUCT SHOWCASE CONTAINER --- */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 pt-2 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: INTERACTIVE IMAGE GALLERY ================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-16">
            <ProductImageSlider 
              images={product.images || []} 
              productName={product.name} 
              autoSlideInterval={5500} 
            />
          </div>

          {/* ================= RIGHT COLUMN: PRODUCT SPECIFICATIONS & CONVERSION ================= */}
          <div className="lg:col-span-7 flex flex-col space-y-2 sm:space-y-5">
            
            {/* Category Tag & Live Status */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
              {catSlug ? (
                <Link
                  to={`/products?category=${catSlug}`}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white transition-colors border border-brand-red/20 shadow-2xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                  <span>{catName}</span>
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-brand-red/10 text-brand-red border border-brand-red/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                  <span>{catName}</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Certified & Available</span>
              </span>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-base sm:text-2xl md:text-3xl font-black text-brand-dark uppercase tracking-tight leading-snug sm:leading-tight">
                {product.name}
              </h1>

              {/* Model Number Pill with Copy Action */}
              {product.model && (
                <div className="mt-1 sm:mt-2.5 flex items-center gap-2 sm:gap-3">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-gray-100/90 border border-gray-200/90 font-mono text-[11px] sm:text-xs text-brand-dark shadow-2xs">
                    <span className="text-brand-gray-mid font-semibold text-[9px] sm:text-[10px]">MODEL:</span>
                    <span className="font-extrabold tracking-wide text-brand-red">{product.model}</span>
                    <button
                      type="button"
                      onClick={handleCopyModel}
                      className="ml-0.5 p-0.5 sm:p-1 hover:bg-white rounded text-brand-gray hover:text-brand-dark transition-all"
                      title="Copy Model Number"
                    >
                      {copiedModel ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  {copiedModel && (
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 animate-fade-in">Model Copied!</span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Specs Highlight Strip (if specifications available) */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
                {product.specifications.slice(0, 4).map((spec, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg sm:rounded-xl bg-white border border-gray-200/90 text-[10px] sm:text-xs shadow-2xs"
                  >
                    <span className="font-bold text-brand-gray-mid">{spec.key}:</span>
                    <span className="font-mono font-bold text-brand-dark">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ================= HIGH-CONVERTING WHATSAPP ENQUIRY CARD ================= */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-3xl bg-gradient-to-br from-white via-[#F9FBFA] to-[#F0FAF4] border sm:border-2 border-[#25D366]/35 p-3 sm:p-6 shadow-2xs hover:shadow-card transition-all duration-300">
              {/* Background WhatsApp Watermark */}
              <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none text-[#25D366]">
                <WhatsAppIcon className="w-36 h-36 sm:w-48 sm:h-48" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-5">
                <div className="space-y-0.5 sm:space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#25D366]/15 text-[#128C7E] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                    <span>Instant Price & Order Inquiry</span>
                  </div>
                  <h3 className="text-xs sm:text-lg font-black text-brand-dark uppercase tracking-tight">
                    Interested in this Product?
                  </h3>
                  <p className="hidden sm:block text-xs sm:text-sm text-brand-gray-mid leading-relaxed max-w-md">
                    Connect directly with our technical sales team for quotations, bulk quantity pricing, and dispatch lead times.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                  {/* Official WhatsApp Button with Official WhatsApp Logo */}
                  <WhatsAppButton 
                    text="Enquire on WhatsApp" 
                    message={whatsappMsg}
                    variant="official"
                    className="flex-1 sm:flex-none !py-2 sm:!py-3 !px-3 sm:!px-6 !text-xs sm:!text-sm !font-black !rounded-lg sm:!rounded-xl shadow-[0_6px_16px_rgba(37,211,102,0.3)] hover:shadow-[0_10px_25px_rgba(37,211,102,0.5)] transform hover:-translate-y-0.5"
                    iconClassName="w-4 h-4 sm:w-5 sm:h-5"
                  />

                  {/* Direct Phone Call Button */}
                  <a
                    href={`tel:${COMPANY.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-300 hover:border-brand-dark bg-white hover:bg-brand-dark text-brand-dark hover:text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-2xs text-center flex-shrink-0"
                    title={`Call ${COMPANY.phoneDisplay}`}
                  >
                    <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="whitespace-nowrap">Call</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Short Description or Lead Paragraph (Positioned After WhatsApp Div) */}
            {product.shortDescription && (
              <p className="text-xs sm:text-sm text-brand-gray leading-relaxed font-normal px-0.5">
                {product.shortDescription}
              </p>
            )}

            {/* ================= GELCO ENGINEERING ASSURANCE CARD ================= */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border border-gray-200/90 shadow-2xs space-y-2 sm:space-y-3.5">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-wider text-brand-dark pb-1 sm:pb-2 border-b border-gray-100">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-red" />
                <span>GELCO Engineering Assurance</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-3 pt-0.5 sm:pt-1 text-xs">
                <div className="flex items-center sm:items-start gap-2">
                  <div className="p-1 sm:p-1.5 rounded-lg bg-red-50 text-brand-red flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-brand-dark leading-tight text-[11px] sm:text-xs">100% Genuine</h5>
                    <p className="text-[10px] sm:text-[11px] text-brand-gray-mid leading-snug hidden sm:block">Original factory tested equipment</p>
                  </div>
                </div>

                <div className="flex items-center sm:items-start gap-2">
                  <div className="p-1 sm:p-1.5 rounded-lg bg-amber-50 text-amber-600 flex-shrink-0">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-brand-dark leading-tight text-[11px] sm:text-xs">Industrial Grade</h5>
                    <p className="text-[10px] sm:text-[11px] text-brand-gray-mid leading-snug hidden sm:block">Built for harsh electrical conditions</p>
                  </div>
                </div>

                <div className="flex items-center sm:items-start gap-2">
                  <div className="p-1 sm:p-1.5 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">
                    <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-brand-dark leading-tight text-[11px] sm:text-xs">Quick Dispatch</h5>
                    <p className="text-[10px] sm:text-[11px] text-brand-gray-mid leading-snug hidden sm:block">Fast supply from Gandhidham</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= INTERACTIVE TABBED NAVIGATION (FULL WIDTH - NO BLANK LEFT SPACE) ================= */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 mt-5 sm:mt-8">
        <div className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs p-3 sm:p-6 lg:p-8">
          <div className="flex items-center w-full border-b border-gray-200 pb-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`flex-1 min-w-0 inline-flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1 sm:px-5 font-black text-[11px] xs:text-xs sm:text-sm uppercase tracking-tight sm:tracking-wider transition-all relative cursor-pointer text-center ${
                activeTab === 'description'
                  ? 'text-brand-red'
                  : 'text-brand-gray-mid hover:text-brand-dark'
              }`}
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">Description</span>
              {activeTab === 'description' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-red rounded-full" />
              )}
            </button>

            {product.features && product.features.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('features')}
                className={`flex-1 min-w-0 inline-flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1 sm:px-5 font-black text-[11px] xs:text-xs sm:text-sm uppercase tracking-tight sm:tracking-wider transition-all relative cursor-pointer text-center ${
                  activeTab === 'features'
                    ? 'text-brand-red'
                    : 'text-brand-gray-mid hover:text-brand-dark'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">Features ({product.features.length})</span>
                {activeTab === 'features' && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-red rounded-full" />
                )}
              </button>
            )}

            {product.specifications && product.specifications.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('specifications')}
                className={`flex-1 min-w-0 inline-flex items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-1 sm:px-5 font-black text-[11px] xs:text-xs sm:text-sm uppercase tracking-tight sm:tracking-wider transition-all relative cursor-pointer text-center ${
                  activeTab === 'specifications'
                    ? 'text-brand-red'
                    : 'text-brand-gray-mid hover:text-brand-dark'
                }`}
              >
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">Specs ({product.specifications.length})</span>
                {activeTab === 'specifications' && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-red rounded-full" />
                )}
              </button>
            )}
          </div>

          {/* Tab Contents */}
          <div className="pt-4 sm:pt-6">
            {/* 1. Description Tab */}
            {activeTab === 'description' && (
              <div className="animate-fade-in space-y-4 max-w-4xl">
                {product.description ? (
                  <div className="prose max-w-none text-brand-gray text-sm sm:text-base leading-relaxed space-y-3 font-normal">
                    {product.description.split('\n').filter(p => p.trim()).map((para, i) => (
                      <p key={i} className="leading-relaxed text-gray-700">{para}</p>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center text-brand-gray-mid text-sm">
                    Standard industrial electrical device engineered to meet strict quality and durability specifications.
                  </div>
                )}
              </div>
            )}

            {/* 2. Key Features Tab (Spans in clean 3-col grid on desktop) */}
            {activeTab === 'features' && product.features && (
              <div className="animate-fade-in">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {product.features.map((feature, i) => (
                    <li 
                      key={i} 
                      className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-gray-50/70 border border-gray-200/90 shadow-2xs hover:border-brand-red/30 hover:bg-white hover:shadow-xs transition-all duration-200"
                    >
                      <div className="w-5 h-5 rounded-full bg-brand-red/10 text-brand-red flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-brand-red stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-sm text-brand-dark font-medium leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 3. Technical Specifications Tab */}
            {activeTab === 'specifications' && product.specifications && (
              <div className="animate-fade-in space-y-3">
                {/* Search filter if more than 5 specs */}
                {product.specifications.length > 5 && (
                  <div className="flex items-center justify-between gap-4 pb-2 max-w-md">
                    <input
                      type="text"
                      value={specSearch}
                      onChange={(e) => setSpecSearch(e.target.value)}
                      placeholder="Filter specifications..."
                      className="w-full px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-red bg-white"
                    />
                    {specSearch && (
                      <button
                        type="button"
                        onClick={() => setSpecSearch('')}
                        className="text-xs font-bold text-brand-red hover:underline whitespace-nowrap"
                      >
                        Clear Filter
                      </button>
                    )}
                  </div>
                )}

                <div className="overflow-hidden border border-gray-200 rounded-2xl shadow-2xs bg-white">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-100/80 border-b border-gray-200 text-brand-dark uppercase tracking-wider text-[11px] font-black">
                        <th className="py-3 px-4 sm:px-6 w-5/12 sm:w-4/12">Specification Parameter</th>
                        <th className="py-3 px-4 sm:px-6 w-7/12 sm:w-8/12">Technical Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSpecs.length > 0 ? (
                        filteredSpecs.map((spec, i) => (
                          <tr 
                            key={i} 
                            className={`border-b border-gray-100 last:border-b-0 hover:bg-brand-red/5 transition-colors ${
                              i % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]/70'
                            }`}
                          >
                            <th className="py-3 px-4 sm:px-6 font-bold text-brand-dark/90 font-sans">
                              {spec.key}
                            </th>
                            <td className="py-3 px-4 sm:px-6 font-mono font-semibold text-brand-dark">
                              {spec.value}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="py-6 text-center text-brand-gray-mid text-xs">
                            No specifications match "{specSearch}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= RECOMMENDED PRODUCTS SECTION ================= */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-5 sm:mt-8 pt-3 sm:pt-6 border-t border-gray-200/80">
          <div className="flex items-end justify-between gap-3 mb-2.5 sm:mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-red/10 text-brand-red text-[10px] sm:text-[11px] font-black uppercase tracking-wider mb-1">
                <span>Recommended For You</span>
              </div>
              <h2 className="text-sm sm:text-xl md:text-2xl font-black text-brand-dark uppercase tracking-tight">
                Recommended Products
              </h2>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Link
                to="/products"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-brand-red hover:underline mr-1"
              >
                <span>View All</span>
                <span>→</span>
              </Link>
              
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 bg-white hover:bg-brand-red hover:text-white hover:border-brand-red transition-all flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
                title="Slide Left"
                aria-label="Slide Left"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-gray-200 bg-white hover:bg-brand-red hover:text-white hover:border-brand-red transition-all flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
                title="Slide Right"
                aria-label="Slide Right"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Sideway Carousel: Exactly 1.75 products on mobile view, slide right */}
          <div 
            ref={carouselRef}
            className="flex gap-2.5 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 px-0.5 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {relatedProducts.map((relProduct) => (
              <div 
                key={relProduct._id} 
                className="flex-[0_0_57%] sm:flex-[0_0_250px] md:flex-[0_0_270px] lg:flex-[0_0_285px] snap-start"
              >
                <ProductCard product={relProduct} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}