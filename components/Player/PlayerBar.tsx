
import React, { useState, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Download, Check, Loader2 } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

export const PlayerBar: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    currentTime, 
    duration, 
    seek, 
    volume, 
    setVolume,
    downloadTrack,
    removeOfflineTrack,
    offlineTrackIds,
    isDownloading
  } = usePlayer();

  const [isVolumeChanging, setIsVolumeChanging] = useState(false);
  const volumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!currentTrack) return null;

  const isOffline = offlineTrackIds.has(currentTrack.id);

  const handleDownloadToggle = () => {
    if (isOffline) {
      removeOfflineTrack(currentTrack.id);
    } else {
      downloadTrack(currentTrack);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setIsVolumeChanging(true);

    if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
    }
    volumeTimeoutRef.current = setTimeout(() => {
        setIsVolumeChanging(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-[60px] md:bottom-0 left-0 w-full bg-neutral-900/95 md:bg-neutral-900 border-t border-neutral-800 p-2 md:p-3 z-50 h-[80px] md:h-24 flex items-center justify-between text-white backdrop-blur-xl shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
      
      {/* Track Info - Responsive Width */}
      <div className="flex items-center w-auto max-w-[40%] md:w-1/4 md:min-w-[120px] transition-all">
        <img 
          src={currentTrack.coverUrl} 
          alt={currentTrack.title} 
          className="h-10 w-10 md:h-14 md:w-14 rounded-lg shadow-lg object-cover flex-shrink-0" 
        />
        <div className="ml-2 md:ml-3 overflow-hidden mr-2">
          <h4 className="text-sm md:text-base font-medium truncate pr-2">{currentTrack.title}</h4>
          <p className="text-[10px] md:text-xs text-gray-400 truncate">{currentTrack.artist}</p>
        </div>
        
        {/* Offline Button */}
        <button 
          onClick={handleDownloadToggle}
          disabled={isDownloading}
          className="hidden md:flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition"
          title={isOffline ? "Remove Download" : "Download for Offline"}
        >
          {isDownloading ? (
             <Loader2 size={16} className="text-pink-500 animate-spin" />
          ) : isOffline ? (
             <Check size={18} className="text-green-500" />
          ) : (
             <Download size={18} className="text-gray-400 hover:text-white" />
          )}
        </button>
      </div>

      {/* Controls & Seek - Centered Mobile */}
      <div className="flex flex-col items-center flex-1 md:w-2/4 max-w-2xl px-2 md:px-4">
        <div className="flex items-center justify-center space-x-4 md:space-x-6 mb-1 md:mb-2">
          <button className="text-gray-400 hover:text-white transition active:scale-95"><SkipBack size={20} className="md:w-6 md:h-6" /></button>
          
          <button 
            onClick={togglePlay}
            className="h-9 w-9 md:h-12 md:w-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg shadow-white/10"
          >
            {isPlaying ? <Pause size={18} className="md:w-6 md:h-6" fill="black" /> : <Play size={18} className="ml-1 md:w-6 md:h-6" fill="black" />}
          </button>
          
          <button className="text-gray-400 hover:text-white transition active:scale-95"><SkipForward size={20} className="md:w-6 md:h-6" /></button>
        </div>
        
        {/* Seek Bar */}
        <div className="w-full flex items-center space-x-2 text-[10px] md:text-xs text-gray-400 font-mono">
          <span className="hidden md:block">{formatTime(currentTime)}</span>
          <div className="relative w-full h-1 md:h-1.5 group cursor-pointer">
             <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="absolute w-full h-full opacity-0 z-10 cursor-pointer"
            />
            <div className="absolute top-0 left-0 h-full bg-gray-700 rounded-full w-full"></div>
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all" 
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            ></div>
             {/* Progress Thumb */}
             <div 
                className="absolute top-1/2 -mt-1.5 md:-mt-2 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-md transition-all pointer-events-none opacity-0 group-hover:opacity-100"
                style={{ left: `${(currentTime / (duration || 1)) * 100}%`, transform: 'translateX(-50%)' }}
             ></div>
          </div>
          <span className="hidden md:block">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Extras - Hidden on Mobile */}
      <div className="hidden md:flex items-center justify-end w-1/4 space-x-4">
        <div className="flex items-center w-28 space-x-2 group">
          <Volume2 
            size={18} 
            className={`transition-transform duration-300 ${isVolumeChanging ? 'text-white scale-110' : 'text-gray-400'}`} 
          />
          
          <div className="relative w-full h-1 flex items-center">
             <div className="absolute w-full h-1 bg-gray-700 rounded-full"></div>
             
             <div 
                className={`absolute h-1 rounded-full transition-all duration-150 ease-out ${isVolumeChanging ? 'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]' : 'bg-white group-hover:bg-green-400'}`}
                style={{ width: `${volume * 100}%` }}
             ></div>

             <div 
                className={`absolute w-3 h-3 bg-white rounded-full shadow-md transition-all duration-150 ease-out pointer-events-none ${isVolumeChanging ? 'opacity-100 scale-125' : 'opacity-0 group-hover:opacity-100 scale-100'}`}
                style={{ left: `${volume * 100}%`, transform: 'translateX(-50%)' }}
             ></div>

             <input 
                type="range" 
                min={0} 
                max={1} 
                step={0.01} 
                value={volume}
                onChange={handleVolumeChange}
                className="absolute w-full h-4 opacity-0 cursor-pointer z-10 -top-1.5"
             />
          </div>
        </div>
        <button className="text-gray-400 hover:text-white"><Maximize2 size={18} /></button>
      </div>
    </div>
  );
};
