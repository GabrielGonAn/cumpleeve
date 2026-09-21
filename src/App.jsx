import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import BackgroundDecoration from './components/BackgroundDecoration';
import WelcomePage from './components/WelcomePage';
import BirthdayPage from './components/BirthdayPage';

export default function App() {
  const [page, setPage] = useState(1);
  const [fillProgress, setFillProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const audioRef = useRef(null);

  const handleHeartComplete = () => {
    setTimeout(() => {
      setPage(2);
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 200);
  };

  useEffect(() => {
    if (page === 2 && audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.log("Autoplay bloqueado por el navegador:", error);
            setIsPlaying(false);
            setAudioError(true);
          });
      }
    }
  }, [page]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-[#fcf8f2] text-[#4a3b32] relative overflow-x-hidden font-cuerpo select-none">
      <BackgroundDecoration />

      {page === 1 && (
        <WelcomePage
          fillProgress={fillProgress}
          setFillProgress={setFillProgress}
          onHeartComplete={handleHeartComplete}
        />
      )}

      {page === 2 && (
        <BirthdayPage
          audioRef={audioRef}
          isPlaying={isPlaying}
          isMuted={isMuted}
          togglePlay={togglePlay}
          toggleMute={toggleMute}
          audioError={audioError}
        />
      )}
    </div>
  );
}