import React, { useRef, useState } from 'react';

export default function GridZoneEditor({
  imageUrl,
  cells,
  onCellsChange,
  isEditable,
  children
}: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<boolean | null>(null);

  const getCellIndex = (x: number, y: number, rect: DOMRect) => {
    const col = Math.floor(((x - rect.left) / rect.width) * 10);
    const row = Math.floor(((y - rect.top) / rect.height) * 10);
    if (col >= 0 && col < 10 && row >= 0 && row < 10) {
      return row * 10 + col;
    }
    return -1;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isEditable) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const idx = getCellIndex(e.clientX, e.clientY, rect);
    if (idx !== -1) {
      setIsDragging(true);
      const newValue = !cells[idx];
      setDragMode(newValue);
      const newCells = [...cells];
      newCells[idx] = newValue;
      onCellsChange(newCells);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isEditable || !isDragging || dragMode === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const idx = getCellIndex(e.clientX, e.clientY, rect);
    if (idx !== -1 && cells[idx] !== dragMode) {
      const newCells = [...cells];
      newCells[idx] = dragMode;
      onCellsChange(newCells);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      setDragMode(null);
      const target = e.target as HTMLElement;
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }
    }
  };

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

      {isEditable && (
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={`grid-${i}`} className="border-[0.5px] border-white/20" />
          ))}
        </div>
      )}

      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 pointer-events-none">
        {cells.map((active: boolean, i: number) => (
          <div 
            key={i} 
            className={`transition-colors duration-150 ${active ? 'bg-[#40B5FD]/40' : ''}`}
          />
        ))}
      </div>
      {children}
    </div>
  );
}
