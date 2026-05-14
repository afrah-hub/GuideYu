import React, { useEffect, useState } from 'react';

const CursorAura = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      style={{
        background: `radial-gradient(1200px circle at ${position.x}px ${position.y}px, rgba(99, 102, 241, 0.05), transparent 80%)`
      }}
    />
  );
};

export default CursorAura;
