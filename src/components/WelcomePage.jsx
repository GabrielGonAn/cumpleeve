import React from 'react';
import InteractiveHeart from './InteractiveHeart';

export default function WelcomePage({ fillProgress, setFillProgress, onHeartComplete }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center z-10 relative">
      <div className="space-y-4 mb-8 max-w-sm sm:max-w-xl">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#f0e0d0] text-[#8c5946] text-xs font-semibold tracking-wide uppercase shadow-sm">
          ✨ Para ti ✨
        </span>
        <h1 className="font-titulo text-5xl sm:text-7xl font-bold text-[#3a2a20] tracking-tight leading-tight">
          Holaaaa mi amor
        </h1>
        <p className="font-cuerpo text-base sm:text-lg text-[#735d4f] max-w-xs sm:max-w-md mx-auto">
          He preparado algo muy especial con mucho cariño para este día tan bonito.
        </p>
      </div>

      <InteractiveHeart
        fillProgress={fillProgress}
        setFillProgress={setFillProgress}
        onComplete={onHeartComplete}
      />
    </div>
  );
}