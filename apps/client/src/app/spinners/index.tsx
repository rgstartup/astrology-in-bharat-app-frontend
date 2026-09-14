import React from 'react';
import NextImage from 'next/image';

const UltimateSpinnersDemo = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-extrabold text-[#301118] sm:text-4xl">
            The Grand Spinners Collection
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Aapki demand par 4 aur ekdum hatke designs (Total 16)! Astrology aur mystic vibes ke sath.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* ===================== MYSTIC DESIGNS (V4) ===================== */}

          {/* Spinner 1: Sacred Geometry (Yantra Spin) */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-[#301118] mb-6 uppercase tracking-wider text-center">1. Sacred Geometry</h3>
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Spinning Yantra Pattern */}
              <svg className="absolute inset-0 w-full h-full animate-[spin_6s_linear_infinite] opacity-30" viewBox="0 0 100 100">
                <rect x="20" y="20" width="60" height="60" fill="none" stroke="#FF6B00" strokeWidth="2" transform="rotate(45 50 50)" />
                <rect x="20" y="20" width="60" height="60" fill="none" stroke="#FF6B00" strokeWidth="2" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#301118" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
              <div className="relative z-10 bg-white rounded-full p-2">
                <NextImage src="/images/web-logo.png" alt="Logo" width={55} height={55} className="object-contain" />
              </div>
            </div>
          </div>

          {/* Spinner 2: Mystic Aura Glow */}
          <div className="bg-[#1A1A1A] rounded-3xl shadow-lg border border-gray-800 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-white mb-6 uppercase tracking-wider text-center">2. Mystic Aura</h3>
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Expanding Aura */}
              <div className="absolute inset-0 rounded-full bg-[#FF6B00] opacity-20 blur-xl animate-[auraPulse_2s_ease-in-out_infinite]"></div>
              <div className="absolute inset-2 rounded-full bg-[#FFD700] opacity-30 blur-lg animate-[auraPulse_3s_ease-in-out_infinite_reverse]"></div>
              
              <div className="relative z-10 animate-pulse">
                <NextImage src="/images/web-logo.png" alt="Logo" width={70} height={70} className="object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]" />
              </div>
            </div>
          </div>

          {/* Spinner 3: Spinning Coin */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-[#301118] mb-6 uppercase tracking-wider text-center">3. Spinning Coin</h3>
            <div className="relative w-24 h-24 flex items-center justify-center perspective-[800px]">
              <div className="animate-[fastFlip_1s_linear_infinite] transform-style-3d bg-[#FFF8F0] p-3 rounded-full border-2 border-orange/40 shadow-[0_0_20px_rgba(255,107,0,0.3)]">
                <NextImage src="/images/web-logo.png" alt="Logo" width={60} height={60} className="object-contain" />
              </div>
              <div className="absolute -bottom-6 w-12 h-2 bg-orange/20 rounded-[50%] blur-sm animate-[pulse_0.5s_infinite]"></div>
            </div>
          </div>

          {/* Spinner 4: Pendulum Swing */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-[#301118] mb-6 uppercase tracking-wider text-center">4. Pendulum Swing</h3>
            <div className="relative w-24 h-24 flex items-center justify-center border-t-4 border-[#301118]/10 pt-4">
              {/* Pendulum origin top center */}
              <div className="origin-top -mt-8 animate-[swing_2s_ease-in-out_infinite] flex flex-col items-center">
                {/* String */}
                <div className="w-[2px] h-8 bg-gray-300"></div>
                {/* Bob (Logo) */}
                <div className="bg-white rounded-full shadow-lg p-2 border border-gray-100">
                  <NextImage src="/images/web-logo.png" alt="Logo" width={50} height={50} className="object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* ===================== BRAND NEW DESIGNS (V3) ===================== */}
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[280px] overflow-hidden">
            <h3 className="text-sm font-black text-gray-500 mb-6 uppercase tracking-wider text-center">5. Shimmering Glass</h3>
            <div className="relative w-24 h-24 flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange/10 to-white overflow-hidden shadow-inner">
              <NextImage src="/images/web-logo.png" alt="Logo" width={60} height={60} className="object-contain" />
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12"></div>
            </div>
          </div>

          <div className="bg-[#0f172a] rounded-3xl shadow-lg border border-gray-800 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-gray-400 mb-6 uppercase tracking-wider text-center">6. Radar Sweep</h3>
            <div className="relative w-28 h-28 flex items-center justify-center rounded-full border border-orange/30 bg-[#1e293b] overflow-hidden">
              <NextImage src="/images/web-logo.png" alt="Logo" width={55} height={55} className="object-contain z-10" />
              <div className="absolute top-1/2 left-1/2 w-full h-full origin-top-left animate-[spin_2s_linear_infinite] bg-gradient-to-br from-orange/40 to-transparent"></div>
              <div className="absolute inset-0 rounded-full border border-orange/10"></div>
              <div className="absolute w-full h-[1px] bg-orange/20"></div>
              <div className="absolute h-full w-[1px] bg-orange/20"></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-gray-500 mb-6 uppercase tracking-wider text-center">7. Float & Morph</h3>
            <div className="relative w-24 h-24 flex flex-col items-center justify-center">
              <div className="animate-[float_3s_ease-in-out_infinite]">
                <NextImage src="/images/web-logo.png" alt="Logo" width={65} height={65} className="object-contain drop-shadow-xl" />
              </div>
              <div className="absolute -bottom-4 w-12 h-3 bg-gradient-to-r from-orange/20 via-orange/50 to-orange/20 rounded-[50%] blur-[2px] animate-[morphShadow_3s_ease-in-out_infinite]"></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-gray-500 mb-6 uppercase tracking-wider text-center">8. Liquid Dash Ring</h3>
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full animate-[spin_2s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#FFF5F0" strokeWidth="4" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#FF6B00" strokeWidth="6" strokeLinecap="round" strokeDasharray="283" className="animate-[dash_1.5s_ease-in-out_infinite]" />
              </svg>
              <div className="relative z-10">
                <NextImage src="/images/web-logo.png" alt="Logo" width={55} height={55} className="object-contain" />
              </div>
            </div>
          </div>

          {/* ===================== NEW DESIGNS (V2) ===================== */}
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-gray-400 mb-6 uppercase tracking-wider text-center">9. 3D Flip</h3>
            <div className="relative w-24 h-24 flex items-center justify-center perspective-[1000px]">
              <div className="animate-[flip_2s_ease-in-out_infinite] transform-style-3d">
                <NextImage src="/images/web-logo.png" alt="Logo" width={70} height={70} className="object-contain drop-shadow-md" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-gray-400 mb-6 uppercase tracking-wider text-center">10. Double Orbit</h3>
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-orange border-b-orange animate-[spin_2s_linear_infinite] opacity-80"></div>
              <div className="absolute inset-2.5 rounded-full border-[3px] border-transparent border-l-[#301118] border-r-[#301118] animate-[spin_1.5s_linear_infinite_reverse] opacity-80"></div>
              <div className="relative z-10 bg-white rounded-full p-2">
                <NextImage src="/images/web-logo.png" alt="Logo" width={55} height={55} className="object-contain" />
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-3xl shadow-lg border border-gray-800 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-gray-500 mb-6 uppercase tracking-wider text-center">11. Neon Trace</h3>
            <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-[#2A2A2A] overflow-hidden">
              <div className="absolute w-[200%] h-[200%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0%,transparent_70%,#FF6B00_100%)]"></div>
              <div className="absolute inset-1 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                <NextImage src="/images/web-logo.png" alt="Logo" width={60} height={60} className="object-contain" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-gray-400 mb-6 uppercase tracking-wider text-center">12. Bounce & Sparkles</h3>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute top-2 right-4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-[ping_1s_ease-in-out_infinite]"></div>
              <div className="absolute bottom-4 left-2 w-2 h-2 bg-orange rounded-full animate-[ping_1.5s_ease-in-out_infinite_0.5s]"></div>
              <div className="absolute top-1/2 -right-2 w-1 h-1 bg-[#301118] rounded-full animate-[ping_2s_ease-in-out_infinite_1s]"></div>
              
              <div className="relative animate-bounce">
                <NextImage src="/images/web-logo.png" alt="Logo" width={65} height={65} className="object-contain drop-shadow-sm" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-gray-200 rounded-[50%] blur-[2px] animate-[pulse_1s_infinite]"></div>
              </div>
            </div>
          </div>

          {/* ===================== OLD DESIGNS (V1) ===================== */}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-gray-300 mb-6 uppercase tracking-wider text-center">13. Pulsing Ring</h3>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[3px] border-orange/20 border-t-orange animate-spin"></div>
              <div className="absolute animate-pulse">
                <NextImage src="/images/web-logo.png" alt="Logo" width={60} height={60} className="object-contain" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-gray-300 mb-6 uppercase tracking-wider text-center">14. Orbiting Dots</h3>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-orange/60 rounded-full"></div>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 bg-orange/30 rounded-full"></div>
              </div>
              <div className="relative z-10 bg-white/80 rounded-full p-2">
                <NextImage src="/images/web-logo.png" alt="Logo" width={65} height={65} className="object-contain" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-gray-300 mb-6 uppercase tracking-wider text-center">15. Heartbeat Glow</h3>
            <div className="relative flex items-center justify-center w-24 h-24">
              <div className="absolute animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20">
                 <NextImage src="/images/web-logo.png" alt="Logo" width={65} height={65} className="object-contain filter blur-sm" />
              </div>
              <div className="relative animate-pulse">
                <NextImage src="/images/web-logo.png" alt="Logo" width={75} height={75} className="object-contain" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[280px]">
            <h3 className="text-sm font-black text-gray-300 mb-6 uppercase tracking-wider text-center">16. Ripple Waves</h3>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[3px] border-orange animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75"></div>
              <div className="absolute inset-2 rounded-full border-[3px] border-orange/60 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50"></div>
              <div className="relative bg-white rounded-full p-2 shadow-md z-10">
                <NextImage src="/images/web-logo.png" alt="Logo" width={55} height={55} className="object-contain" />
              </div>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes flip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes fastFlip {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes morphShadow {
          0%, 100% { transform: scaleX(1); opacity: 0.3; }
          50% { transform: scaleX(0.6); opacity: 0.1; }
        }
        @keyframes dash {
          0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 90, 200; stroke-dashoffset: -35px; }
          100% { stroke-dasharray: 90, 200; stroke-dashoffset: -124px; }
        }
        @keyframes auraPulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.5); opacity: 0.4; }
        }
        @keyframes swing {
          0% { transform: rotate(15deg); }
          50% { transform: rotate(-15deg); }
          100% { transform: rotate(15deg); }
        }
        .perspective-[800px] { perspective: 800px; }
        .perspective-[1000px] { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
      `}} />
    </div>
  );
};

export default UltimateSpinnersDemo;
