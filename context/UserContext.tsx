import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserType, Track } from '../types';
import { MOCK_TRACKS } from '../constants';

interface UserContextType {
  user: User | null;
  history: Track[];
  artistTracks: Track[];
  login: (type: UserType) => void;
  logout: () => void;
  updateAvatar: (url: string) => void;
  addToHistory: (track: Track) => void;
  uploadTrack: (track: Track) => void;
  deleteTrack: (trackId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_USER_AVATAR = "https://picsum.photos/id/64/200/200";

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize user from localStorage
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('musicpod_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error("Failed to load user from storage", e);
      return null;
    }
  });

  // Initialize history from localStorage
  const [history, setHistory] = useState<Track[]>(() => {
    try {
      const savedHistory = localStorage.getItem('musicpod_history');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (e) {
      console.error("Failed to load history from storage", e);
      return [];
    }
  });

  // Initialize artist tracks (Mocking some initial data for the artist)
  const [artistTracks, setArtistTracks] = useState<Track[]>(() => {
    try {
      const savedTracks = localStorage.getItem('musicpod_artist_tracks');
      // If no saved tracks, seed with one mock track if user is artist, else empty
      if (savedTracks) return JSON.parse(savedTracks);
      return [MOCK_TRACKS[5]]; // Seed with 'High In You'
    } catch (e) {
      return [];
    }
  });

  // Persist user changes
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('musicpod_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('musicpod_user');
      }
    } catch (e) {
      console.error("Failed to save user to storage", e);
    }
  }, [user]);

  // Persist history changes
  useEffect(() => {
    try {
      localStorage.setItem('musicpod_history', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to storage", e);
    }
  }, [history]);

  // Persist artist tracks
  useEffect(() => {
    try {
      localStorage.setItem('musicpod_artist_tracks', JSON.stringify(artistTracks));
    } catch (e) {
      console.error("Failed to save artist tracks", e);
    }
  }, [artistTracks]);

  const login = (type: UserType) => {
    // Mock login data
    setUser({
      id: 'u1',
      name: type === 'artist' ? 'Karan Ahuja' : 'Music Fan',
      type,
      avatarUrl: DEFAULT_USER_AVATAR
    });
  };

  const logout = () => {
    setUser(null);
    setHistory([]);
    // We don't clear artist tracks on logout to simulate data persistence
    localStorage.removeItem('musicpod_user');
    localStorage.removeItem('musicpod_history');
    localStorage.removeItem('musicpod_comic_progress');
  };

  const updateAvatar = (url: string) => {
    if (user) {
      setUser({ ...user, avatarUrl: url });
    }
  };

  const addToHistory = (track: Track) => {
    setHistory((prev) => {
      // Remove track if it exists to move it to the top, preventing duplicates at the top
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered].slice(0, 50); // Keep last 50 tracks
    });
  };

  const uploadTrack = (track: Track) => {
    setArtistTracks(prev => [track, ...prev]);
  };

  const deleteTrack = (trackId: string) => {
    setArtistTracks(prev => prev.filter(t => t.id !== trackId));
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      history, 
      artistTracks, 
      login, 
      logout, 
      updateAvatar, 
      addToHistory, 
      uploadTrack, 
      deleteTrack 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};