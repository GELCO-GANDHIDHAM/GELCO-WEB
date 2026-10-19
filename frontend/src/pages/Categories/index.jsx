import { useState, useEffect } from 'react';
import api from '../../services/api';
import CategoryCard from '../../components/cards/CategoryCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-brand-gray-light min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-brand-dark uppercase tracking-tight mb-4">Product Categories</h1>
          <div className="h-1 w-20 bg-brand-red mx-auto mb-6"></div>
          <p className="text-brand-gray text-lg max-w-2xl mx-auto">Browse our extensive range of electrical protection and control solutions.</p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading categories..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : categories.length === 0 ? (
          <EmptyState title="No Categories" message="No product categories are currently available." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {categories.map(cat => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}