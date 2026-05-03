import React, { useRef, useState } from 'react';

export default function CameraView({
  imageUrl,
  points,
  isEditable,
  onPointsChange,
  largeGrabPoints,
  children
}: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    if (!isEditable) return;
    e.preventDefault();
    e.stopPropagation();
    setDraggingId(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isEditable || !draggingId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));

    onPointsChange(points.map((p: any) => p.id === draggingId ? { ...p, x, y } : p));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingId) {
      const target = e.target as HTMLElement;
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }
      setDraggingId(null);
    }
  };

  const polygonPoints = points.map((p: any) => `${p.x},${p.y}`).join(' ');

  return (
    <div 
      className="relative w-full aspect-[4/3] bg-black select-none touch-none overflow-hidden"
      ref={containerRef}
    >
      <img src={imageUrl} alt="Camera view" className="w-full h-full object-cover pointer-events-none" draggable={false} />
      
      {/* Fisheye / Barrel distortion bezel overlay to simulate the night view screenshot */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.85) 85%, black 100%)'
        }}
      />

      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon 
          points={polygonPoints} 
          fill="rgba(64, 181, 253, 0.3)"
          stroke="#40B5FD"
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {isEditable && points.map((p: any) => (
        <div
          key={p.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing flex items-center justify-center rounded-full z-20 group"
          style={{ 
            left: `${p.x}%`, 
            top: `${p.y}%`, 
            width: '80px', /* Extemely large hit target */
            height: '80px',
            touchAction: 'none'
          }}
          onPointerDown={(e) => handlePointerDown(e, p.id)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Visible dot */}
          <div className={`${largeGrabPoints ? 'w-[32px] h-[32px] bg-[#40B5FD]/80 border-2 border-white/50' : 'w-[18px] h-[18px] bg-[#40B5FD]'} rounded-full pointer-events-none group-active:scale-125 transition-transform shadow-sm`} />
        </div>
      ))}
      
      {children}
    </div>
  );
}
