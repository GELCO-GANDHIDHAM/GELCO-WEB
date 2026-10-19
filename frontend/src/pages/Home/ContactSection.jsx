import { Link } from 'react-router-dom';
import { COMPANY } from '../../utils/constants';

export default function ContactSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 p-10 md:p-12 text-white flex flex-col justify-center">
            <h2 className="text-3xl font-black uppercase mb-4">Need Technical Help?</h2>
            <p className="text-brand-gray-mid mb-8 font-medium">
              Not sure which product suits your requirement? Submit a query and our experts will guide you.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/query" className="inline-block px-7 py-3 bg-brand-red text-white font-black uppercase text-sm rounded hover:bg-brand-red-dark transition-colors text-center shadow-md">
                Submit A Query
              </Link>
              <a 
                href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hello GELCO PLUS ELECTRICALS, I need technical assistance regarding product selection.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 border-2 border-white/40 text-white hover:bg-white hover:text-brand-dark font-black uppercase text-sm rounded transition-colors text-center"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>
          <div className="md:w-1/2 bg-brand-gray-light p-10 md:p-12 flex flex-col justify-center border-l-4 border-brand-red">
            <h3 className="text-xl font-bold text-brand-dark uppercase tracking-wide mb-6">Contact Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-brand-gray-mid uppercase font-bold tracking-wider mb-1">Address</p>
                <p className="text-brand-dark font-medium leading-relaxed">{COMPANY.address}</p>
              </div>
              <div>
                <p className="text-sm text-brand-gray-mid uppercase font-bold tracking-wider mb-1">Phone</p>
                <p className="text-brand-dark font-medium">{COMPANY.phoneDisplay}</p>
              </div>
              <div>
                <p className="text-sm text-brand-gray-mid uppercase font-bold tracking-wider mb-1">Email</p>
                <p className="text-brand-dark font-medium">{COMPANY.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}