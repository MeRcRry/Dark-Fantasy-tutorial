
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#e0e0e0] flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-6xl flex justify-between items-center mb-12 pixel-border bg-[#1a1a1c] p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-900 pixel-border flex items-center justify-center text-2xl">
            💀
          </div>
          <h1 className="text-xl md:text-2xl pixel-font tracking-tighter text-red-600">
            GRIMOIRE
          </h1>
        </div>
        <nav className="hidden md:flex gap-8 text-sm pixel-font">
          <a href="#" className="hover:text-red-500 transition-colors">LIBRARY</a>
          <a href="#" className="hover:text-red-500 transition-colors">QUESTS</a>
          <a href="#" className="hover:text-red-500 transition-colors">STATS</a>
        </nav>
      </header>
      <main className="w-full max-w-6xl flex-grow">
        {children}
      </main>
      <footer className="w-full max-w-6xl mt-12 pt-8 border-t-4 border-[#3d3d41] flex justify-between items-center opacity-60 text-xs pixel-font">
        <p>© 1422 THE IRON CITADEL</p>
        <p>VERSION 0.4.2-STABLE</p>
      </footer>
    </div>
  );
};
