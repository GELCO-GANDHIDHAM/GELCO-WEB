import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-[#FAF9F6] relative overflow-hidden w-full">
      {/* Red accent strip on extreme left */}
      <div className="absolute top-0 left-0 w-1.5 sm:w-2.5 md:w-3.5 h-full bg-brand-red z-30 pointer-events-none"></div>

      {/* Unified Full-Width Banner for PC and Mobile */}
      <div className="relative w-full overflow-hidden bg-white border-b border-brand-gray-border">
        {/* Full width showcase banner image */}
        <div className="w-full overflow-hidden">
          <img
            src="/images/hero-showcase.png"
            alt="GELCO Industrial Controls Showcase"
            className="w-full h-auto object-cover select-none block"
          />
        </div>

        {/* Left side overlay: Bold text only and Explore button only */}
        <div className="absolute inset-y-0 left-0 w-[47%] sm:w-[43%] xl:w-[38%] flex flex-col justify-center pl-3.5 min-[400px]:pl-5 sm:pl-10 md:pl-14 lg:pl-20 xl:pl-28 pr-2 z-10">
          <div className="font-sans select-none tracking-tight">
            <span className="block text-[13px] min-[370px]:text-[15px] min-[420px]:text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-brand-dark leading-none">
              Powerful
            </span>
            <span className="block text-[22px] min-[370px]:text-[26px] min-[420px]:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem] 2xl:text-8xl font-black text-brand-red leading-[0.92] drop-shadow-sm my-0.5 sm:my-1">
              Security
            </span>
            <span className="block text-[11px] min-[370px]:text-[13px] min-[420px]:text-sm sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-normal text-brand-dark leading-none pl-4 min-[370px]:pl-6 sm:pl-12 md:pl-16 lg:pl-20 xl:pl-24">
              always<span className="text-brand-red font-black">.</span>
            </span>
          </div>

          <div className="mt-1.5 min-[420px]:mt-2.5 sm:mt-4 md:mt-6 lg:mt-8">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-2 py-1 min-[420px]:px-3.5 min-[420px]:py-1.5 sm:px-6 sm:py-3 lg:px-7 lg:py-3.5 bg-brand-red hover:bg-brand-red-dark text-white font-black uppercase text-[9px] min-[420px]:text-[11px] sm:text-xs lg:text-sm rounded sm:rounded-md shadow-md transition-all hover:-translate-y-0.5 active:scale-95"
            >
              EXPLORE PRODUCTS <ArrowRight className="ml-1 sm:ml-1.5 h-2.5 w-2.5 min-[420px]:h-3 min-[420px]:w-3 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}