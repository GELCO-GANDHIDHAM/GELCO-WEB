import { Link } from 'react-router-dom';
import SectionHeading from '../../components/common/SectionHeading';
import CategoryCard from '../../components/cards/CategoryCard';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

export default function Categories() {
  // Display top 8 categories on homepage
  const featuredCategories = PRODUCT_CATEGORIES.slice(0, 8);

  return (
    <section className="py-20 bg-brand-gray-light border-y border-brand-gray-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading 
          title="Product Categories" 
          subtitle="Explore our comprehensive range of electrical solutions designed for ultimate safety and performance." 
        />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mt-10">
          {featuredCategories.map((category, idx) => (
            <CategoryCard 
              key={idx} 
              title={category} 
              imagePlaceholder={category}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/categories" 
            className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-black uppercase text-sm rounded-md transition-colors shadow-sm"
          >
            View All Categories →
          </Link>
        </div>
      </div>
    </section>
  );
}