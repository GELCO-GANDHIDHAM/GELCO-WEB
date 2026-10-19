export default function PlaceholderPage({ title = "Phase 1 Complete" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center min-h-[60vh]">
      <div className="w-20 h-20 bg-brand-gray-light rounded-full flex items-center justify-center mb-6">
        <span className="text-brand-red font-black text-3xl italic">G</span>
      </div>
      <h1 className="text-3xl font-extrabold text-brand-dark uppercase tracking-tight mb-4">
        {title}
      </h1>
      <p className="text-brand-gray max-w-md mx-auto">
        This page will be implemented in upcoming phases. Return to the homepage to see the Phase 3 design system in action.
      </p>
    </div>
  );
}