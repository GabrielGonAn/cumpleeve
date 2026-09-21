import React from 'react';

export default function BackgroundDecoration() {
  return (
    <>
      <div className="absolute top-10 left-10 w-60 h-60 bg-[#f3e3d3] rounded-full blur-3xl opacity-50 pointer-events-none bg-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#ebd2be] rounded-full blur-3xl opacity-40 pointer-events-none bg-pulse" />
    </>
  );
}