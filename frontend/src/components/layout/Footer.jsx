import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Lock, Mail, ExternalLink, MessageCircle } from 'lucide-react';
import { COMPANY } from '../../utils/constants';
import api from '../../services/api';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState({
    address: COMPANY.address,
    city: COMPANY.city,
    locationUrl: 'https://maps.google.com/?q=Sector+8+Gandhidham+Gujarat',
    email: COMPANY.email,
    phones: [
      { number: COMPANY.phone, label: 'Primary', isWhatsApp: true }
    ],
    tagline: COMPANY.tagline,
  });

  useEffect(() => {
    let isMounted = true;
    api.get('/settings')
      .then((res) => {
        if (isMounted && res.data?.data) {
          setSettings(res.data.data);
        }
      })
      .catch((err) => {
        // Graceful fallback to default COMPANY constants
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <footer className="relative bg-[#0F0F11] text-white border-t border-white/10 overflow-hidden select-none">
      {/* Top Subtle Red Gradient Edge */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-90" />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-20 bg-brand-red/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Main Grid: Exact Past Content, Redesigned & Dynamic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          
          {/* 1. Brand Presentation (5 Cols) */}
          <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-2xs">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <img 
                  src="/flower.png" 
                  alt="GELCO Logo" 
                  className="h-8 w-8 object-contain bg-white rounded-xl p-1 shadow-xs" 
                />
                <div className="flex flex-col">
                  <img 
                    src="/gelco_text.png" 
                    alt="GELCO" 
                    className="h-4 sm:h-5 object-contain self-start brightness-0 invert" 
                  />
                  <span className="block text-[8px] sm:text-[9px] font-black text-brand-red uppercase tracking-[0.2em] leading-none mt-0.5">
                    Plus Electricals
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
                {settings.tagline || COMPANY.tagline}.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              Industrial Grade Electricals
            </div>
          </div>

          {/* 2. Location (4 Cols) */}
          <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] flex items-start gap-3.5 hover:border-brand-red/30 transition-all duration-300 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center flex-shrink-0 text-brand-red mt-0.5">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block font-black uppercase tracking-wider text-white text-[11px] mb-1">
                Location
              </span>
              <p className="text-gray-400 text-xs leading-relaxed">
                {settings.address}{settings.city ? `, ${settings.city}` : ''}
              </p>
              {settings.locationUrl && (
                <a
                  href={settings.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-red hover:underline mt-1.5 transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* 3. Contact (3 Cols) with Multiple Mobile Numbers */}
          <div className="lg:col-span-3 p-4 sm:p-5 rounded-2xl bg-white/[0.025] border border-white/[0.08] flex items-start gap-3.5 hover:border-brand-red/30 transition-all duration-300 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center flex-shrink-0 text-brand-red mt-0.5">
              <Phone className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block font-black uppercase tracking-wider text-white text-[11px] mb-1">
                Contact
              </span>

              {/* Multiple Mobile Numbers */}
              <div className="space-y-1 mb-1.5">
                {(settings.phones && settings.phones.length > 0 ? settings.phones : [{ number: COMPANY.phone }]).map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 flex-wrap">
                    <a
                      href={`tel:${p.number}`}
                      className="font-mono font-bold text-white hover:text-brand-red transition-colors text-xs"
                      title={`Call ${p.number}`}
                    >
                      {p.number}
                    </a>
                    {p.label && (
                      <span className="text-[10px] text-gray-400 font-medium">({p.label})</span>
                    )}
                    {p.isWhatsApp && (
                      <a
                        href={`https://wa.me/91${p.number.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 ml-0.5"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3 inline" />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              {settings.email && (
                <a 
                  href={`mailto:${settings.email}`} 
                  className="text-gray-400 hover:text-white transition-colors text-[11px] block truncate"
                  title={settings.email}
                >
                  {settings.email}
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Made by Bhavy, Admin */}
        <div className="border-t border-white/[0.08] mt-6 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          {/* Copyright */}
          <p className="text-center sm:text-left text-[11px]">
            &copy; {currentYear} <span className="text-white font-bold">{COMPANY.name}</span>. All rights reserved.
          </p>

          {/* Single Signature: Made by Bhavy with Clickable Email */}
          <a
            href="mailto:bhavypatel101005@gmail.com"
            title="Email Bhavy: bhavypatel101005@gmail.com"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-brand-red/40 text-xs shadow-2xs transition-all duration-200 group cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red group-hover:scale-125 transition-transform animate-pulse" />
            <span className="text-gray-300 text-[11px]">
              Made by <strong className="text-white group-hover:text-brand-red font-black tracking-wide transition-colors">Bhavy</strong>
            </span>
            <span className="text-gray-400 group-hover:text-gray-200 text-[10.5px] font-mono transition-colors border-l border-white/10 pl-1.5 ml-0.5 inline-flex items-center gap-1">
              <Mail className="w-3 h-3 text-brand-red/80 group-hover:text-brand-red" />
              <span>bhavypatel101005@gmail.com</span>
            </span>
          </a>

          {/* Location & Admin Login */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-gray-500 hidden md:inline font-mono">
              Gandhidham, Gujarat
            </span>
            <Link 
              to="/admin/login" 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-brand-red text-gray-400 hover:text-white border border-white/10 hover:border-brand-red text-[11px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-95"
            >
              <Lock className="h-3 w-3 text-brand-red group-hover:text-white" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}