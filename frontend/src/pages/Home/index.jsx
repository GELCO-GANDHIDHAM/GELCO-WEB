import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import PhotoGallery from './PhotoGallery';
import ProductCard from '../../components/cards/ProductCard';
import api from '../../services/api';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const res = await api.get('/products', { params: { limit: 12 } });
        // Filter out dummy/example items if any
        const filtered = (res.data.data || []).filter(
          (p) => !p.name.toLowerCase().includes('example')
        );
        setProducts(filtered);
      } catch (err) {
        console.error('Failed to load home products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  const firstFourProducts = products.slice(0, 4);
  const secondFourProducts = products.slice(4, 8);

  return (
    <div className="bg-[#FAF9F6]">
      {/* 1. Hero Showcase Banner */}
      <Hero />

      {/* 2. First 4 Products (Featured Products) */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-dark uppercase tracking-tight">
              Featured Products
            </h2>
            <div className="h-1 w-16 sm:w-20 bg-brand-red mt-1" />
          </div>

          {/* Products Grid: 4 Products (2 on mobile, 4 on desktop) */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-4 border border-gray-200 animate-pulse h-72 flex flex-col justify-between">
                  <div className="bg-gray-200 h-36 rounded-xl w-full" />
                  <div className="space-y-2 mt-3">
                    <div className="bg-gray-200 h-4 rounded w-3/4" />
                    <div className="bg-gray-200 h-3 rounded w-1/2" />
                  </div>
                  <div className="bg-gray-200 h-8 rounded-lg mt-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {firstFourProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Photo Gallery */}
      <PhotoGallery />

      {/* 4. Second 4 Products (More Products) */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-dark uppercase tracking-tight">
              More Products
            </h2>
            <div className="h-1 w-16 sm:w-20 bg-brand-red mt-1" />
          </div>

          {/* Products Grid: Next 4 Products (2 on mobile, 4 on desktop) */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-4 border border-gray-200 animate-pulse h-72 flex flex-col justify-between">
                  <div className="bg-gray-200 h-36 rounded-xl w-full" />
                  <div className="space-y-2 mt-3">
                    <div className="bg-gray-200 h-4 rounded w-3/4" />
                    <div className="bg-gray-200 h-3 rounded w-1/2" />
                  </div>
                  <div className="bg-gray-200 h-8 rounded-lg mt-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {secondFourProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Single Button: Explore More Products (No Bigger Div) */}
          <div className="mt-10 sm:mt-14 text-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-3.5 sm:px-10 sm:py-4 bg-brand-red hover:bg-brand-red-dark text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md hover:shadow-brand-red/30 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <span>Explore More Products</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}