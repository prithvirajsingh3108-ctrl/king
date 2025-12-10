import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { FEATURED_PLAYLISTS, MOCK_TRACKS } from '../constants';
import { Play } from 'lucide-react';

export const Home: React.FC = () => {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer();

  const handlePlayClick = (e: React.MouseEvent, track: any) => {
    e.preventDefault();
    e.stopPropagation();
    playTrack(track);
  };

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return 'Good Morning';
    if (hours >= 12 && hours < 17) return 'Good Afternoon';
    if (hours >= 17 && hours < 21) return 'Good Evening';
    return 'Good Night';
  };

  return (
    <div className="p-4 md:p-8 pb-32 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">{getGreeting()}</h2>

      {/* Hero Section / Featured */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 md:mb-10">
        {FEATURED_PLAYLISTS.map((playlist) => (
          <div key={playlist.id} className="group relative bg-neutral-800/50 hover:bg-neutral-800 rounded-lg p-3 md:p-4 transition duration-300 flex items-center space-x-4 cursor-pointer">
            <img src={playlist.coverUrl} alt={playlist.title} className="w-16 h-16 md:w-20 md:h-20 rounded shadow-lg object-cover" />
            <div className="flex-1">
              <h3 className="font-bold text-base md:text-lg mb-1">{playlist.title}</h3>
              <p className="text-xs md:text-sm text-gray-400 line-clamp-2">{playlist.description}</p>
            </div>
            <button 
               onClick={(e) => handlePlayClick(e, playlist.tracks[0])}
               className="absolute right-4 bottom-4 bg-green-500 rounded-full p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all shadow-xl z-10 hidden md:block"
            >
              <Play fill="black" className="text-black ml-1" size={20} />
            </button>
            {/* Mobile Play Button always visible but subtle */}
            <button 
               onClick={(e) => handlePlayClick(e, playlist.tracks[0])}
               className="md:hidden p-2 bg-neutral-700 rounded-full"
            >
                <Play fill="white" size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Made For You - Track Grid */}
      <section className="mb-8 md:mb-10">
        <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-5">Made For You</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
          {MOCK_TRACKS.map((track) => {
             const isCurrent = currentTrack?.id === track.id;
             return (
              <div 
                key={track.id} 
                onClick={() => playTrack(track)}
                className="group bg-neutral-900/50 p-3 md:p-4 rounded-xl hover:bg-neutral-800 transition cursor-pointer"
              >
                <div className="relative mb-3 md:mb-4">
                  <img src={track.coverUrl} alt={track.title} className="w-full aspect-square object-cover rounded-lg shadow-md" />
                  <div className={`absolute bottom-2 right-2 ${isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                     <button className="bg-pink-500 rounded-full p-2 md:p-3 shadow-lg hover:scale-105 transition">
                        {isCurrent && isPlaying ? (
                            <div className="flex space-x-1 h-3 md:h-4 items-end justify-center w-3 md:w-4">
                                <div className="w-0.5 md:w-1 bg-black animate-[bounce_1s_infinite] h-2"></div>
                                <div className="w-0.5 md:w-1 bg-black animate-[bounce_1.2s_infinite] h-3"></div>
                                <div className="w-0.5 md:w-1 bg-black animate-[bounce_0.8s_infinite] h-2.5"></div>
                            </div>
                        ) : (
                             <Play fill="black" className="text-black ml-0.5" size={14} />
                        )}
                     </button>
                  </div>
                </div>
                <h4 className={`font-semibold text-sm md:text-base truncate ${isCurrent ? 'text-pink-500' : 'text-white'}`}>{track.title}</h4>
                <p className="text-xs md:text-sm text-gray-400 truncate mt-1">{track.artist}</p>
              </div>
            );
          })}
        </div>
      </section>
      
      {/* Artist Section Clone Style */}
      <section>
        <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-5">Popular Artists</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
           {['The Weeknd', 'Taylor Swift', 'Drake', 'Bad Bunny', 'Dua Lipa', 'BTS'].map((artist, i) => (
             <div key={i} className="flex flex-col items-center group cursor-pointer">
                <img 
                  src={`https://picsum.photos/id/${60 + i}/200/200`} 
                  alt={artist} 
                  className="w-full aspect-square rounded-full object-cover mb-3 shadow-lg group-hover:shadow-pink-500/20 transition duration-300 border-2 border-transparent group-hover:border-pink-500" 
                />
                <span className="font-medium text-xs md:text-base text-center truncate w-full">{artist}</span>
                <span className="text-[10px] md:text-xs text-gray-500">Artist</span>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};