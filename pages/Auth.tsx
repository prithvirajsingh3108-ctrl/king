import React, { useState } from 'react';
import { UserType } from '../types';
import { Logo } from '../components/Logo';

interface AuthPageProps {
  onLogin: (type: UserType) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<UserType>('user');

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-pink-900/30 rounded-full blur-[100px]" />

      <div className="w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl z-10">
        <div className="flex flex-col items-center text-center mb-8">
           <div className="mb-6">
             <Logo className="w-16 h-16" />
           </div>
           <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to MUSICPOD</h1>
           <p className="text-gray-400">Stream Music. Read Comics. Experience Both.</p>
        </div>

        <div className="flex bg-neutral-800 rounded-lg p-1 mb-8">
          <button 
            onClick={() => setActiveTab('user')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'user' ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Listener
          </button>
          <button 
             onClick={() => setActiveTab('artist')}
             className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'artist' ? 'bg-white text-black shadow' : 'text-gray-400 hover:text-white'}`}
          >
            Artist
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onLogin(activeTab); }} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Email</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-lg transition transform active:scale-95 mt-4"
          >
            {activeTab === 'user' ? 'Log In to Listen' : 'Log In to Dashboard'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account? <span className="text-white underline cursor-pointer hover:text-pink-400">Sign Up</span>
        </p>
      </div>
    </div>
  );
};