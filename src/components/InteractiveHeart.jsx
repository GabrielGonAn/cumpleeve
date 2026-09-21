import React, { useRef } from 'react';

export default function InteractiveHeart({ fillProgress, setFillProgress, onComplete }) {
  const pressIntervalRef = useRef(null);

  const startFilling = (e) => {
    if (e.cancelable && e.type === 'touchstart') e.preventDefault();
    if (pressIntervalRef.current) clearInterval(pressIntervalRef.current);

    pressIntervalRef.current = setInterval(() => {
      setFillProgress((prev) => {
        if (prev >= 100) {
          clearInterval(pressIntervalRef.current);
          onComplete();
          return 100;
        }
        return prev + 3;
      });
    }, 30);
  };

  const stopFilling = () => {
    if (pressIntervalRef.current) clearInterval(pressIntervalRef.current);

    pressIntervalRef.current = setInterval(() => {
      setFillProgress((prev) => {
        if (prev <= 0) {
          clearInterval(pressIntervalRef.current);
          return 0;
        }
        return prev - 5;
      });
    }, 20);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative cursor-pointer select-none touch-none transform transition-transform active:scale-95"
        onMouseDown={startFilling}
        onMouseUp={stopFilling}
        onMouseLeave={stopFilling}
        onTouchStart={startFilling}
        onTouchEnd={stopFilling}
      >
        <div className="w-36 h-36 sm:w-44 sm:h-44 relative flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="heartGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset={`${fillProgress}%`} stopColor="#e63946" />
                <stop offset={`${fillProgress}%`} stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="url(#heartGradient)"
              stroke="#c86d51"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 pointer-events-none">
            <span className={`text-xs sm:text-sm font-semibold transition-colors duration-200 ${fillProgress > 50 ? 'text-white' : 'text-[#614535]'}`}>
              {fillProgress > 0 ? `${Math.round(fillProgress)}%` : 'Mantén presionado'}
            </span>
            <span className={`text-[10px] sm:text-xs opacity-80 ${fillProgress > 50 ? 'text-white' : 'text-[#7d604d]'}`}>
              para comenzar
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#9e8270] animate-pulse">
        (Deja presionado el corazón con tu dedo o ratón)
      </p>
    </div>
  );
}