"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./NotFound.css"; // Import external CSS

interface NotFoundProps {
  returnUrl?: string;
  returnLabel?: string;
  title?: string;
  imagePath?: string;
}

export const NotFound: React.FC<NotFoundProps> = ({
  returnUrl = "/admin/dashboard",
  returnLabel = "Go Home",
  title = "Page Not Found",
  imagePath = "/images/Astrologer.png",
}) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const [stars, setStars] = useState<Array<{
    size: number;
    top: number;
    left: number;
    delay: number;
    duration: number;
  }>>([]);

  const [shootingStars, setShootingStars] = useState<Array<{
    top: number;
    left: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    setMounted(true);
    
    const generatedStars = Array.from({ length: 200 }, () => ({
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 2 + Math.random() * 3,
    }));
    setStars(generatedStars);

    const generatedShootingStars = Array.from({ length: 8 }, (_, i) => ({
      top: Math.random() * 60,
      left: -20 + Math.random() * 40,
      delay: i * 3 + Math.random() * 5,
    }));
    setShootingStars(generatedShootingStars);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-9xl font-black text-amber-100">404</h1>
          <h2 className="text-4xl font-bold text-white mt-4">{title}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="cosmic-background min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cosmic Clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="cosmic-cloud cloud-1" />
        <div className="cosmic-cloud cloud-2" />
        <div className="cosmic-cloud cloud-3" />
      </div>

      {/* Twinkling Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="star"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Shooting Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {shootingStars.map((star, i) => (
          <div
            key={`shoot-${i}`}
            className="shooting-star"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="relative w-full flex flex-col items-center">
          <h1 
            className="notfound-404"
          >
            404
          </h1>

          <div className="relative z-20 flex justify-center notfound-image">
            <img
              src={imagePath}
              alt="Astrologer Sage"
              className="w-64 h-64 md:w-88 md:h-88 lg:w-[420px] lg:h-[420px] object-contain drop-shadow-2xl"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'text-8xl md:text-9xl notfound-emoji';
                  fallback.textContent = '🧘‍♂️';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        </div>

        <div className="mt-0 text-center space-y-4 max-w-2xl mx-auto px-4">
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
            {title}
            
          </h2>
           <Link href={returnUrl}>
          <button className="button-3d mt-0">
            {returnLabel}
          </button>
        </Link>
        
        </div>

       
      </div>
    </div>
  );
};

export default NotFound;