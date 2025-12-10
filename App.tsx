
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { UserProvider, useUser } from './context/UserContext';
import { Sidebar } from './components/Layout/Sidebar';
import { MobileNav } from './components/Layout/MobileNav';
import { PlayerBar } from './components/Player/PlayerBar';
import { AuthPage } from './pages/Auth';
import { Home } from './pages/Home';
import { Comics } from './pages/Comics';
import { Profile } from './pages/Profile';
import { Debug } from './pages/Debug';
import { Logo } from './components/Logo';
import { ErrorBoundary } from './components/Debug/ErrorBoundary';
import { LogOut } from 'lucide-react';

// Inner App Content to access Contexts
const AppContent: React.FC = () => {
  const { user, login, logout } = useUser();

  if (!user) {
    return <AuthPage onLogin={login} />;
  }

  return (
    <PlayerProvider>
      <Router>
        <div className="flex h-screen bg-black text-white overflow-hidden">
          <Sidebar onLogout={logout} />
          
          <main className="flex-1 overflow-y-auto relative bg-gradient-to-b from-neutral-900 to-black">
            {/* Top Bar Decoration (Mobile) */}
            <div className="sticky top-0 z-30 px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-md md:hidden">
                <div className="flex items-center space-x-2">
                    <Logo className="w-8 h-8" />
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">MUSICPOD</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button onClick={logout} className="text-gray-400 hover:text-white">
                    <LogOut size={20} />
                  </button>
                  <Link to="/profile">
                    <img 
                      src={user.avatarUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full bg-neutral-700 object-cover border border-neutral-600"
                    />
                  </Link>
                </div>
            </div>

            <div className="md:px-0">
                <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/search" element={<div className="p-8 text-center text-gray-500">Search Feature Coming Soon</div>} />
                      <Route path="/library" element={<div className="p-8 text-center text-gray-500">Your Library is Empty</div>} />
                      <Route path="/comics" element={<Comics />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/debug" element={<Debug />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </ErrorBoundary>
            </div>
            
            {/* Spacer for bottom player */}
            <div className="h-24 md:h-28 w-full"></div>
          </main>

          <PlayerBar />
          <MobileNav />
        </div>
      </Router>
    </PlayerProvider>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;
