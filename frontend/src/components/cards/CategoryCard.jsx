import { Link } from 'react-router-dom';

export default function CategoryCard({ category, title, imagePlaceholder }) {
  const name = category?.name || title;
  const slug = category?.slug || title.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '');
  const imageUrl = category?.image?.url;
  
  return (
    <Link to={`/category/${slug}`} className="group block bg-white border border-brand-gray-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="aspect-[4/3] w-full bg-brand-gray-light flex items-center justify-center p-3 sm:p-6 relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="max-w-full max-h-full object-contain relative z-20 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <img src="/flower.png" alt="GELCO" className="w-16 h-16 sm:w-24 sm:h-24 object-contain" />
            </div>
            <div className="relative z-10 w-full h-full border-2 border-dashed border-brand-gray-mid/30 rounded flex items-center justify-center text-brand-gray-mid font-bold text-xs sm:text-sm text-center px-1">
              {name}
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-brand-red opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-30"></div>
      </div>
      <div className="p-2.5 sm:p-4 border-t border-brand-gray-border text-center group-hover:bg-brand-red transition-colors duration-300">
        <h3 className="text-brand-dark group-hover:text-white font-bold uppercase tracking-wide text-xs sm:text-base transition-colors duration-300 truncate">
          {name}
        </h3>
      </div>
    </Link>
  );
}