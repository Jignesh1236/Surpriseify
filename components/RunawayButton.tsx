
import React, { useState } from 'react';

interface RunawayButtonProps {
  label: string;
  className?: string;
}

export const RunawayButton: React.FC<RunawayButtonProps> = ({ label, className }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const moveButton = () => {
    const newX = (Math.random() - 0.5) * 300;
    const newY = (Math.random() - 0.5) * 300;
    setPosition({ x: newX, y: newY });
  };

  return (
    <button
      onMouseEnter={moveButton}
      onTouchStart={moveButton}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.2s ease-out'
      }}
      className={`px-8 py-3 rounded-full border border-white/30 text-white/60 hover:bg-white/10 transition-colors ${className}`}
    >
      {label}
    </button>
  );
};
