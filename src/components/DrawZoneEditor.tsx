import React, { useRef, useState } from 'react';

export default function DrawZoneEditor({
  imageUrl,
  points,
  onPointsChange,
  isEditable,
  children
}: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isEditable) return;
    setIsDrawing(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onPointsChange([{ x, y }]);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isEditable || !isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    // only add point if distance is sufficient to avoid creating too many points
    const lastPoint = points[points.length - 1];
    if (!lastPoint || Math.hypot(lastPoint.x - x, lastPoint.y - y) > 1) {
      onPointsChange([...points, { x, y }]);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDrawing) {
      setIsDrawing(false);
      const target = e.target as HTMLElement;
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }
    }
  };

  const polygonPoints = points.map((p: any) => `${p.x},${p.y}`).join(' ');

  return (
    <div 
      className="relative w-full aspect-[4/3] bg-black select-none touch-none overflow-hidden"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img src={imageUrl} alt="Camera view" className="w-full h-full object-cover pointer-events-none" draggable={false} />
      
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
        {points.length > 2 && (
          <polygon 
            points={polygonPoints} 
            fill="rgba(64, 181, 253, 0.3)"
            stroke="#40B5FD"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {points.length > 0 && points.length <= 2 && (
          <polyline 
            points={polygonPoints} 
            fill="none"
            stroke="#40B5FD"
            strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      {isEditable && points.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white text-sm opacity-60 font-medium">
          Draw a shape with your finger
        </div>
      )}
      {children}
    </div>
  );
}
