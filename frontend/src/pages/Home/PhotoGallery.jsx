import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../../services/api';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const FALLBACK_PHOTOS = [
  {
    _id: '1',
    title: 'Smart Industrial Switchgear & Controllers',
    category: 'Engineering Showcase',
    image: { url: '/images/showcase-pc.png' },
  },
  {
    _id: '2',
    title: 'Complete Industrial & Agricultural Range',
    category: 'Product Lineup',
    image: { url: '/images/showcase-mobile.png' },
  },
  {
    _id: '3',
    title: 'Motor Starters & Control Panels',
    category: 'Heavy-Duty Starters',
    image: { url: 'https://res.cloudinary.com/cazqwizg/image/upload/v1792409890/gelco_products/zxhfvl9tbnxnn2x76xqh.jpg' },
  },
  {
    _id: '4',
    title: 'High-Sensitivity Earth Leakage Circuit Breakers',
    category: 'ELCB Protection',
    image: { url: 'https://res.cloudinary.com/cazqwizg/image/upload/v1792409887/gelco_products/yvja98elpsgvfjisapvj.png' },
  },
  {
    _id: '5',
    title: 'Electronic Speed Regulators & Automation',
    category: 'Controllers & Timers',
    image: { url: 'https://res.cloudinary.com/cazqwizg/image/upload/v1792409889/gelco_products/lttfvrgnw0lphnaudmau.png' },
  },
  {
    _id: '6',
    title: 'Automatic Voltage Stabilizers & Relays',
    category: 'Power Protection',
    image: { url: 'https://res.cloudinary.com/cazqwizg/image/upload/v1792409888/gelco_products/ixpxvzuodelxj3xd8aue.png' },
  },
];

export default function PhotoGallery() {
  const [photos, setPhotos] = useState(FALLBACK_PHOTOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Touch gesture state for finger swipe on mobile
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // Fetch live photos from database
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data?.data && res.data.data.length > 0) {
          setPhotos(res.data.data);
        }
      } catch (err) {
        // Fallback to static photos if api fails
        console.error('Failed to load gallery photos', err);
      }
    };
    fetchGallery();
  }, []);

  const totalPhotos = photos.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPhotos);
  }, [totalPhotos]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  }, [totalPhotos]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto slide every 5 seconds (5000ms)
  useEffect(() => {
    if (totalPhotos <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, totalPhotos, isPaused, currentIndex]);

  // Touch handlers for mobile finger swiping
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    const threshold = 50; // min 50px swipe
    if (diff > threshold) {
      // Swiped Left -> Next
      nextSlide();
    } else if (diff < -threshold) {
      // Swiped Right -> Prev
      prevSlide();
    }
  };

  if (!photos || photos.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white border-y border-brand-gray-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-brand-dark uppercase tracking-tight">
            Photo Gallery
          </h2>
          <div className="h-1 w-16 sm:w-20 bg-brand-red mt-1" />
        </div>

        {/* --- SINGLE FRAME SLIDER --- */}
        <div 
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-brand-gray-border shadow-lg p-2 sm:p-3 select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Inner Viewport Frame */}
          <div className="relative w-full h-[260px] sm:h-[380px] md:h-[480px] lg:h-[540px] rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center">
            
            {/* Sliding Track */}
            <div
              className="flex w-full h-full transition-transform duration-700 ease-out will-change-transform"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {photos.map((item, index) => {
                const imgUrl = item.image?.url || item.url;
                return (
                  <div
                    key={item._id || index}
                    className="min-w-full h-full relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-900 to-black"
                  >
                    <img
                      src={imgUrl}
                      alt={item.title || `Gallery Slide ${index + 1}`}
                      className="w-full h-full object-contain md:object-cover select-none pointer-events-none"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />

                    {/* Gradient Overlay for Title & Category */}
                    {(item.title || item.category) && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 sm:p-6 md:p-8 flex flex-col justify-end pointer-events-none">
                        {item.category && (
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-brand-red drop-shadow-sm mb-1 block">
                            {item.category}
                          </span>
                        )}
                        {item.title && (
                          <h3 className="text-white font-extrabold text-sm sm:text-lg md:text-2xl drop-shadow-md leading-tight line-clamp-2 max-w-3xl">
                            {item.title}
                          </h3>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            {totalPhotos > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-brand-red text-white flex items-center justify-center backdrop-blur-xs border border-white/20 transition-all shadow-md active:scale-90"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-brand-red text-white flex items-center justify-center backdrop-blur-xs border border-white/20 transition-all shadow-md active:scale-90"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}

            {/* Top Right 5s Autoplay / Pause Badge */}
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-white text-[10px] sm:text-xs font-bold border border-white/15 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
              <span>5s Auto</span>
            </div>

            {/* Bottom Dots Indicator */}
            {totalPhotos > 1 && (
              <div className="absolute bottom-3 sm:bottom-5 inset-x-0 z-20 flex items-center justify-center gap-1.5 sm:gap-2">
                {photos.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => goToSlide(dotIdx)}
                    className={`h-2 transition-all duration-300 rounded-full ${
                      currentIndex === dotIdx
                        ? 'w-7 sm:w-9 bg-brand-red shadow-sm'
                        : 'w-2 bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
