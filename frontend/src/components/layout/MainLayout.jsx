import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingWhatsApp from '../common/FloatingWhatsApp';

export default function MainLayout() {
  const location = useLocation();
  // Hide footer on /products catalog listing and /products/:slug detail pages
  const isProductsRoute = location.pathname.startsWith('/products');
  // Hide floating WhatsApp button on product detail pages
  const isProductDetailPage = location.pathname.startsWith('/products/') && location.pathname !== '/products/';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-[58px] sm:pt-[70px] md:pt-[76px]">
        <Outlet />
      </main>
      {!isProductsRoute && <Footer />}
      {!isProductDetailPage && <FloatingWhatsApp />}
    </div>
  );
}