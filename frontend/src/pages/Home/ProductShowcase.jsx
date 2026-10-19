import { Link } from 'react-router-dom';
import { Shield, Zap, Gauge, ArrowRight, MessageCircle } from 'lucide-react';
import { COMPANY } from '../../utils/constants';

export default function ProductShowcase() {
  const highlights = [
    { title: "Motor Starters & Panels", desc: "Heavy-duty industrial & agricultural motor protection", icon: Zap },
    { title: "Smart Voltage Stabilizers", desc: "High & low cut-off protection with digital accuracy", icon: Shield },
    { title: "Digital Meters & Controllers", desc: "Auto photo switches, timers & phase failure relays", icon: Gauge },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-y border-brand-gray-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black tracking-widest text-brand-red uppercase bg-brand-red/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Product Spectrum
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-brand-dark uppercase tracking-tight">
            Complete Electrical Protection Range
          </h2>
        </div>

        {/* 3 Visual Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-brand-gray-light border border-brand-gray-border rounded-2xl p-6 hover:border-brand-red/40 hover:shadow-lg transition-all duration-300 flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-red border border-brand-gray-border shadow-sm flex-shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-brand-dark text-base uppercase tracking-wide">{item.title}</h3>
                  <p className="text-brand-gray text-xs sm:text-sm mt-1 font-medium">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Showcase Banner Display */}
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-brand-gray-border bg-gradient-to-b from-gray-50 to-white p-3 md:p-6">
          {/* PC Landscape Showcase */}
          <div className="hidden md:block">
            <img
              src="/images/showcase-pc.png"
              alt="GELCO Full Product Lineup"
              className="w-full h-auto object-cover rounded-2xl shadow-sm select-none"
            />
          </div>

          {/* Mobile Display */}
          <div className="block md:hidden">
            <img
              src="/images/showcase-mobile.png"
              alt="GELCO Full Product Lineup"
              className="w-full h-auto object-contain rounded-xl select-none"
            />
          </div>
        </div>

        {/* Bottom CTA Actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 bg-brand-red hover:bg-brand-red-dark text-white font-black text-sm uppercase rounded-md shadow-md transition-colors"
          >
            Explore Catalog <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <a
            href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hello GELCO PLUS ELECTRICALS, please share product pricing and catalog.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-black text-sm uppercase rounded-md transition-colors"
          >
            <MessageCircle className="mr-2 h-4 w-4" /> Instant WhatsApp Inquiry
          </a>
        </div>

      </div>
    </section>
  );
}
