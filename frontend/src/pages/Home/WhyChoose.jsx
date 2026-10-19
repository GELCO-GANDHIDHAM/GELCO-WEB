import SectionHeading from '../../components/common/SectionHeading';

export default function WhyChoose() {
  const reasons = [
    { title: "Voltage Drop Protection", icon: "⚡" },
    { title: "Overload Protection", icon: "⏱️" },
    { title: "Phase Failure Protection", icon: "⚠️" },
    { title: "Built For Reliability", icon: "🛡️" },
  ];

  return (
    <section className="py-20 bg-brand-red text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">Why Choose GELCO?</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto font-medium">Uncompromising quality standards to ensure your electrical systems remain protected under all conditions.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {reasons.map((r, i) => (
            <div key={i} className="text-center">
              <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center text-3xl mb-4 shadow-lg text-brand-red border-4 border-brand-red-dark">
                {r.icon}
              </div>
              <h4 className="font-bold uppercase text-sm tracking-wider">{r.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}