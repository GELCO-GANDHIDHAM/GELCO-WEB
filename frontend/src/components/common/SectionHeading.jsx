export default function SectionHeading({ title, subtitle, centered = true }) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
      <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark uppercase tracking-tight relative inline-block">
        {title}
        <span className={`absolute -bottom-3 h-1 bg-brand-red w-1/2 ${centered ? 'left-1/4' : 'left-0'}`}></span>
      </h2>
      {subtitle && (
        <p className="mt-6 text-lg text-brand-gray max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}