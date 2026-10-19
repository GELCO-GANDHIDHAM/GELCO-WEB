import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ message = "Something went wrong. Please try again.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-brand-red" />
      </div>
      <h3 className="text-xl font-bold text-brand-dark uppercase mb-2">Error Occurred</h3>
      <p className="text-brand-gray mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-6 py-2 bg-brand-red text-white font-bold rounded uppercase tracking-wide hover:bg-brand-red-dark transition-colors">
          Try Again
        </button>
      )}
    </div>
  );
}