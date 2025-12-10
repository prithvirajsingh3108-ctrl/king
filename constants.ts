import { Track, Comic, Playlist } from './types';

// Mock Audio URL (using a copyright-free placeholder sound for demo)
// In a real app, these would be distinct URLs.
const MOCK_AUDIO = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Midnight City',
    artist: 'M83',
    coverUrl: 'https://picsum.photos/id/10/300/300',
    audioUrl: MOCK_AUDIO,
    duration: 240,
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    coverUrl: 'https://picsum.photos/id/11/300/300',
    audioUrl: MOCK_AUDIO,
    duration: 200,
  },
  {
    id: '3',
    title: 'Levitating',
    artist: 'Dua Lipa',
    coverUrl: 'https://picsum.photos/id/12/300/300',
    audioUrl: MOCK_AUDIO,
    duration: 210,
  },
  {
    id: '4',
    title: 'Space Oddity',
    artist: 'David Bowie',
    coverUrl: 'https://picsum.photos/id/13/300/300',
    audioUrl: MOCK_AUDIO,
    duration: 300,
  },
  {
    id: '5',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    coverUrl: 'https://picsum.photos/id/14/300/300',
    audioUrl: MOCK_AUDIO,
    duration: 355,
  },
  {
    id: '6',
    title: 'High In You',
    artist: 'Karan Ahuja',
    coverUrl: 'https://picsum.photos/id/18/300/300',
    audioUrl: MOCK_AUDIO,
    duration: 215,
  }
];

export const MOCK_COMICS: Comic[] = [
  {
    id: 'c1',
    title: 'Cyberpunk Chronicles',
    author: 'Neo Tokyo',
    coverUrl: 'https://picsum.photos/id/20/400/600',
    pages: [
      'https://picsum.photos/id/20/800/1200',
      'https://picsum.photos/id/21/800/1200',
      'https://picsum.photos/id/22/800/1200',
    ]
  },
  {
    id: 'c2',
    title: 'The Silent Void',
    author: 'A. Space',
    coverUrl: 'https://picsum.photos/id/24/400/600',
    pages: [
      'https://picsum.photos/id/24/800/1200',
      'https://picsum.photos/id/25/800/1200',
      'https://picsum.photos/id/26/800/1200',
    ]
  }
];

export const FEATURED_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    title: 'Top Hits 2024',
    description: 'The hottest tracks right now.',
    coverUrl: 'https://picsum.photos/id/30/300/300',
    tracks: [MOCK_TRACKS[5], MOCK_TRACKS[0], MOCK_TRACKS[1], MOCK_TRACKS[2]],
  },
  {
    id: 'p2',
    title: 'Comic Reading Vibes',
    description: 'Ambient sounds for your reading session.',
    coverUrl: 'https://picsum.photos/id/31/300/300',
    tracks: [MOCK_TRACKS[3], MOCK_TRACKS[0]],
  },
  {
    id: 'p3',
    title: 'Deep Focus',
    description: 'Music to help you concentrate.',
    coverUrl: 'https://picsum.photos/id/32/300/300',
    tracks: [MOCK_TRACKS[1], MOCK_TRACKS[4]],
  }
];