import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/cards/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { ChevronRight } from 'lucide-react';

export default function CategoryProducts() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/category/${slug}`);
        setProducts(res.data.data);
        setCategory(res.data.category);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load category products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);

  if (loading) return <div className="py-20 min-h-screen bg-brand-gray-light"><LoadingSpinner text="Loading products..." /></div>;
  if (error) return <div className="py-20 min-h-screen bg-brand-gray-light"><ErrorState message={error} /></div>;

  return (
    <div className="bg-brand-gray-light min-h-screen pb-20">
      <div className="bg-white border-b border-brand-gray-border py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-sm font-medium text-brand-gray">
          <Link to="/" className="hover:text-brand-red">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-brand-gray-mid" />
          <Link to="/categories" className="hover:text-brand-red">Categories</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-brand-gray-mid" />
          <span className="text-brand-dark font-bold">{category?.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-brand-dark uppercase tracking-tight mb-4">{category?.name}</h1>
          <div className="h-1 w-20 bg-brand-red mb-6"></div>
          {category?.description && (
            <p className="text-brand-gray text-lg max-w-3xl">{category.description}</p>
          )}
        </div>

        {products.length === 0 ? (
          <EmptyState 
            title="No Products Yet" 
            message={`We are currently updating our catalogue for ${category?.name}.`}
            actionText="View All Products"
            onAction={() => window.location.href = '/products'}
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}