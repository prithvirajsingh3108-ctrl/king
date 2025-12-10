import React, { useState, useEffect } from 'react';
import { MOCK_COMICS } from '../constants';
import { ArrowLeft, ArrowRight, X, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Comic } from '../types';

export const Comics: React.FC = () => {
  const [activeComic, setActiveComic] = useState<Comic | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isImmersive, setIsImmersive] = useState(false);

  const openComic = (comic: Comic) => {
    setActiveComic(comic);
    setCurrentPage(0);
    setIsImmersive(false);
  };

  const closeComic = () => {
    setActiveComic(null);
    setIsImmersive(false);
  };

  const nextPage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeComic && currentPage < activeComic.pages.length - 1) {
      setCurrentPage(p => p + 1);
    }
  };

  const prevPage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentPage > 0) {
      setCurrentPage(p => p - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeComic) return;
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'Escape') closeComic();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeComic, currentPage]);

  // Full Screen Reader Mode
  if (activeComic) {
    return (
      <div className="fixed inset-0 bg-black z-[100] flex flex-col h-screen w-screen overflow-hidden">
        
        {/* Header - Overlaid */}
        <div 
          className={`absolute top-0 left-0 w-full z-20 transition-transform duration-300 ease-in-out ${
            isImmersive ? '-translate-y-full' : 'translate-y-0'
          } bg-gradient-to-b from-black/90 to-transparent pt-4 pb-12 px-6 flex items-start justify-between pointer-events-none`}
        >
          <div className="pointer-events-auto">
            <h2 className="font-bold text-lg md:text-xl shadow-black drop-shadow-md">{activeComic.title}</h2>
            <p className="text-xs text-gray-300 font-medium">Page {currentPage + 1} of {activeComic.pages.length}</p>
          </div>
          <div className="flex items-center space-x-4 pointer-events-auto">
             <button 
                onClick={() => setIsImmersive(!isImmersive)} 
                className="p-2 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition"
             >
                {isImmersive ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
             </button>
             <button 
                onClick={closeComic} 
                className="p-2 bg-white/10 hover:bg-red-500/80 rounded-full backdrop-blur-md transition"
             >
                <X size={20} />
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div 
            className="flex-1 relative flex items-center justify-center bg-neutral-900 overflow-hidden cursor-pointer"
            onClick={() => setIsImmersive(!isImmersive)}
        >
           {/* Image */}
           <div className="relative w-full h-full flex items-center justify-center p-2 md:p-4 transition-all duration-300">
              <img 
                src={activeComic.pages[currentPage]} 
                alt={`Page ${currentPage}`} 
                className="max-w-full max-h-full object-contain shadow-2xl"
                style={{ maxHeight: isImmersive ? '100vh' : '85vh' }}
              />
           </div>

           {/* Desktop Hover Navigation */}
           <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 justify-between px-4 hidden md:flex pointer-events-none">
              <button 
                onClick={prevPage} 
                disabled={currentPage === 0}
                className="pointer-events-auto p-3 rounded-full bg-black/50 hover:bg-pink-600 text-white disabled:opacity-0 transition transform hover:scale-110 backdrop-blur-sm"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={nextPage} 
                disabled={currentPage === activeComic.pages.length - 1}
                className="pointer-events-auto p-3 rounded-full bg-black/50 hover:bg-pink-600 text-white disabled:opacity-0 transition transform hover:scale-110 backdrop-blur-sm"
              >
                <ChevronRight size={32} />
              </button>
           </div>
        </div>

        {/* Mobile Controls - Overlaid at bottom */}
        <div 
            className={`absolute bottom-0 left-0 w-full z-20 transition-transform duration-300 ease-in-out ${
                isImmersive ? 'translate-y-full' : 'translate-y-0'
            } md:hidden bg-neutral-900 border-t border-neutral-800 p-4 pb-8 flex items-center justify-between`}
        >
            <button 
                onClick={prevPage} 
                disabled={currentPage === 0} 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-neutral-800 disabled:opacity-30 active:scale-95 transition"
            >
                <ChevronLeft size={16} />
                <span>Prev</span>
            </button>
            
            <span className="font-mono text-sm font-bold text-pink-500">{currentPage + 1} / {activeComic.pages.length}</span>
            
            <button 
                onClick={nextPage} 
                disabled={currentPage === activeComic.pages.length - 1} 
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-pink-600 text-white disabled:opacity-30 disabled:bg-neutral-800 active:scale-95 transition"
            >
                <span>Next</span>
                <ChevronRight size={16} />
            </button>
        </div>
      </div>
    );
  }

  // Gallery View
  return (
    <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto animate-fadeIn">
       <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">Comic Vault</h2>
            <p className="text-gray-400 mt-2 text-sm md:text-base">Read while you listen. An immersive experience.</p>
          </div>
       </div>

       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
         {MOCK_COMICS.map((comic) => (
           <div 
             key={comic.id} 
             onClick={() => openComic(comic)}
             className="group cursor-pointer perspective-1000"
           >
             <div className="relative w-full aspect-[2/3] rounded-lg bg-neutral-800 mb-3 overflow-hidden transition-all duration-300 transform group-hover:-translate-y-2 shadow-lg group-hover:shadow-pink-500/20 ring-1 ring-white/5 group-hover:ring-pink-500/50">
               <img src={comic.coverUrl} alt={comic.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Read Now</span>
               </div>
             </div>
             <h3 className="font-bold truncate text-sm md:text-base group-hover:text-pink-500 transition-colors">{comic.title}</h3>
             <p className="text-xs text-gray-500">{comic.author}</p>
           </div>
         ))}
         
         {/* Placeholder for more */}
         {[1,2,3].map(i => (
             <div key={i} className="opacity-40 pointer-events-none grayscale">
                 <div className="w-full aspect-[2/3] bg-neutral-800 rounded-lg mb-3 flex items-center justify-center border border-neutral-700 border-dashed">
                    <span className="text-neutral-600 font-bold text-xs uppercase">Coming Soon</span>
                 </div>
                 <div className="h-4 bg-neutral-800 rounded w-3/4 mb-2"></div>
                 <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
             </div>
         ))}
       </div>
    </div>
  );
};