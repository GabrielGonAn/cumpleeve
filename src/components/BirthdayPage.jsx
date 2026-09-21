import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart, HelpCircle, X, Gift, Smile, Music, Play } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

export default function BirthdayPage({ audioRef, isPlaying, isMuted, togglePlay, toggleMute, audioError }) {
  // Estado para las cajas secretas de Fotos
  const [activeSecret, setActiveSecret] = useState(null);

  // Estado para la canción/video seleccionado de YouTube (null o el objeto del song)
  const [activeSong, setActiveSong] = useState(null);

  // Guardar el estado de reproducción previo para saber si restaurar el audio al cerrar el video
  const wasPlayingBeforeVideo = useRef(false);

  // Guardar el estado del audio cuando la app se va a segundo plano en el celular
  const wasPlayingBeforeHidden = useRef(false);

  // Datos de las 3 cajas secretas de fotos
  const secrets = [
    {
      id: 1,
      title: "Foto 1 ✨",
      image: "/scrt1.jpeg",
      caption: "❤️"
    },
    {
      id: 2,
      title: "Foto 2 💖",
      image: "/scrt2.jpeg",
      caption: "✨"
    },
    {
      id: 3,
      title: "Foto 3 🎁",
      image: "/scrt3.jpeg",
      caption: "Por muchos más momentos 🎉"
    }
  ];

  // Datos de las 5 canciones de YouTube
  const songs = [
    {
      id: 1,
      title: "Canción 1 🎵",
      embedId: "B9qGJaBF1Zw",
      caption: "Un detallito con mucho cariño para ti ❤️"
    },
    {
      id: 2,
      title: "Canción 2 🎶",
      embedId: "NISQn2oXwyk",
      caption: "Cada nota me recuerda a ti ✨"
    },
    {
      id: 3,
      title: "Canción 3 🎧",
      embedId: "1a2Tmiu6iN8",
      caption: "Para escucharla pensándote 💖"
    },
    {
      id: 4,
      title: "Canción 4 🎸",
      embedId: "3jyy-1v-GgM",
      caption: "Ignora las partecitas tristes o cochinas 😹🥰, Me recuerda al primer día que nos vimos 💖"
    },
    {
      id: 5,
      title: "Canción Especial 🌟",
      embedId: "uTT9Bg_duiU",
      caption: "Esta es la más especial de todas 🤠💖"
    }
  ];

  // Controlar pausar/reanudar automáticamente cuando se cambia de app o se minimiza en el celular
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Al salir de la app/navegador: guardar si la música de fondo sonaba y pausar
        if (audioRef?.current && !audioRef.current.paused) {
          wasPlayingBeforeHidden.current = true;
          audioRef.current.pause();
        } else {
          wasPlayingBeforeHidden.current = false;
        }

        // Si había un video de YouTube activo en modal, cerrarlo para detener el iframe/audio
        if (activeSong) {
          setActiveSong(null);
        }
      } else {
        // Al volver a la app: si sonaba antes de salir y NO hay un video reproduciéndose, reanudar
        if (audioRef?.current && wasPlayingBeforeHidden.current && !activeSong) {
          audioRef.current.play().catch((err) => console.log("Error al reanudar audio en foreground:", err));
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handleVisibilityChange);
    };
  }, [activeSong, audioRef]);

  // Manejo del desvanecimiento (Fade In / Fade Out) del audio principal al abrir/cerrar un video
  useEffect(() => {
    let fadeInterval = null;

    if (activeSong) {
      // Guardar si la música estaba sonando antes de abrir el video
      wasPlayingBeforeVideo.current = isPlaying;

      if (audioRef?.current && isPlaying) {
        // Fade Out suave
        let volume = audioRef.current.volume;
        fadeInterval = setInterval(() => {
          if (volume > 0.05) {
            volume -= 0.05;
            audioRef.current.volume = volume;
          } else {
            audioRef.current.volume = 0;
            audioRef.current.pause();
            clearInterval(fadeInterval);
          }
        }, 50);
      }
    } else {
      // Al cerrar el video, restaurar audio si estaba reproduciéndose
      if (audioRef?.current && wasPlayingBeforeVideo.current) {
        audioRef.current.play().then(() => {
          let volume = 0;
          audioRef.current.volume = volume;
          fadeInterval = setInterval(() => {
            if (volume < 0.95) {
              volume += 0.05;
              audioRef.current.volume = volume;
            } else {
              audioRef.current.volume = 1;
              clearInterval(fadeInterval);
            }
          }, 50);
        }).catch((err) => console.log("Error al reanudar audio:", err));
      }
    }

    return () => {
      if (fadeInterval) clearInterval(fadeInterval);
    };
  }, [activeSong]);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 max-w-2xl sm:max-w-4xl mx-auto z-10 relative">
      <AudioPlayer
        audioRef={audioRef}
        isPlaying={isPlaying}
        isMuted={isMuted}
        togglePlay={togglePlay}
        toggleMute={toggleMute}
        audioError={audioError}
      />

      {/* Encabezado */}
      <header className="text-center space-y-2 mt-4 mb-8">
        <div className="flex items-center justify-center gap-2 text-[#c86d51]">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-widest">¡HOY ES UN DÍA MUY ESPECIAL!</span>
          <Sparkles className="w-4 h-4" />
        </div>

        <h1 className="font-titulo text-4xl sm:text-6xl font-bold text-[#2d1e18] tracking-wide">
          Feliz Cumpleaños Mi Amooor 💖
        </h1>

        <p className="font-cuerpo text-sm sm:text-base text-[#6e584a] px-2">
          Que la vida te llene siempre de sonrisas, momentos mágicos y de todo el amor que mereces.
        </p>
      </header>

      {/* Primera Foto */}
      <div className="my-4 w-full flex justify-center">
        <div className="floating-photo relative p-3 bg-[#fffaf5] rounded-2xl border-2 border-[#e6d0bd] shadow-xl max-w-md sm:max-w-xl w-full">
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#c86d51]" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#c86d51]" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#c86d51]" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#c86d51]" />

          <div className="overflow-hidden rounded-xl bg-[#ebd9c8] relative flex items-center justify-center">
            <img
              src="/foto1.jpeg"
              alt="Foto de nosotros"
              className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden absolute inset-0 flex-col items-center justify-center p-6 text-center text-[#735746] bg-[#f2e2d2]">
              <Heart className="w-10 h-10 text-[#c86d51] mb-2 animate-bounce" />
              <p className="font-semibold text-xs">Agrega 'foto1.jpeg' en la carpeta public</p>
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className="font-titulo text-xl text-[#4a3427]">Tú y yo ♥</p>
          </div>
        </div>
      </div>

      {/* Segunda Sección: Foto 2 y Párrafo */}
      <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#fffaf5]/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-[#ebd8c8] shadow-sm">
        <div className="md:col-span-5 flex justify-center">
          <div className="relative p-2.5 bg-white rounded-2xl border border-[#e2cebc] shadow-md transform -rotate-2 hover:rotate-0 transition-transform duration-300 max-w-xs w-full">
            <div className="overflow-hidden rounded-xl bg-[#ebd9c8] aspect-[4/5] relative">
              <img
                src="/foto2.jpeg"
                alt="Foto 2"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden absolute inset-0 flex-col items-center justify-center p-4 text-center text-[#735746] bg-[#f2e2d2]">
                <Heart className="w-8 h-8 text-[#c86d51] mb-1 animate-bounce" />
                <p className="font-semibold text-xs">Agrega 'foto2.jpeg' en public</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-3 text-left">
          <div className="flex items-center gap-2 text-[#d95d39]">
            <Heart className="w-5 h-5 fill-current" />
            <span className="font-titulo text-lg font-semibold text-[#3b2a20]">Holaaaaaaaa ❤️</span>
          </div>

          <p className="font-cuerpo text-sm sm:text-base text-[#5c473a] leading-relaxed">
            Felices 21 mi amor, no sabes lo feliz que me siento al estar a tu lado, este será el primero de muchos cumples en los que estaremos juntos 💖
          </p>

          <p className="font-cuerpo text-xs sm:text-sm text-[#8c6754] italic pt-2 border-t border-[#f0ded0]">
            "Gracias por ser mi persona favorita, por alegrar mis días con tu sonrisa y por hacer que cada instante a tu lado se sienta como un regalo. Que este nuevo año de vida te devuelva multiplicado todo el amor y la felicidad que te mereces."
          </p>
        </div>
      </div>

      {/* SECCIÓN DE CAJAS SECRETAS DE FOTOS */}
      <div className="mt-14 w-full text-center space-y-6">
        <div className="space-y-1">
          <h3 className="font-titulo text-2xl sm:text-3xl font-bold text-[#3a2a20] flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d95d39]" />
            Te Quieroo guapa 💖
            <Sparkles className="w-5 h-5 text-[#d95d39]" />
          </h3>
          <p className="text-xs sm:text-sm text-[#8c6e5d]">Selecciona y presiona</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {secrets.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveSecret(item.id)}
              style={{ animationDelay: `${index * 0.4}s` }}
              className="group relative bg-gradient-to-b from-[#fffaf5] to-[#f8ede3] p-6 rounded-2xl border-2 border-[#e8d2c0] shadow-md hover:shadow-xl hover:border-[#d95d39] transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden floating-photo"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#f39c12]/20 via-[#e74c3c]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

              <div className="w-14 h-14 rounded-full bg-[#fceee3] border border-[#e8d2c0] flex items-center justify-center text-[#d95d39] group-hover:scale-110 group-hover:bg-[#d95d39] group-hover:text-white transition-all duration-300 shadow-inner">
                <HelpCircle className="w-7 h-7" />
              </div>

              <span className="font-titulo text-lg font-semibold text-[#4a3427] group-hover:text-[#d95d39] transition-colors">
                {item.title}
              </span>

              <span className="text-xs font-semibold px-3 py-1 bg-[#eddcd0] group-hover:bg-[#d95d39] group-hover:text-white text-[#7d5f4c] rounded-full transition-colors shadow-sm">
                Toca para revelar
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* PENÚLTIMA SECCIÓN: Párrafo alegre a la izquierda + Foto 3 a la derecha */}
      <div className="mt-14 w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#fffaf5]/80 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-[#ebd8c8] shadow-sm">
        <div className="md:col-span-7 space-y-3 text-left order-2 md:order-1">
          <div className="flex items-center gap-2 text-[#d95d39]">
            <Gift className="w-5 h-5" />
            <span className="font-titulo text-lg font-semibold text-[#3b2a20]">A celebrar mi niña 🥳</span>
          </div>

          <p className="font-cuerpo text-sm sm:text-base text-[#5c473a] leading-relaxed">
            Espero que hoy disfrutes muchísimo tu día, que comas súper rico, te consientan un montón y sonrías todo el tiempo. Te mereces pasar un cumpleaños increíble. Yo juro que con el tiempo juntos, hare que cada cumpleaños tuyo sea mejor que el anterior 💖😀 ✨🎉
          </p>
        </div>

        <div className="md:col-span-5 flex justify-center order-1 md:order-2">
          <div className="relative p-2.5 bg-white rounded-2xl border border-[#e2cebc] shadow-md transform rotate-2 hover:rotate-0 transition-transform duration-300 max-w-xs w-full">
            <div className="overflow-hidden rounded-xl bg-[#ebd9c8] aspect-[4/5] relative">
              <img
                src="/foto3.jpg"
                alt="Foto 3"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden absolute inset-0 flex-col items-center justify-center p-4 text-center text-[#735746] bg-[#f2e2d2]">
                <Heart className="w-8 h-8 text-[#c86d51] mb-1 animate-bounce" />
                <p className="font-semibold text-xs">Agrega 'foto3.jpeg' en public</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE CANCIONES Y VIDEOS DE YOUTUBE */}
      <div className="mt-14 w-full text-center space-y-6">
        <div className="space-y-2 max-w-xl mx-auto">
          <h3 className="font-titulo text-2xl sm:text-3xl font-bold text-[#3a2a20] flex items-center justify-center gap-2">
            <Music className="w-6 h-6 text-[#d95d39]" />
            Para ti mi amor
            <Music className="w-6 h-6 text-[#d95d39]" />
          </h3>
          <p className="font-cuerpo text-sm sm:text-base text-[#6e584a] leading-relaxed">
            Estas no son al azar, me gusta escuchar de todo y cada una me recuerda a ti ❤️, tal vez si o tal vez no las hayas oído, pero son de mí para ti 🤠💖
          </p>
        </div>

        {/* Cajas 1 a 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {songs.slice(0, 4).map((song, index) => (
            <button
              key={song.id}
              onClick={() => setActiveSong(song)}
              style={{ animationDelay: `${index * 0.3}s` }}
              className="group relative bg-gradient-to-b from-[#fffaf5] to-[#f8ede3] p-6 rounded-2xl border-2 border-[#e8d2c0] shadow-md hover:shadow-xl hover:border-[#d95d39] transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden floating-photo"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-[#f39c12]/20 via-[#e74c3c]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

              <div className="w-14 h-14 rounded-full bg-[#fceee3] border border-[#e8d2c0] flex items-center justify-center text-[#d95d39] group-hover:scale-110 group-hover:bg-[#d95d39] group-hover:text-white transition-all duration-300 shadow-inner">
                <Play className="w-7 h-7 fill-current ml-0.5" />
              </div>

              <span className="font-titulo text-lg font-semibold text-[#4a3427] group-hover:text-[#d95d39] transition-colors">
                {song.title}
              </span>

              <span className="text-xs font-semibold px-3 py-1 bg-[#eddcd0] group-hover:bg-[#d95d39] group-hover:text-white text-[#7d5f4c] rounded-full transition-colors shadow-sm">
                Escuchar canción 🎵
              </span>
            </button>
          ))}
        </div>

        {/* Caja 5 (Más grande y centrada) */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setActiveSong(songs[4])}
            className="group relative bg-gradient-to-b from-[#fffaf5] to-[#fceee3] p-8 rounded-3xl border-2 border-[#d95d39]/40 shadow-lg hover:shadow-2xl hover:border-[#d95d39] transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden max-w-lg w-full floating-photo"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#e74c3c]/20 via-[#f39c12]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-[#fceee3] border-2 border-[#d95d39]/50 flex items-center justify-center text-[#d95d39] group-hover:scale-110 group-hover:bg-[#d95d39] group-hover:text-white transition-all duration-300 shadow-md">
              <Sparkles className="w-8 h-8 animate-spin-slow" />
            </div>

            <span className="font-titulo text-xl sm:text-2xl font-bold text-[#3a2a20] group-hover:text-[#d95d39] transition-colors">
              {songs[4].title}
            </span>

            <span className="text-xs sm:text-sm font-semibold px-4 py-1.5 bg-[#d95d39] text-white rounded-full transition-colors shadow-md">
              Toca para ver la más especial ✨
            </span>
          </button>
        </div>
      </div>

      {/* ÚLTIMA SECCIÓN: Foto 4 a la izquierda + Mensaje de Amor Final a la derecha */}
      <div className="mt-14 w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-gradient-to-br from-[#fffaf5] to-[#fceee3] backdrop-blur-sm p-6 sm:p-8 rounded-3xl border-2 border-[#e6d0bd] shadow-lg">
        <div className="md:col-span-5 flex justify-center">
          <div className="relative p-2.5 bg-white rounded-2xl border border-[#e2cebc] shadow-md transform -rotate-3 hover:rotate-0 transition-transform duration-300 max-w-xs w-full">
            <div className="overflow-hidden rounded-xl bg-[#ebd9c8] aspect-[4/5] relative">
              <img
                src="/foto4.jpg"
                alt="Foto 4"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden absolute inset-0 flex-col items-center justify-center p-4 text-center text-[#735746] bg-[#f2e2d2]">
                <Heart className="w-8 h-8 text-[#c86d51] mb-1 animate-bounce" />
                <p className="font-semibold text-xs">Agrega 'foto4.jpeg' en public</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-4 text-left">
          <div className="flex items-center gap-2 text-[#d95d39]">
            <Smile className="w-5 h-5" />
            <span className="font-titulo text-xl font-bold text-[#3b2a20]">Espero que te haya gustado... ❤️</span>
          </div>

          <p className="font-cuerpo text-sm sm:text-base text-[#5c473a] leading-relaxed">
            Y bueno mi amor, hice este detalle con muchísimo cariño para ti. Gracias por cada momento juntos, por tus abrazos, tus risas y por ser esa persona tan bonita que llena mi vida de alegría. De nuevo Feliiizz cumpleaños mi niña hermosa 💖, que sea un día muy bonito para ti. Teamooooo ❤️.
          </p>

          <div className="pt-3 border-t border-[#ebd8c8]">
            <p className="font-titulo text-2xl sm:text-3xl font-extrabold text-[#d95d39] tracking-wider animate-pulse">
              ¡TE AMOOOO! ❤️✨
            </p>
          </div>
        </div>
      </div>

      {/* MODAL PARA LAS FOTOS SECRETAS */}
      {activeSecret && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveSecret(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#fffaf5] rounded-3xl p-5 sm:p-6 border-2 border-[#e6d0bd] shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col items-center text-center overflow-hidden transform animate-scaleUp"
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#f39c12]/30 rounded-full blur-2xl pointer-events-none" />

            <button
              onClick={() => setActiveSecret(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#f2e2d2] hover:bg-[#d95d39] hover:text-white text-[#5c473a] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-titulo text-2xl font-bold text-[#3b2a20] mb-4">
              {secrets.find((s) => s.id === activeSecret)?.title}
            </h4>

            <div className="w-full flex justify-center overflow-hidden rounded-2xl bg-[#ebd9c8] p-1 shadow-inner max-h-[60vh]">
              <img
                src={secrets.find((s) => s.id === activeSecret)?.image}
                alt="Secreto"
                className="w-full h-auto max-h-[58vh] object-contain rounded-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden h-48 w-full flex-col items-center justify-center p-4 text-center text-[#735746]">
                <Heart className="w-8 h-8 text-[#c86d51] mb-1 animate-bounce" />
                <p className="font-semibold text-xs">
                  Agrega '{secrets.find((s) => s.id === activeSecret)?.image}' en public
                </p>
              </div>
            </div>

            <p className="font-cuerpo text-sm sm:text-base text-[#6e5444] mt-4 font-medium">
              {secrets.find((s) => s.id === activeSecret)?.caption}
            </p>
          </div>
        </div>
      )}

      {/* MODAL PARA REPRODUCIR VIDEOS DE YOUTUBE */}
      {activeSong && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveSong(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#fffaf5] rounded-3xl p-5 sm:p-6 border-2 border-[#e6d0bd] shadow-2xl max-w-2xl w-full flex flex-col items-center text-center overflow-hidden transform animate-scaleUp"
          >
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#d95d39]/20 rounded-full blur-2xl pointer-events-none" />

            {/* Único botón de cerrar: X en la esquina */}
            <button
              onClick={() => setActiveSong(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#f2e2d2] hover:bg-[#d95d39] hover:text-white text-[#5c473a] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-titulo text-xl sm:text-2xl font-bold text-[#3b2a20] mb-4 pr-8">
              {activeSong.title}
            </h4>

            {/* Contenedor del Iframe con autoplay */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeSong.embedId}?autoplay=1&rel=0`}
                title={activeSong.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Texto descriptivo debajo del video */}
            <p className="font-cuerpo text-sm sm:text-base text-[#6e5444] mt-4 font-medium px-2">
              {activeSong.caption}
            </p>
          </div>
        </div>
      )}

      {/* Pie de página */}
      <footer className="mt-12 text-center text-xs text-[#91796b]">
        <p>Hecho y programado con todo mi amor para ti jsjs ❤️</p>
      </footer>
    </div>
  );
}