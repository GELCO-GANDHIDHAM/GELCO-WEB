import { useState, useEffect, useRef } from 'react';

// Cloudinary CDN video URLs (optimized with auto-format and auto-quality for high performance)
const CLOUDINARY_VIDEO_PC = 'https://res.cloudinary.com/cazqwizg/video/upload/q_auto,f_auto/v1792412834/gelco_videos/intro_pc.mp4';
const CLOUDINARY_VIDEO_MOBILE = 'https://res.cloudinary.com/cazqwizg/video/upload/q_auto,f_auto/v1792412837/gelco_videos/intro_mobile.mp4';

const LOCAL_VIDEO_PC = '/videos/pc.mp4';
const LOCAL_VIDEO_MOBILE = '/videos/mobile.mp4';

export default function VideoIntro({ onComplete }) {
  const [isFading, setIsFading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    
    // Failsafe: If the video takes more than 6 seconds and hasn't started playing, proceed to site.
    const backupTimer = setTimeout(() => {
      if (!isVideoReady) {
        console.warn("Video took too long to load or codec is unsupported. Skipping.");
        handleVideoEnd();
      }
    }, 6000); 

    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(backupTimer);
    };
  }, [isVideoReady]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn("Autoplay blocked or failed:", err);
      });
    }
  }, [isMobile]);

  const handleVideoEnd = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      onComplete();
    }, 800); 
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const videoSrc = isMobile ? CLOUDINARY_VIDEO_MOBILE : CLOUDINARY_VIDEO_PC;
  const fallbackSrc = isMobile ? LOCAL_VIDEO_MOBILE : LOCAL_VIDEO_PC;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-white transition-opacity duration-700 ease-in-out flex items-center justify-center ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {!isVideoReady && (
        <div className="absolute inset-0 flex items-center justify-center z-0 bg-white">
          <div className="w-10 h-10 border-4 border-brand-red/20 border-t-brand-red rounded-full animate-spin"></div>
        </div>
      )}

      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-500 z-10 relative ${isVideoReady ? 'opacity-100' : 'opacity-0'}`}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnd}
        onCanPlay={() => setIsVideoReady(true)}
        onError={(e) => {
          console.error("Video failed to load", e);
          handleVideoEnd();
        }}
        key={isMobile ? 'mobile' : 'pc'}
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={fallbackSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
