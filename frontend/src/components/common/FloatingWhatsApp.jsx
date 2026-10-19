import { useLocation } from 'react-router-dom';
import WhatsAppIcon from './WhatsAppIcon';
import { COMPANY } from '../../utils/constants';

export default function FloatingWhatsApp() {
  const location = useLocation();

  // Hide the floating WhatsApp button on product detail pages (/products/:slug)
  const isProductDetailPage = location.pathname.startsWith('/products/') && location.pathname !== '/products/';
  if (isProductDetailPage) {
    return null;
  }

  const defaultMsg = encodeURIComponent('Hello GELCO PLUS ELECTRICALS, I have an inquiry.');
  
  return (
    <a
      href={`https://wa.me/${COMPANY.whatsapp}?text=${defaultMsg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-[0_6px_20px_rgba(37,211,102,0.45)] hover:bg-[#20BA5A] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      aria-label="Chat with GELCO on WhatsApp"
    >
      <WhatsAppIcon className="h-6 w-6 sm:h-7 sm:w-7 filter drop-shadow-xs" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-3 transition-all duration-300 font-extrabold text-xs sm:text-sm tracking-wide">
        Chat on WhatsApp
      </span>
    </a>
  );
}