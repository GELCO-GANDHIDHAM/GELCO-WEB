import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Package, 
  Tags, 
  MessageSquare, 
  Image as ImageIcon, 
  Plus, 
  ArrowRight, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Activity, 
  Phone, 
  Eye, 
  EyeOff,
  ChevronRight,
  Database,
  Cloud
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      setDashboardData(res.data?.data || null);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading && !dashboardData) {
    return <LoadingSpinner text="Loading dashboard metrics..." />;
  }

  const metrics = dashboardData?.metrics || {
    totalProducts: 0,
    activeProducts: 0,
    hiddenProducts: 0,
    totalCategories: 0,
    activeCategories: 0,
    hiddenCategories: 0,
    totalQueries: 0,
    newQueries: 0,
    pendingQueries: 0,
    totalGallery: 0,
  };

  const recentProducts = dashboardData?.recentProducts || [];
  const recentQueries = dashboardData?.recentQueries || [];
  const categoriesOverview = dashboardData?.categoriesOverview || [];

  return (
    <div className="space-y-6">
      {/* 1. Executive Welcome Header Banner */}
      <div className="bg-white border border-brand-gray-border rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-red">
                Gelco Control Center
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-brand-dark uppercase tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-brand-gray text-xs sm:text-sm mt-1 max-w-2xl">
              Real-time summary of your electrical catalogue, customer inquiries, category visibility, and home photo slider.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboard}
              className="p-2.5 rounded-xl border border-brand-gray-border hover:bg-brand-gray-light text-brand-gray hover:text-brand-dark transition-all flex items-center gap-2 text-xs font-bold"
              title="Refresh stats"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-dark hover:bg-black text-white font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-xs transition-all"
            >
              <span>Visit Site</span>
              <ExternalLink className="h-3.5 w-3.5 text-brand-red" />
            </a>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap mt-5 pt-5 border-t border-brand-gray-border text-[11px] sm:text-xs text-brand-gray-mid font-medium">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-green-600" />
            <span>MongoDB Atlas: <strong className="text-brand-dark">Connected</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-blue-600" />
            <span>Cloudinary Media: <strong className="text-brand-dark">Active</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-brand-red" />
            <span>Catalog Status: <strong className="text-brand-dark">{metrics.activeProducts} Live Items</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Products Card */}
        <Link
          to="/admin/products"
          className="group bg-white rounded-2xl p-5 border border-brand-gray-border shadow-xs hover:shadow-lg hover:border-brand-red/40 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-gray-mid block">
                Manage Products
              </span>
              <span className="text-3xl font-black text-brand-dark mt-1 block">
                {metrics.totalProducts}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-green-700 font-bold flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {metrics.activeProducts} Live
            </span>
            <span className="text-brand-red font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
              View Catalog <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Customer Queries Card */}
        <Link
          to="/admin/queries"
          className="group bg-white rounded-2xl p-5 border border-brand-gray-border shadow-xs hover:shadow-lg hover:border-amber-400 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-gray-mid block">
                Customer Leads
              </span>
              <span className="text-3xl font-black text-brand-dark mt-1 block">
                {metrics.totalQueries}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-amber-700 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {metrics.newQueries} New Inquiries
            </span>
            <span className="text-amber-600 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
              Open Leads <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Categories Card */}
        <Link
          to="/admin/categories"
          className="group bg-white rounded-2xl p-5 border border-brand-gray-border shadow-xs hover:shadow-lg hover:border-blue-400 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-gray-mid block">
                Categories
              </span>
              <span className="text-3xl font-black text-brand-dark mt-1 block">
                {metrics.totalCategories}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Tags className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-blue-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {metrics.activeCategories} Active
            </span>
            <span className="text-blue-600 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
              Manage <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Photo Gallery Slider Card */}
        <Link
          to="/admin/gallery"
          className="group bg-white rounded-2xl p-5 border border-brand-gray-border shadow-xs hover:shadow-lg hover:border-purple-400 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-brand-gray-mid block">
                Home Photo Slider
              </span>
              <span className="text-3xl font-black text-brand-dark mt-1 block">
                {metrics.totalGallery}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-purple-700 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 5-Sec Auto Slider
            </span>
            <span className="text-purple-600 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
              Edit Slides <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

      </div>

      {/* 3. Quick Actions Toolbar */}
      <div className="bg-gradient-to-r from-brand-dark to-neutral-900 text-white rounded-2xl p-4 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wide">Quick Operations</h2>
          <p className="text-xs text-gray-400 mt-0.5">Jump directly to common catalogue actions</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </Link>

          <Link
            to="/admin/categories"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/15 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </Link>

          <Link
            to="/admin/gallery"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/15 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slide Photo</span>
          </Link>
        </div>
      </div>

      {/* 4. Split Section: Recent Products & Customer Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column: Recent Products */}
        <div className="bg-white border border-brand-gray-border rounded-2xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-brand-gray-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-red" />
              <h2 className="font-black text-sm sm:text-base text-brand-dark uppercase tracking-tight">
                Recent Catalogue Products
              </h2>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-brand-red hover:text-brand-red-dark uppercase tracking-wider flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {recentProducts.length === 0 ? (
              <div className="p-8 text-center text-xs text-brand-gray-mid">
                No products found in database.
              </div>
            ) : (
              recentProducts.map((p) => {
                const imgUrl = p.images?.[0]?.url;
                return (
                  <div key={p._id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-brand-gray-light/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Image Thumbnail */}
                      <div className="w-12 h-12 rounded-lg border border-brand-gray-border bg-white flex items-center justify-center p-1 flex-shrink-0 overflow-hidden">
                        {imgUrl ? (
                          <img src={imgUrl} alt={p.name} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <Package className="w-5 h-5 text-gray-300" />
                        )}
                      </div>

                      {/* Name & Model */}
                      <div className="min-w-0">
                        <h3 className="font-bold text-xs sm:text-sm text-brand-dark truncate leading-tight">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {p.model && (
                            <span className="font-mono text-[10px] bg-brand-gray-light text-brand-gray px-1.5 py-0.2 rounded font-semibold">
                              {p.model}
                            </span>
                          )}
                          <span className="text-[10px] text-brand-gray-mid truncate">
                            {p.category?.name || 'Uncategorized'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        p.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {p.isActive ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Customer Leads / Inquiries */}
        <div className="bg-white border border-brand-gray-border rounded-2xl shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-brand-gray-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              <h2 className="font-black text-sm sm:text-base text-brand-dark uppercase tracking-tight">
                Recent Customer Leads
              </h2>
            </div>
            <Link
              to="/admin/queries"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wider flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100 flex-1">
            {recentQueries.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <MessageSquare className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-xs font-bold text-brand-dark uppercase tracking-wider">No Customer Queries Yet</p>
                <p className="text-[11px] text-brand-gray-mid mt-0.5 max-w-xs text-center">
                  When visitors submit inquiries through product pages or contact forms, they will appear here.
                </p>
              </div>
            ) : (
              recentQueries.map((q) => (
                <div key={q._id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-brand-gray-light/40 transition-colors">
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs sm:text-sm text-brand-dark truncate">
                      {q.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-brand-gray-mid">
                      {q.mobileNumber && (
                        <a 
                          href={`tel:${q.mobileNumber}`} 
                          className="hover:text-brand-red font-mono font-semibold flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-brand-gray-mid" />
                          <span>{q.mobileNumber}</span>
                        </a>
                      )}
                      {q.productInterest && (
                        <span className="truncate max-w-[140px] text-brand-gray">
                          • {q.productInterest}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    q.status === 'new'
                      ? 'bg-amber-100 text-amber-800'
                      : q.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {q.status || 'new'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 5. Category Overview Bar Chart / Progress Grid */}
      <div className="bg-white border border-brand-gray-border rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tags className="w-5 h-5 text-blue-600" />
            <h2 className="font-black text-sm sm:text-base text-brand-dark uppercase tracking-tight">
              Catalogue Category Distribution
            </h2>
          </div>
          <Link
            to="/admin/categories"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider flex items-center gap-1"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categoriesOverview.map((cat) => {
            const count = cat.productCount || 0;
            const maxCount = Math.max(...categoriesOverview.map((c) => c.productCount || 1), 10);
            const percentage = Math.min(Math.round((count / maxCount) * 100), 100);

            return (
              <div
                key={cat._id}
                className="p-3.5 rounded-xl border border-gray-100 bg-brand-gray-light/40 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-bold text-xs text-brand-dark truncate">
                    {cat.name}
                  </span>
                  <span className="text-xs font-black text-brand-red flex-shrink-0">
                    {count} {count === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Progress Visual Bar */}
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-red rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentage, 10)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}