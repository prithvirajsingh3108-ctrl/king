
import React from 'react';
import { Home, Search, Library, BookOpen, LogOut, User as UserIcon, Bug } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from '../Logo';

interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5";

  // Added pb-28 to ensure content isn't hidden behind the fixed player bar
  return (
    <div className="hidden md:flex flex-col w-64 bg-black h-screen p-6 border-r border-neutral-800 pb-28">
      <div className="flex items-center space-x-3 mb-10 px-2">
        <Logo className="w-10 h-10" />
        <h1 className="text-2xl font-bold tracking-tighter">MUSICPOD</h1>
      </div>

      <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
        <Link to="/" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition font-medium ${isActive('/')}`}>
          <Home size={22} />
          <span>Home</span>
        </Link>
        <Link to="/search" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition font-medium ${isActive('/search')}`}>
          <Search size={22} />
          <span>Search</span>
        </Link>
        <Link to="/library" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition font-medium ${isActive('/library')}`}>
          <Library size={22} />
          <span>Library</span>
        </Link>
        
        <div className="pt-6 pb-2">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Features</p>
             <Link to="/comics" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition font-medium ${isActive('/comics')}`}>
                <BookOpen size={22} className="text-pink-500" />
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-bold">Comic Mode</span>
            </Link>
             <Link to="/profile" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition font-medium ${isActive('/profile')}`}>
                <UserIcon size={22} />
                <span>Profile</span>
            </Link>
        </div>

        <div className="pt-6">
             <Link to="/debug" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition font-medium ${isActive('/debug')}`}>
                <Bug size={22} className="text-orange-500" />
                <span>Diagnostics</span>
            </Link>
        </div>
      </nav>

      <button onClick={onLogout} className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-red-500 transition mt-4 shrink-0">
        <LogOut size={20} />
        <span>Log Out</span>
      </button>
    </div>
  );
};
