import WhatsAppIcon from './WhatsAppIcon';
import { COMPANY } from '../../utils/constants';

export default function WhatsAppButton({ 
  text = "Chat with us", 
  message = "", 
  className = "",
  variant = "official",
  iconClassName = "w-4 h-4 sm:w-5 sm:h-5"
}) {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${COMPANY.whatsapp}?text=${encodedMessage}`;
  
  let bgStyles = "bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-xs hover:shadow-[0_8px_20px_rgba(37,211,102,0.3)]";
  if (variant === "red") {
    bgStyles = "bg-brand-red hover:bg-brand-red-dark text-white shadow-xs hover:shadow-[0_8px_20px_rgba(227,30,36,0.3)]";
  } else if (variant === "dark") {
    bgStyles = "bg-brand-dark hover:bg-black text-white shadow-xs hover:shadow-md";
  } else if (variant === "outline") {
    bgStyles = "border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white";
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-200 uppercase tracking-wider active:scale-[0.98] ${bgStyles} ${className}`}
    >
      <WhatsAppIcon className={`flex-shrink-0 ${iconClassName}`} />
      <span>{text}</span>
    </a>
  );
}