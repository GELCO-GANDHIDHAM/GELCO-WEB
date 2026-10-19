import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

/* Public Layout */
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/Products/ProductDetail';
import Categories from './pages/Categories';
import CategoryProducts from './pages/Categories/CategoryProducts';
import Query from './pages/Query';
import Contact from './pages/Contact';
import PlaceholderPage from './pages/PlaceholderPage';

/* Admin Layout */
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Admin/Login';
import Dashboard from './pages/Admin/Dashboard';
import AdminCategories from './pages/Admin/Categories';
import AdminProducts from './pages/Admin/Products';
import AdminQueries from './pages/Admin/Queries';
import AdminGallery from './pages/Admin/Gallery';
import AdminFooterSettings from './pages/Admin/FooterSettings';

/* Components */
import VideoIntro from './components/common/VideoIntro';

function App() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('introPlayed');
    if (!hasPlayed) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('introPlayed', 'true');
  };

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      {showIntro && <VideoIntro onComplete={handleIntroComplete} />}
      
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="queries" element={<AdminQueries />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="footer" element={<AdminFooterSettings />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:slug" element={<ProductDetail />} />
            <Route path="categories" element={<Categories />} />
            <Route path="category/:slug" element={<CategoryProducts />} />
            <Route path="query" element={<Query />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<PlaceholderPage title="404 - Not Found" />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;