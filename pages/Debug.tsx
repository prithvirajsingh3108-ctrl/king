
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../utils/formatters';
import { Activity, Database, CheckCircle, XCircle, Play, Pause, Bug } from 'lucide-react';

export const Debug: React.FC = () => {
  const userContext = useUser();
  const playerContext = usePlayer();
  const [testResults, setTestResults] = useState<{name: string, passed: boolean, expected: any, actual: any}[]>([]);
  const [systemCheck, setSystemCheck] = useState<{name: string, status: 'ok' | 'error' | 'loading', message?: string}[]>([]);

  // 1. Unit Tests Runner
  const runUnitTests = () => {
    const results = [];

    // Test: formatTime
    const t1 = formatTime(65);
    results.push({ name: 'formatTime(65) should be 1:05', passed: t1 === '1:05', expected: '1:05', actual: t1 });

    const t2 = formatTime(0);
    results.push({ name: 'formatTime(0) should be 0:00', passed: t2 === '0:00', expected: '0:00', actual: t2 });

    const t3 = formatTime(3600);
    results.push({ name: 'formatTime(3600) should be 60:00', passed: t3 === '60:00', expected: '60:00', actual: t3 });
    
    // Test: formatTime Negative/Invalid
    const t4 = formatTime(-10);
    results.push({ name: 'formatTime(-10) should handle negative', passed: t4 === '0:00', expected: '0:00', actual: t4 });

    setTestResults(results);
  };

  // 2. System Diagnostics
  useEffect(() => {
    const checks = [];
    
    // Check Audio API
    if (window.AudioContext || (window as any).webkitAudioContext) {
      checks.push({ name: 'Web Audio API', status: 'ok' as const, message: 'Supported' });
    } else {
      checks.push({ name: 'Web Audio API', status: 'error' as const, message: 'Not Supported' });
    }

    // Check IndexedDB
    if (window.indexedDB) {
      checks.push({ name: 'IndexedDB', status: 'ok' as const, message: 'Supported' });
    } else {
      checks.push({ name: 'IndexedDB', status: 'error' as const, message: 'Not Supported' });
    }

    // Check LocalStorage
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        checks.push({ name: 'LocalStorage', status: 'ok' as const, message: 'Writable' });
    } catch(e) {
        checks.push({ name: 'LocalStorage', status: 'error' as const, message: 'Not Writable' });
    }

    setSystemCheck(checks);
    runUnitTests();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto pb-32">
      <div className="flex items-center space-x-3 mb-8">
        <Bug className="text-pink-500 w-8 h-8" />
        <h1 className="text-3xl font-bold">Developer Diagnostics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Column 1: Tests & System */}
        <div className="space-y-8">
            {/* System Health */}
            <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center"><Activity size={20} className="mr-2 text-blue-500" /> System Health</h2>
                <div className="space-y-3">
                    {systemCheck.map((check, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-lg">
                            <span className="font-medium">{check.name}</span>
                            <div className="flex items-center">
                                <span className={`text-sm mr-2 ${check.status === 'ok' ? 'text-green-500' : 'text-red-500'}`}>{check.message}</span>
                                {check.status === 'ok' ? <CheckCircle size={18} className="text-green-500" /> : <XCircle size={18} className="text-red-500" />}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Unit Tests */}
            <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center"><CheckCircle size={20} className="mr-2 text-purple-500" /> Unit Tests (Formatters)</h2>
                    <button onClick={runUnitTests} className="text-xs bg-neutral-800 px-3 py-1 rounded hover:bg-neutral-700">Rerun</button>
                </div>
                <div className="space-y-2">
                    {testResults.map((test, i) => (
                        <div key={i} className={`p-3 rounded-lg border-l-4 ${test.passed ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
                            <div className="flex justify-between items-start">
                                <span className="font-medium text-sm">{test.name}</span>
                                {test.passed ? <span className="text-green-500 text-xs font-bold">PASS</span> : <span className="text-red-500 text-xs font-bold">FAIL</span>}
                            </div>
                            {!test.passed && (
                                <div className="mt-2 text-xs font-mono text-gray-400">
                                    Expected: <span className="text-white">{test.expected}</span> | Actual: <span className="text-red-400">{test.actual}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>

        {/* Column 2: Live State Inspector */}
        <div className="space-y-8">
            <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Database size={100} />
                </div>
                <h2 className="text-xl font-bold mb-4 flex items-center"><Database size={20} className="mr-2 text-orange-500" /> Live State Inspector</h2>
                
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Player Context</h3>
                        <div className="bg-black/50 p-4 rounded-lg font-mono text-xs text-green-400 overflow-x-auto">
                            <pre>
{JSON.stringify({
    isPlaying: playerContext.isPlaying,
    currentTime: playerContext.currentTime.toFixed(2),
    duration: playerContext.duration.toFixed(2),
    volume: playerContext.volume,
    isDownloading: playerContext.isDownloading,
    offlineTracksCount: playerContext.offlineTrackIds.size,
    currentTrack: playerContext.currentTrack ? {
        id: playerContext.currentTrack.id,
        title: playerContext.currentTrack.title
    } : 'None'
}, null, 2)}
                            </pre>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">User Context</h3>
                        <div className="bg-black/50 p-4 rounded-lg font-mono text-xs text-blue-400 overflow-x-auto">
                            <pre>
{JSON.stringify({
    user: userContext.user,
    historyCount: userContext.history.length,
    artistTracksCount: userContext.artistTracks.length
}, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                 <h2 className="text-xl font-bold mb-4">Debug Actions</h2>
                 <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => playerContext.togglePlay()} 
                        className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded font-bold hover:bg-gray-200"
                    >
                       {playerContext.isPlaying ? <Pause size={16}/> : <Play size={16} />}
                       <span>Toggle Audio</span>
                    </button>
                    
                    <button 
                        onClick={() => {
                             // Force an error to test boundary
                             throw new Error("Manual Test Error Triggered!");
                        }}
                        className="bg-red-900/50 text-red-200 border border-red-800 px-4 py-2 rounded font-bold hover:bg-red-900 transition"
                    >
                        Trigger Crash
                    </button>
                    
                     <button 
                        onClick={() => {
                             localStorage.clear();
                             window.location.reload();
                        }}
                        className="bg-neutral-800 text-gray-300 px-4 py-2 rounded font-bold hover:bg-neutral-700 transition"
                    >
                        Clear LocalStorage
                    </button>
                 </div>
            </section>
        </div>

      </div>
    </div>
  );
};
