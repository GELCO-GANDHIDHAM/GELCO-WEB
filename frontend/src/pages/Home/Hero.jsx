import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { COMPANY } from '../../utils/constants';

export default function Hero() {
  return (
    <section className="bg-[#FAF9F6] relative overflow-hidden w-full">
      {/* Red accent strip on extreme left */}
      <div className="absolute top-0 left-0 w-2.5 md:w-3.5 h-full bg-brand-red z-30 pointer-events-none"></div>

      {/* Desktop / Laptop Full-Width Banner */}
      <div className="hidden lg:block relative w-full overflow-hidden bg-white border-b border-brand-gray-border">
        {/* Full screen width banner image */}
        <div className="w-full overflow-hidden">
          <img
            src="/images/hero-showcase.png"
            alt="GELCO Industrial Controls Showcase"
            className="w-full h-auto object-cover select-none block"
          />
        </div>

        {/* Text overlay on the left 38% empty space */}
        <div className="absolute inset-y-0 left-0 w-[42%] xl:w-[38%] flex flex-col justify-center pl-10 md:pl-16 lg:pl-20 xl:pl-28 pr-4 z-10">
          <h1 className="text-2xl lg:text-3xl xl:text-[2.6rem] 2xl:text-5xl font-black text-brand-dark leading-[1.08] uppercase tracking-tight font-sans">
            TOUGH ON <br />
            <span className="text-brand-red">FLUCTUATIONS.</span> <br />
            SMART ON <br />
            <span className="text-brand-red">PROTECTION.</span>
          </h1>

          <p className="mt-3 xl:mt-5 text-xs lg:text-sm xl:text-base text-brand-gray font-medium leading-relaxed max-w-md">
            Reliable Electrical Solutions for Every Requirement. Built to handle voltage drops, overloads, and phase failures — <strong className="text-brand-red font-bold">Gelco</strong> keeps your systems running safely, every day.
          </p>

          <div className="mt-5 xl:mt-8 flex flex-wrap gap-3 items-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-5 py-2.5 xl:px-7 xl:py-3.5 bg-brand-red hover:bg-brand-red-dark text-white font-black uppercase text-xs xl:text-sm rounded-md shadow-md transition-all hover:-translate-y-0.5"
            >
              EXPLORE PRODUCTS <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>

            <a
              href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hello GELCO PLUS ELECTRICALS, I am interested in your products.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2.5 xl:px-6 xl:py-3 bg-white border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-black uppercase text-xs xl:text-sm rounded-md transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <MessageCircle className="mr-1.5 h-4 w-4" /> CHAT WITH US 👋
            </a>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Full-Width Layout */}
      <div className="block lg:hidden w-full px-5 py-8 sm:py-10">
        <div className="text-left mb-6 pl-2">
          <h1 className="text-3xl sm:text-4xl font-black text-brand-dark leading-[1.08] uppercase tracking-tight">
            TOUGH ON <br />
            <span className="text-brand-red">FLUCTUATIONS.</span> <br />
            SMART ON <br />
            <span className="text-brand-red">PROTECTION.</span>
          </h1>
        </div>

        {/* Full width image for mobile */}
        <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-brand-gray-border bg-white p-1.5">
          <div className="w-full overflow-hidden rounded-xl">
            <img
              src="/images/hero-showcase.png"
              alt="GELCO Industrial Controls Showcase"
              className="w-full h-auto object-cover block select-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}