import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import SearchWithSuggestions from '../common/SearchWithSuggestions';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 border-b border-brand-gray-border/60 ${scrolled ? 'shadow-md py-1' : 'py-1 sm:py-2'}`}>
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-13 sm:h-16 md:h-17 gap-2 sm:gap-4">
          
          {/* Logo on Extreme Left (Enlarged) */}
          <Link to="/" className="flex items-center flex-shrink-0 gap-2 sm:gap-3 group">
            <img 
              src="/flower.png" 
              alt="GELCO Logo" 
              className="h-8 w-8 sm:h-11 sm:w-11 md:h-12 md:w-12 object-contain group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col">
              <img 
                src="/gelco_text.png" 
                alt="GELCO" 
                className="h-5 sm:h-7 md:h-8 object-contain self-start" 
              />
              <span className="block text-[0.55rem] sm:text-[0.68rem] md:text-[0.72rem] font-black text-brand-dark uppercase tracking-widest leading-none mt-0.5">
                Plus Electricals
              </span>
            </div>
          </Link>

          {/* Right Action: Search Bar with Suggestions (on Home Page) + Single Query Button */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {isHomePage && (
              <SearchWithSuggestions
                placeholder="Search name, model..."
                className="w-36 xs:w-48 sm:w-64 md:w-72 lg:w-80"
                dropdownAlign="right"
              />
            )}

            <Link
              to="/query"
              className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 bg-brand-red hover:bg-brand-red-dark text-white rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-brand-red/25 active:scale-95 flex-shrink-0"
              title="Submit a Query to Admin"
            >
              <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Query</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}