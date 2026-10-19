export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-gray-light border-t-brand-red mb-4"></div>
      <p className="text-brand-gray font-medium uppercase tracking-widest text-sm">{text}</p>
    </div>
  );
}