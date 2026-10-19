import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, MessageSquare, Tags, LogOut, Menu, X, ChevronRight, Image as ImageIcon, Building2 } from 'lucide-react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('gelco_admin_token');

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  const handleLogout = () => {
    localStorage.removeItem('gelco_admin_token');
    navigate('/admin/login');
  };

  const navItems = [
    {
      name: 'Dashboard Overview',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      badge: 'Home',
    },
    {
      name: 'Manage Products',
      path: '/admin/products',
      icon: Package,
      badge: 'Catalog',
    },
    {
      name: 'Photo Gallery',
      path: '/admin/gallery',
      icon: ImageIcon,
      badge: 'Slider',
    },
    {
      name: 'Customer Queries',
      path: '/admin/queries',
      icon: MessageSquare,
      badge: 'Leads',
    },
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: Tags,
    },
    {
      name: 'Footer & Contact',
      path: '/admin/footer',
      icon: Building2,
      badge: 'Edit',
    },
  ];

  const getPageTitle = () => {
    if (location.pathname.startsWith('/admin/dashboard')) return 'Dashboard Overview';
    if (location.pathname.startsWith('/admin/products')) return 'Manage Products';
    if (location.pathname.startsWith('/admin/gallery')) return 'Photo Gallery Management';
    if (location.pathname.startsWith('/admin/queries')) return 'Customer Queries';
    if (location.pathname.startsWith('/admin/categories')) return 'Product Categories';
    if (location.pathname.startsWith('/admin/footer')) return 'Footer & Contact Settings';
    return 'Dashboard Overview';
  };

  return (
    <div className="min-h-screen bg-brand-gray-light flex">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-dark/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 md:w-72 bg-brand-dark text-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col shadow-2xl border-r border-brand-gray/30`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10 bg-black/20">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 transition-transform">
              <img src="/flower.png" alt="GELCO" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <img src="/gelco_text.png" alt="GELCO" className="h-5 object-contain brightness-0 invert self-start" />
              <span className="text-[0.6rem] font-bold text-brand-red uppercase tracking-widest leading-none mt-1">
                Admin Panel
              </span>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-brand-gray-mid hover:text-white p-1 rounded-lg"
            aria-label="Close Sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="px-4 py-6 flex-1 overflow-y-auto space-y-6">
          <div>
            <p className="px-3 text-[0.65rem] font-black uppercase tracking-widest text-brand-gray-mid/70 mb-3">
              Management Menu
            </p>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/admin/dashboard'
                    ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                    : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wide transition-all ${
                      isActive
                        ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30 translate-x-1'
                        : 'text-brand-gray-mid hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-brand-gray-mid'}`} />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && !isActive && (
                      <span className="text-[0.65rem] bg-white/10 text-white/80 px-2 py-0.5 rounded-full font-medium">
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="h-4 w-4 text-white/80" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer with Logout */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-brand-gray-mid hover:text-white hover:bg-brand-red/20 transition-all border border-white/10"
          >
            <LogOut className="h-4 w-4 mr-2 text-brand-red" />
            Logout Account
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64 lg:ml-72 w-full min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-brand-gray-border flex items-center justify-between px-5 sm:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-brand-dark hover:text-brand-red p-1.5 rounded-lg border border-brand-gray-border"
              aria-label="Open Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-base sm:text-lg font-black text-brand-dark uppercase tracking-tight">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs font-bold text-brand-gray-mid uppercase tracking-wider bg-brand-gray-light px-3 py-1.5 rounded-md border border-brand-gray-border">
              Secure Session
            </span>
            <button
              onClick={handleLogout}
              className="text-xs font-black text-brand-gray hover:text-brand-red uppercase tracking-wider flex items-center transition-colors"
            >
              <LogOut className="h-4 w-4 mr-1 text-brand-red sm:hidden" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}