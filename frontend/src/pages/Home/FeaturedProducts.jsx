import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import SectionHeading from '../../components/common/SectionHeading';
import ProductCard from '../../components/cards/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { COMPANY } from '../../utils/constants';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products?limit=4');
        setProducts(res.data.data);
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <SectionHeading title="Featured Products" centered={false} />
          <Link to="/products" className="hidden md:inline-block text-brand-red font-bold uppercase tracking-wide border-b-2 border-brand-red hover:text-brand-red-dark hover:border-brand-red-dark transition-colors pb-1 mb-12">
            View All Products →
          </Link>
        </div>
        
        {loading ? (
          <LoadingSpinner text="Loading featured products..." />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-6 bg-[#FAF9F6] rounded-2xl border border-dashed border-brand-gray-border">
            <img src="/flower.png" alt="GELCO" className="w-12 h-12 object-contain mx-auto mb-3 opacity-40" />
            <h3 className="text-lg font-bold text-brand-dark uppercase tracking-wide mb-1">Full Catalog Available On Request</h3>
            <p className="text-brand-gray text-xs sm:text-sm font-medium mb-6">Contact our sales team for instant product datasheets & quotation.</p>
            <a
              href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hello GELCO PLUS ELECTRICALS, please send product catalog and price list.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-2.5 bg-brand-red text-white text-xs font-bold uppercase rounded-md hover:bg-brand-red-dark transition-colors"
            >
              Request Catalog on WhatsApp
            </a>
          </div>
        )}
        
        <div className="mt-12 text-center md:hidden">
          <Link to="/products" className="inline-block px-8 py-3 border-2 border-brand-red text-brand-red font-bold uppercase rounded hover:bg-brand-red hover:text-white transition-colors">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}