"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  // Get current URL path
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Rotating Sky Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="rotating-sky" />
      </div>

      {/* Animated particle stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-60"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite, float ${10 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Shooting Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            className="shooting-star"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 4 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Large 404 Text Behind Image */}
        <div className="relative w-full flex flex-col items-center">
          {/* 404 Background Text */}
          <h1 
            style={{
              fontSize: 'clamp(120px, 18vw, 320px)',
              color: '#FEF3C7',
              textShadow: `
                0px 8px 0px #F59E0B,
                0px 16px 0px #D97706,
                0px 24px 0px #B45309,
                0px 32px 40px rgba(0,0,0,0.25)
              `,
              letterSpacing: '0.15em',
              fontWeight: '900',
              lineHeight: '1',
              userSelect: 'none',
              opacity: '0.9',
              marginBottom: 'clamp(-100px, -12vw, -240px)',
            }}
          >
            404
          </h1>

          {/* Astrologer Image (Centered over 404) */}
          <div className="relative z-20 flex justify-center">
            <img
              src={imagePath}
              alt="Astrologer Sage"
              className="w-64 h-64 md:w-88 md:h-88 lg:w-[420px] lg:h-[420px] object-contain drop-shadow-2xl"
              style={{
                marginTop: 'clamp(-40px, -5vw, -80px)',
                marginLeft: 'clamp(0px, 0vw, 0px)',
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = document.createElement('div');
                  fallback.className = 'text-8xl md:text-9xl';
                  fallback.style.marginTop = 'clamp(-40px, -5vw, -80px)';
                  fallback.style.marginLeft = 'clamp(0px, 0vw, 0px)';
                  fallback.textContent = '🧘‍♂️';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="mt-8 text-center space-y-4 max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
            {title}
          </h2>
          
          {/* Dynamic Message with URL */}
          <div className="space-y-2">
            <p className="text-base md:text-lg lg:text-xl text-orange-100">
              The page you're looking for is not available.
            </p>
            
            {/* URL Display */}
            {pathname && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border-2 border-orange-300/50 inline-block">
                <p className="text-sm text-orange-200 mb-1">Requested URL:</p>
                <code className="text-base md:text-lg font-mono text-white font-semibold break-all">
                  {pathname}
                </code>
              </div>
            )}
            
            <p className="text-sm md:text-base text-orange-200 italic mt-3">
              ✨ The stars couldn't find this path in our universe ✨
            </p>
          </div>
        </div>

        {/* Go Home Button */}
        <Link href={returnUrl}>
          <button className="button-3d mt-6">
            {returnLabel}
          </button>
        </Link>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
          }
        }

        @keyframes rotate-sky {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes shooting-star {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px);
            opacity: 0;
          }
        }

        .rotating-sky {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(251, 146, 60, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(249, 115, 22, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(234, 88, 12, 0.05) 0%, transparent 70%);
          animation: rotate-sky 60s linear infinite;
        }

        .shooting-star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          box-shadow: 
            0 0 10px 2px rgba(255, 255, 255, 0.8),
            0 0 20px 4px rgba(251, 146, 60, 0.6);
          animation: shooting-star 3s ease-out infinite;
        }

        .shooting-star::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100px;
          height: 1px;
          background: linear-gradient(90deg, white, transparent);
        }

        .button-3d {
          position: relative;
          padding: 1rem 2.5rem;
          font-size: 1.25rem;
          font-weight: bold;
          color: #1a1a1a;
          background: linear-gradient(to bottom, 
            #fb923c, 
            #f97316
          );
          border: 4px solid #fbbf24;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
          
          box-shadow: 
            0 6px 0 #c2410c,
            0 8px 0 #9a3412,
            0 12px 20px rgba(0, 0, 0, 0.4),
            inset 0 2px 6px rgba(255, 255, 255, 0.4),
            inset 0 -2px 6px rgba(154, 52, 18, 0.3);
        }
        
        .button-3d:hover {
          transform: translateY(2px);
          background: linear-gradient(to bottom, 
            #f97316, 
            #ea580c
          );
          border-color: #fcd34d;
          box-shadow: 
            0 4px 0 #c2410c,
            0 6px 0 #9a3412,
            0 10px 16px rgba(0, 0, 0, 0.4),
            inset 0 2px 6px rgba(255, 255, 255, 0.4),
            inset 0 -2px 6px rgba(154, 52, 18, 0.3);
        }
        
        .button-3d:active {
          transform: translateY(6px);
          background: linear-gradient(to bottom, 
            #ea580c, 
            #c2410c
          );
          border-color: #f59e0b;
          box-shadow: 
            0 2px 0 #c2410c,
            0 4px 0 #9a3412,
            0 6px 12px rgba(0, 0, 0, 0.4),
            inset 0 2px 6px rgba(255, 255, 255, 0.4),
            inset 0 -2px 6px rgba(154, 52, 18, 0.3);
        }
        
        @media (min-width: 768px) {
          .button-3d {
            padding: 1.25rem 3rem;
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound;