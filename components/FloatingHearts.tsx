
import React from 'react';

export const FloatingElements: React.FC<{ type: 'HEART' | 'BLOB' | 'EMOJI' | 'CONFETTI' }> = ({ type }) => {
  const items = Array.from({ length: 20 });
  
  const getSymbol = () => {
    if (type === 'HEART') {
        const hearts = ['❤️', '💖', '✨', '🌹'];
        return hearts[Math.floor(Math.random() * hearts.length)];
    }
    if (type === 'BLOB') {
        return <div className="w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />;
    }
    if (type === 'CONFETTI') {
        const party = ['🎉', '🎈', '✨', '🎁', '🎂', '🥳'];
        return party[Math.floor(Math.random() * party.length)];
    }
    const emojis = ['🔥', '✨', '⚡', '💫', '🤟'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map((_, i) => (
        <div
          key={i}
          className={`absolute text-2xl animate-float opacity-20`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 10}s`,
            fontSize: `${1 + Math.random() * 2}rem`
          }}
        >
          {getSymbol()}
        </div>
      ))}
    </div>
  );
};
