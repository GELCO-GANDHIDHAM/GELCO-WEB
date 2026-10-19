import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { COMPANY } from '../../utils/constants';
import SectionHeading from '../../components/common/SectionHeading';

export default function Contact() {
  return (
    <div className="bg-brand-gray-light min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Get in Touch" 
          subtitle="We are here to assist you with any questions about our products and solutions." 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-gray-border flex flex-col items-center text-center group hover:border-brand-red transition-colors">
              <div className="w-16 h-16 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-red group-hover:text-white transition-colors">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark uppercase tracking-wide mb-2">Visit Us</h3>
              <p className="text-brand-gray font-medium">{COMPANY.address}</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-gray-border flex flex-col items-center text-center group hover:border-brand-red transition-colors">
              <div className="w-16 h-16 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-red group-hover:text-white transition-colors">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark uppercase tracking-wide mb-2">Call Us</h3>
              <p className="text-brand-gray font-medium mb-1">{COMPANY.phoneDisplay}</p>
              <p className="text-brand-gray-mid text-sm">Mon-Sat: 9:00 AM - 6:00 PM</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-gray-border flex flex-col items-center text-center group hover:border-brand-red transition-colors">
              <div className="w-16 h-16 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-red group-hover:text-white transition-colors">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-brand-dark uppercase tracking-wide mb-2">Email Us</h3>
              <a href={`mailto:${COMPANY.email}`} className="text-brand-gray font-medium hover:text-brand-red transition-colors">{COMPANY.email}</a>
            </div>
          </div>
          
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-brand-gray-border flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-2xl font-black text-brand-dark uppercase tracking-tight mb-2">Instant Support</h3>
                <p className="text-brand-gray font-medium">Get immediate assistance from our technical team on WhatsApp.</p>
              </div>
              <a 
                href={`https://wa.me/${COMPANY.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center justify-center px-8 py-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-[#25D366] hover:bg-[#128C7E] transition-colors uppercase tracking-wide w-full sm:w-auto"
              >
                <MessageCircle className="mr-2 h-6 w-6" /> WhatsApp Us
              </a>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-brand-gray-border overflow-hidden flex-grow relative min-h-[400px]">
              <div className="absolute inset-0 bg-brand-gray-light flex flex-col items-center justify-center">
                <MapPin className="h-16 w-16 text-brand-gray-mid mb-4 opacity-50" />
                <p className="text-brand-gray-mid font-bold uppercase tracking-widest">Interactive Map</p>
                <p className="text-brand-gray-border font-medium text-sm mt-2">{COMPANY.city}</p>
                <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(COMPANY.city)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  style={{ border: 0, position: 'absolute', top: 0, left: 0, opacity: 0.8 }} 
                  allowFullScreen="" 
                  aria-hidden="false" 
                  tabIndex="0"
                  title="Company Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}