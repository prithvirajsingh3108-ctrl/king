import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Track } from '../types';
import { useUser } from './UserContext';

// --- IndexedDB Helper Utils ---
const DB_NAME = 'musicpod_db';
const STORE_NAME = 'offline_tracks';
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveToIDB = async (id: string, blob: Blob) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(blob, id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const getFromIDB = async (id: string): Promise<Blob | undefined> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const deleteFromIDB = async (id: string) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const getAllKeysFromIDB = async (): Promise<string[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAllKeys();
    request.onsuccess = () => resolve(request.result as string[]);
    request.onerror = () => reject(request.error);
  });
};
// ----------------------------

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
  volume: number;
  setVolume: (vol: number) => void;
  // Offline features
  downloadTrack: (track: Track) => Promise<void>;
  removeOfflineTrack: (trackId: string) => Promise<void>;
  offlineTrackIds: Set<string>;
  isDownloading: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  
  // Offline State
  const [offlineTrackIds, setOfflineTrackIds] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { addToHistory } = useUser();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize DB and load saved keys
  useEffect(() => {
    getAllKeysFromIDB().then((keys) => {
      setOfflineTrackIds(new Set(keys));
    }).catch(err => console.error("Failed to load offline keys", err));
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = async (track: Track) => {
    if (audioRef.current) {
      // If same track, just toggle
      if (currentTrack?.id === track.id) {
        togglePlay();
        return;
      }
      
      addToHistory(track);
      setCurrentTrack(track); // Set immediate UI feedback

      // Check if offline
      try {
        const blob = await getFromIDB(track.id);
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          audioRef.current.src = blobUrl;
          console.log("Playing from Offline Storage");
        } else {
          audioRef.current.src = track.audioUrl;
          console.log("Playing from Network");
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback error:", err);
        setIsPlaying(false);
      }
    }
  };

  const togglePlay = () => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const downloadTrack = async (track: Track) => {
    if (offlineTrackIds.has(track.id)) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(track.audioUrl);
      const blob = await response.blob();
      await saveToIDB(track.id, blob);
      
      setOfflineTrackIds(prev => new Set(prev).add(track.id));
    } catch (e) {
      console.error("Download failed", e);
      alert("Failed to download track. Check your connection or CORS settings.");
    } finally {
      setIsDownloading(false);
    }
  };

  const removeOfflineTrack = async (trackId: string) => {
    try {
      await deleteFromIDB(trackId);
      setOfflineTrackIds(prev => {
        const next = new Set(prev);
        next.delete(trackId);
        return next;
      });
    } catch (e) {
      console.error("Failed to remove track", e);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playTrack,
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
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};