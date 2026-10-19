import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import WhatsAppIcon from '../common/WhatsAppIcon';
import { COMPANY } from '../../utils/constants';

export default function ProductCard({ product }) {
  const { name, model, shortDescription, category, slug, images } = product;
  const catName = category?.name || category || 'Electrical';
  const productUrl = `${window.location.origin}/products/${slug}`;
  
  const whatsappMsg = `Hello GELCO PLUS ELECTRICALS,\n\nI am interested in:\nProduct: ${name}\nModel: ${model || 'N/A'}\n\nPlease share price, specifications, and availability.\n\nLink: ${productUrl}`;

  const imageUrl = images && images.length > 0 ? images[0].url : null;
  const whatsappUrl = `https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-gray-200/80 hover:border-brand-red/40 shadow-xs hover:shadow-[0_12px_28px_-6px_rgba(227,30,36,0.14)] transition-all duration-300 overflow-hidden h-full">
      {/* Top Red Gradient Indicator (Reveals on Hover) */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-red via-red-500 to-brand-red opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

      {/* Product Image Area */}
      <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-[#F9FAFB] via-[#FCFCFD] to-white p-3 sm:p-5 flex items-center justify-center overflow-hidden border-b border-gray-100">
        {/* Floating Category Pill Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-xs border border-gray-200/80 shadow-2xs max-w-[70%]">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red flex-shrink-0" />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-brand-dark truncate">
            {catName}
          </span>
        </div>

        {/* Multi-Image Counter Pill */}
        {images && images.length > 1 && (
          <div 
            className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold shadow-2xs"
            title={`${images.length} images available`}
          >
            <Layers className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            <span>{images.length}</span>
          </div>
        )}

        <Link to={`/products/${slug}`} className="w-full h-full flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className="max-h-full max-w-full object-contain filter drop-shadow-xs group-hover:scale-105 transition-transform duration-500 ease-out" 
            />
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-2">
              <img src="/flower.png" alt="GELCO" className="w-12 h-12 sm:w-16 sm:h-16 object-contain opacity-25 group-hover:opacity-40 transition-opacity" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gray-mid mt-1">Gelco Equipment</span>
            </div>
          )}
        </Link>
      </div>
      
      {/* Product Information Body */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
        {/* Model Spec Badge */}
        {model && (
          <div className="mb-1.5 sm:mb-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] sm:text-[11px] font-mono font-bold bg-gray-100 text-brand-gray border border-gray-200/70 group-hover:bg-brand-red/5 group-hover:border-brand-red/20 group-hover:text-brand-red transition-colors">
              <span className="text-brand-gray-mid font-semibold text-[8px] sm:text-[9px]">MODEL:</span>
              <span className="truncate">{model}</span>
            </span>
          </div>
        )}

        {/* Product Title */}
        <Link to={`/products/${slug}`} className="block group/title mb-1.5">
          <h3 className="text-brand-dark font-black text-xs sm:text-sm md:text-base leading-snug line-clamp-2 group-hover/title:text-brand-red group-hover:text-brand-red transition-colors min-h-[2rem] sm:min-h-[2.5rem]">
            {name}
          </h3>
        </Link>

        {/* Short Description (Visible on screens above mobile) */}
        <p className="text-brand-gray-mid text-[11px] sm:text-xs leading-relaxed line-clamp-2 mb-3 hidden sm:block flex-grow min-h-[2rem]">
          {shortDescription || "Engineered for robust electrical safety, overload protection, and reliable industrial performance."}
        </p>
        
        {/* Card Action Buttons (Gelco Brand Red Instead of Green!) */}
        <div className="mt-auto pt-2.5 sm:pt-3 border-t border-gray-100 flex flex-col gap-1.5 sm:gap-2">
          {/* Primary Action: Enquire in Brand Red */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-brand-red hover:bg-brand-red-dark text-white font-black text-[10px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md hover:shadow-brand-red/25 transition-all duration-200 active:scale-[0.98]"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Enquire Now</span>
          </a>

          {/* Secondary Action: View Details */}
          <Link 
            to={`/products/${slug}`} 
            className="w-full py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-gray-300 hover:border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1 text-center"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}