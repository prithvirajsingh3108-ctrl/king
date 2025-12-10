import React, { useState, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { usePlayer } from '../context/PlayerContext';
import { Camera, Play, Clock, Music, BarChart3, Upload, Trash2, Disc, MoreHorizontal, Plus, X, LogOut } from 'lucide-react';
import { Track } from '../types';

export const Profile: React.FC = () => {
  const { user, history, updateAvatar, artistTracks, uploadTrack, deleteTrack, logout } = useUser();
  const { playTrack, currentTrack } = usePlayer();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarInput, setAvatarInput] = useState('');
  
  // Artist Upload State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCover, setUploadCover] = useState<File | null>(null);
  const [uploadAudio, setUploadAudio] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleUpdateAvatar = (e: React.FormEvent) => {
    e.preventDefault();
    if (avatarInput.trim()) {
      updateAvatar(avatarInput.trim());
      setIsEditing(false);
      setAvatarInput('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle || !uploadAudio) return;

    setIsUploading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newTrack: Track = {
      id: `art-${Date.now()}`,
      title: uploadTitle,
      artist: user.name,
      // Create local Object URLs for preview/playback
      // Note: These revoke on refresh in a real app without backend, 
      // but perfect for session demo.
      coverUrl: uploadCover ? URL.createObjectURL(uploadCover) : 'https://picsum.photos/300/300',
      audioUrl: URL.createObjectURL(uploadAudio),
      duration: 180, // Mock duration
    };

    uploadTrack(newTrack);
    
    // Reset Form
    setUploadTitle('');
    setUploadCover(null);
    setUploadAudio(null);
    setIsUploading(false);
    setShowUploadModal(false);
  };

  // --- Render Components ---

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fadeIn">
        <button 
          onClick={() => setShowUploadModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-1">Upload New Music</h2>
        <p className="text-gray-400 text-sm mb-6">Share your sound with the world.</p>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Track Title</label>
            <input 
              type="text" 
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500"
              placeholder="e.g. Summer Vibes"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cover Art</label>
               <div 
                 onClick={() => coverInputRef.current?.click()}
                 className="w-full aspect-square bg-neutral-800 border-2 border-dashed border-neutral-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 transition group"
               >
                  {uploadCover ? (
                    <img src={URL.createObjectURL(uploadCover)} className="w-full h-full object-cover rounded-lg" alt="Preview" />
                  ) : (
                    <>
                      <Camera className="text-gray-500 group-hover:text-pink-500 mb-2" />
                      <span className="text-xs text-gray-500">Select Image</span>
                    </>
                  )}
               </div>
               <input type="file" ref={coverInputRef} accept="image/*" onChange={(e) => setUploadCover(e.target.files?.[0] || null)} hidden />
            </div>

            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Audio File</label>
               <div 
                  onClick={() => audioInputRef.current?.click()}
                  className="w-full aspect-square bg-neutral-800 border-2 border-dashed border-neutral-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 transition group"
               >
                  {uploadAudio ? (
                    <div className="flex flex-col items-center text-pink-500">
                       <Music size={32} className="mb-2" />
                       <span className="text-xs text-center px-2 truncate w-full">{uploadAudio.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="text-gray-500 group-hover:text-pink-500 mb-2" />
                      <span className="text-xs text-gray-500">Select MP3</span>
                    </>
                  )}
               </div>
               <input type="file" ref={audioInputRef} accept="audio/*" onChange={(e) => setUploadAudio(e.target.files?.[0] || null)} hidden required />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-lg transition transform active:scale-95 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isUploading ? (
              <span className="animate-pulse">Uploading...</span>
            ) : 'Release Track'}
          </button>
        </form>
      </div>
    </div>
  );

  const ArtistDashboard = () => (
    <div className="animate-fadeIn">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-800">
             <div className="flex items-center space-x-3 text-pink-500 mb-2">
                <BarChart3 size={20} />
                <span className="font-bold text-sm uppercase">Total Streams</span>
             </div>
             <p className="text-4xl font-black">1,245,390</p>
             <p className="text-green-500 text-sm mt-1 flex items-center">
               <span className="mr-1">↑</span> 12% from last month
             </p>
          </div>
          <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-800">
             <div className="flex items-center space-x-3 text-purple-500 mb-2">
                <Disc size={20} />
                <span className="font-bold text-sm uppercase">Monthly Listeners</span>
             </div>
             <p className="text-4xl font-black">842,000</p>
             <p className="text-green-500 text-sm mt-1 flex items-center">
               <span className="mr-1">↑</span> 5.4% from last month
             </p>
          </div>
          <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-800 flex flex-col justify-center items-center text-center">
             <button 
                onClick={() => setShowUploadModal(true)}
                className="bg-white text-black rounded-full px-6 py-3 font-bold hover:scale-105 transition shadow-xl flex items-center space-x-2"
             >
                <Plus size={20} />
                <span>Upload New Music</span>
             </button>
          </div>
       </div>

       <div className="mb-6 flex items-end justify-between">
          <h3 className="text-2xl font-bold">Your Discography</h3>
          <span className="text-gray-400 text-sm">{artistTracks.length} Releases</span>
       </div>

       <div className="bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-800/50 text-xs text-gray-400 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">#</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Streams</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {artistTracks.map((track, i) => (
                <tr key={track.id} className="group hover:bg-white/5 transition">
                   <td className="px-6 py-4 text-gray-500 w-12">{i + 1}</td>
                   <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                         <div className="relative w-10 h-10 flex-shrink-0">
                            <img src={track.coverUrl} className="w-full h-full object-cover rounded" alt={track.title} />
                            <div 
                              onClick={() => playTrack(track)}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition"
                            >
                               <Play size={16} fill="white" />
                            </div>
                         </div>
                         <div>
                            <p className={`font-medium ${currentTrack?.id === track.id ? 'text-pink-500' : 'text-white'}`}>{track.title}</p>
                            <p className="text-xs text-gray-500">Single</p>
                         </div>
                      </div>
                   </td>
                   <td className="px-6 py-4 text-gray-400 hidden md:table-cell font-mono">
                      {Math.floor(Math.random() * 500000).toLocaleString()}
                   </td>
                   <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteTrack(track.id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition rounded-full hover:bg-white/10"
                        title="Delete Release"
                      >
                         <Trash2 size={18} />
                      </button>
                   </td>
                </tr>
              ))}
            </tbody>
          </table>
          {artistTracks.length === 0 && (
             <div className="p-12 text-center text-gray-500">
                You haven't uploaded any music yet.
             </div>
          )}
       </div>
    </div>
  );

  const UserProfile = () => (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-center space-x-2 mb-6">
            <Clock className="text-pink-500" />
            <h2 className="text-2xl font-bold">Listening History</h2>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/50 rounded-xl border border-dashed border-neutral-800">
             <Music size={48} className="mx-auto text-neutral-700 mb-4" />
             <p className="text-gray-500">You haven't played any tracks yet.</p>
             <p className="text-sm text-neutral-600">Start listening to see your history here.</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {history.map((track, index) => {
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <div 
                    key={`${track.id}-${index}`} 
                    onClick={() => playTrack(track)}
                    className="group flex items-center p-3 rounded-lg hover:bg-white/10 transition cursor-pointer"
                  >
                    <div className="w-8 text-center text-gray-500 mr-4 text-sm group-hover:hidden">{index + 1}</div>
                    <div className="w-8 mr-4 hidden group-hover:flex justify-center">
                        <Play size={16} fill="white" />
                    </div>
                    
                    <img src={track.coverUrl} alt={track.title} className="w-12 h-12 rounded object-cover mr-4" />
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${isCurrent ? 'text-pink-500' : 'text-white'}`}>{track.title}</h4>
                      <p className="text-sm text-gray-400">{track.artist}</p>
                    </div>
                    
                    <div className="text-sm text-gray-500 font-mono">
                      {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                );
            })}
          </div>
        )}
      </div>
  );

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-32">
      {showUploadModal && <UploadModal />}

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8 mb-12">
        <div className="relative group">
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-40 h-40 md:w-52 md:h-52 rounded-full object-cover shadow-2xl border-4 border-neutral-800"
          />
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-2 right-2 p-3 bg-pink-600 rounded-full text-white shadow-lg hover:bg-pink-500 transition group-hover:scale-110"
          >
            <Camera size={20} />
          </button>
        </div>

        <div className="text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
             <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Profile</p>
             {user.type === 'artist' && <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">Verified Artist</span>}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">{user.name}</h1>
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start space-y-2 md:space-y-0 md:space-x-2 text-gray-400 text-sm">
            <div className="flex items-center space-x-2">
                {user.type === 'artist' ? (
                    <>
                    <span>{artistTracks.length} Releases</span>
                    <span>•</span>
                    <span>Global Artist</span>
                    </>
                ) : (
                    <>
                    <span>{history.length} Songs Played</span>
                    <span>•</span>
                    <span className="capitalize">{user.type} Account</span>
                    </>
                )}
            </div>
            
            {/* Mobile Logout - Visible only on mobile layout inside profile info */}
            <button 
                onClick={logout}
                className="md:hidden flex items-center space-x-1 text-red-500 font-bold border border-red-500/50 rounded-full px-3 py-1 mt-2 active:bg-red-500/10"
            >
                <LogOut size={14} />
                <span>Log Out</span>
            </button>
          </div>

          {isEditing && (
            <form onSubmit={handleUpdateAvatar} className="mt-6 flex items-center space-x-2 animate-fadeIn">
              <input 
                type="text" 
                placeholder="Paste Image URL..." 
                value={avatarInput}
                onChange={(e) => setAvatarInput(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm w-full md:w-80 focus:outline-none focus:border-pink-500"
              />
              <button type="submit" className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200">Save</button>
              <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white px-2">Cancel</button>
            </form>
          )}
        </div>
      </div>

      {/* Content Switching based on User Type */}
      {user.type === 'artist' ? <ArtistDashboard /> : <UserProfile />}
    </div>
  );
};