import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`${className} relative flex items-center justify-center bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl shadow-lg border-t border-white/20`}>
       {/* Classic Vinyl/Pod Icon Style */}
      <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-white" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18V5L21 3V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="6" cy="18" r="3" fill="currentColor" />
        <circle cx="18" cy="16" r="3" fill="currentColor" />
      </svg>
    </div>
  );
};