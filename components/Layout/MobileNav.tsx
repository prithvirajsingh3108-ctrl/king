import React from 'react';
import { Home, Search, Library, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? "text-white" : "text-gray-500";

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-[60px] bg-black/95 backdrop-blur-md border-t border-neutral-800 flex justify-around items-center z-50">
      <Link to="/" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/')}`}>
        <Home size={24} />
        <span className="text-[10px] mt-1">Home</span>
      </Link>
      <Link to="/search" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/search')}`}>
        <Search size={24} />
        <span className="text-[10px] mt-1">Search</span>
      </Link>
      <Link to="/comics" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/comics')}`}>
        <BookOpen size={24} />
        <span className="text-[10px] mt-1">Comics</span>
      </Link>
      <Link to="/library" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/library')}`}>
        <Library size={24} />
        <span className="text-[10px] mt-1">Library</span>
      </Link>
    </div>
  );
};