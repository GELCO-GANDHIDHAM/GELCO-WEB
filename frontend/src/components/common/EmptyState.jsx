import { PackageX } from 'lucide-react';

export default function EmptyState({ title = "No Results Found", message = "We couldn't find what you're looking for.", actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white border border-brand-gray-border rounded-xl shadow-sm">
      <div className="w-20 h-20 bg-brand-gray-light rounded-full flex items-center justify-center mb-6">
        <PackageX className="h-10 w-10 text-brand-gray-mid" />
      </div>
      <h3 className="text-2xl font-bold text-brand-dark uppercase tracking-tight mb-2">{title}</h3>
      <p className="text-brand-gray max-w-md mx-auto mb-8">{message}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="px-8 py-3 bg-brand-dark text-white font-bold rounded uppercase tracking-wide hover:bg-black transition-colors">
          {actionText}
        </button>
      )}
    </div>
  );
}