export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number; // in seconds
}

export interface Comic {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  pages: string[];
}

export type UserType = 'user' | 'artist';

export interface User {
  id: string;
  name: string;
  type: UserType;
  avatarUrl: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
}