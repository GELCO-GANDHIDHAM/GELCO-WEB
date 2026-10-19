import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut } from 'lucide-react';

export default function ProductImageSlider({ 
  images = [], 
  productName = 'Product', 
  autoSlideInterval = 5500 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(false);

  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const sliderRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  const totalImages = images?.length || 0;

  // Move to next slide
  const nextSlide = useCallback(() => {
    if (totalImages <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  // Move to previous slide
  const prevSlide = useCallback(() => {
    if (totalImages <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  // Autoplay effect
  useEffect(() => {
    if (totalImages <= 1 || isHovered || isDragging || lightboxOpen) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [totalImages, isHovered, isDragging, lightboxOpen, autoSlideInterval, nextSlide]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextSlide, prevSlide]);

  // Handle Touch Gestures (Mobile / Tablet)
  const handleTouchStart = (e) => {
    if (totalImages <= 1) return;
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging || totalImages <= 1) return;
    currentXRef.current = e.touches[0].clientX;
    const diff = currentXRef.current - startXRef.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging || totalImages <= 1) return;
    const diff = currentXRef.current - startXRef.current;
    const threshold = 45;

    if (diff < -threshold) {
      nextSlide();
    } else if (diff > threshold) {
      prevSlide();
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  // Handle Mouse Drag Gestures (Desktop)
  const handleMouseDown = (e) => {
    if (totalImages <= 1) return;
    setIsDragging(true);
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
  };

  const handleMouseMove = (e) => {
    if (!isDragging || totalImages <= 1) return;
    currentXRef.current = e.clientX;
    const diff = currentXRef.current - startXRef.current;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    handleTouchEnd();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isDragging) {
      handleTouchEnd();
    }
  };

  // If no images provided
  if (!images || totalImages === 0) {
    return (
      <div className="w-full aspect-square sm:aspect-[4/3] min-h-[300px] sm:min-h-[400px] bg-gradient-to-b from-[#F9FAFC] to-[#F1F3F5] border border-gray-200 rounded-3xl flex flex-col items-center justify-center p-8 text-brand-gray-mid shadow-xs">
        <div className="relative mb-4 flex items-center justify-center">
          <img src="/flower.png" alt="GELCO" className="w-20 h-20 object-contain opacity-20 filter grayscale" />
        </div>
        <img src="/gelco_text.png" alt="GELCO" className="h-6 object-contain opacity-30 mb-2" />
        <span className="text-xs font-black uppercase tracking-wider text-brand-gray-mid">No Product Preview Available</span>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="w-full select-none">
      {/* --- MAIN STAGE CONTAINER --- */}
      <div
        ref={sliderRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="relative w-full aspect-[4/3] max-h-[220px] sm:max-h-none sm:min-h-[420px] bg-gradient-to-b from-white via-[#FAFAFA] to-[#F4F4F6] border border-gray-200/90 rounded-xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-card transition-all duration-300 group cursor-grab active:cursor-grabbing"
      >
        {/* Subtle Top Red Glow Strip */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-red/60 to-transparent z-10 opacity-70 group-hover:opacity-100 transition-opacity" />

        {/* Floating Counter Badge */}
        {totalImages > 1 && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-mono font-bold tracking-widest shadow-xs">
            <span className="text-brand-red font-black">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="opacity-40">/</span>
            <span>{String(totalImages).padStart(2, '0')}</span>
          </div>
        )}

        {/* Floating Lightbox Zoom / Maximize Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setLightboxOpen(true);
            setLightboxZoom(false);
          }}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 p-1.5 sm:p-2.5 rounded-full bg-white/90 hover:bg-white text-brand-dark hover:text-brand-red shadow-md backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 border border-gray-200/80 flex items-center justify-center group/btn"
          title="Click to expand full resolution"
          aria-label="Expand image"
        >
          <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" />
        </button>

        {/* Sliding Reel Track */}
        <div
          className="flex h-full w-full"
          style={{
            transform: isDragging
              ? `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`
              : `translateX(-${currentIndex * 100}%)`,
            transition: isDragging ? 'none' : 'transform 500ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="w-full h-full flex-shrink-0 flex items-center justify-center p-2.5 sm:p-10 relative cursor-pointer"
              onClick={() => {
                if (!isDragging && Math.abs(dragOffset) < 5) {
                  setLightboxOpen(true);
                  setLightboxZoom(false);
                }
              }}
            >
              <img
                src={img.url}
                alt={img.alt || `${productName} view ${idx + 1}`}
                className="w-full h-full max-h-[190px] sm:max-h-[380px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-105 filter drop-shadow-sm"
                loading={idx === 0 ? 'eager' : 'lazy'}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Interactive Navigation Arrows */}
        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Previous Image"
              className="absolute left-1.5 sm:left-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-brand-red text-brand-dark hover:text-white shadow-md backdrop-blur-md flex items-center justify-center transition-all duration-200 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 z-20 border border-gray-200/90"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Next Image"
              className="absolute right-1.5 sm:right-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-brand-red text-brand-dark hover:text-white shadow-md backdrop-blur-md flex items-center justify-center transition-all duration-200 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110 active:scale-95 z-20 border border-gray-200/90"
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
            </button>
          </>
        )}

        {/* Minimal Bottom Indicator Dots */}
        {totalImages > 1 && (
          <div className="absolute bottom-2 sm:bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-20 pointer-events-none">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                aria-label={`Jump to slide ${idx + 1}`}
                className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
                    ? 'w-7 bg-brand-red shadow-xs' 
                    : 'w-2 bg-gray-300/80 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- INTERACTIVE THUMBNAIL REEL (Hidden on mobile, visible on sm and up) --- */}
      {totalImages > 1 && (
        <div className="hidden sm:flex gap-2.5 sm:gap-3.5 overflow-x-auto py-3 px-1 mt-2.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {images.map((img, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Select view ${idx + 1}`}
                className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-xl p-1.5 bg-white border-2 overflow-hidden flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-brand-red ring-2 ring-brand-red/25 shadow-md scale-105'
                    : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100 hover:scale-102'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.alt || `Thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain filter drop-shadow-2xs"
                />
                {isActive && (
                  <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-brand-red shadow-xs" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* --- FULLSCREEN LIGHTBOX MODAL --- */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in">
          {/* Top Bar */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between text-white z-50">
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-brand-red uppercase">
                {String(currentIndex + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}
              </span>
              <span className="hidden sm:inline-block text-xs text-gray-300 font-semibold truncate max-w-xs">
                {productName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxZoom(!lightboxZoom)}
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={lightboxZoom ? "Reset Zoom" : "Zoom In"}
              >
                {lightboxZoom ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-brand-red text-white transition-colors"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Central High-Res Stage */}
          <div className="relative w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center p-4">
            <img
              src={currentImage.url}
              alt={currentImage.alt || productName}
              className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                lightboxZoom ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
              }`}
              onClick={() => setLightboxZoom(!lightboxZoom)}
            />

            {/* Next / Prev Buttons */}
            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-brand-red text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/15 hover:bg-brand-red text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Strip in Lightbox */}
          {totalImages > 1 && (
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 px-4 z-50 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-12 h-12 rounded-lg p-1 bg-white/10 overflow-hidden border-2 transition-all ${
                    currentIndex === idx ? 'border-brand-red scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
