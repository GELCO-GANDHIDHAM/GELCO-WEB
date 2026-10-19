import { ShieldCheck, Zap, Award } from 'lucide-react';
import { COMPANY } from '../../utils/constants';

export default function About() {
  const perks = [
    {
      icon: ShieldCheck,
      title: "Engineered For Heavy Duty",
      text: "Withstands voltage drops, single phasing, and extreme thermal overloads."
    },
    {
      icon: Zap,
      title: "Smart Automation",
      text: "Precision automatic timers, water controllers, and auto-photo switches."
    },
    {
      icon: Award,
      title: "40+ Years of Trust",
      text: "Preferred choice for farmers, industrial workshops, and residential buildings."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAF9F6] relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          {/* Left Visual Badge */}
          <div className="lg:w-5/12 w-full flex justify-center">
            <div className="bg-white border-2 border-brand-gray-border rounded-3xl p-8 sm:p-10 shadow-xl max-w-sm w-full text-center relative overflow-hidden group hover:border-brand-red/50 transition-all duration-300">
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md p-3 border border-gray-100">
                <img src="/flower.png" alt="GELCO" className="w-full h-full object-contain" />
              </div>
              <img src="/gelco_text.png" alt="GELCO" className="h-7 object-contain mx-auto mb-3" />
              <h3 className="text-xl font-black text-brand-dark uppercase tracking-tight">Legacy of Quality</h3>
              <p className="text-brand-red font-black text-sm uppercase tracking-wider mt-1">40+ Years of Innovation</p>
              <div className="mt-4 pt-4 border-t border-brand-gray-border text-xs text-brand-gray font-medium">
                {COMPANY.city}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:w-7/12 w-full">
            <span className="text-xs font-black tracking-widest text-brand-red uppercase bg-brand-red/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Why Gelco
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-dark uppercase tracking-tight leading-tight mb-4">
              Protecting What Powers Your World
            </h2>
            <p className="text-brand-gray text-base font-medium leading-relaxed mb-8 max-w-xl">
              From robust motor control panels to intelligent voltage stabilizers, <strong className="text-brand-dark font-bold">GELCO PLUS ELECTRICALS</strong> engineers products specifically built to endure fluctuating power conditions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {perks.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="bg-white border border-brand-gray-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center text-brand-red mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-brand-dark text-sm uppercase tracking-wide mb-1">{p.title}</h4>
                    <p className="text-brand-gray text-xs leading-relaxed font-medium">{p.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}