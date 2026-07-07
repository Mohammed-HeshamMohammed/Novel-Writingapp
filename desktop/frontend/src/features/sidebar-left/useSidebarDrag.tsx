import { useState, useEffect } from 'react';
import React from 'react';

interface UseSidebarDragProps {
  height: number;
  position: number;
  width: number;
  onHeightChange: (height: number) => void;
  onPositionChange: (position: number) => void;
  onWidthChange: (width: number) => void;
}

export const useSidebarDrag = ({ height, position, width, onHeightChange, onPositionChange, onWidthChange }: UseSidebarDragProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'resize' | 'move' | 'width' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, type: 'resize' | 'move' | 'width') => {
    e.preventDefault();
    setIsDragging(true);
    setDragType(type);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragType) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    const windowHeight = window.innerHeight;

    try {
      if (dragType === 'resize') {
        const minHeightPercent = (450 / windowHeight) * 100;
        const newHeight = Math.max(minHeightPercent, Math.min(90, height + (deltaY / windowHeight) * 100));
        onHeightChange(newHeight);
      } else if (dragType === 'move') {
        const newPosition = Math.max(5, Math.min(95 - height, position + (deltaY / windowHeight) * 100));
        onPositionChange(newPosition);
      } else if (dragType === 'width') {
        const newWidth = Math.max(320, Math.min(800, width + deltaX));
        onWidthChange(newWidth);
      }
    } catch (error) {
      console.error('Error updating sidebar dimensions:', error);
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
  };

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.no-drag')) return;
    
    e.preventDefault();
    handleMouseDown(e, 'move');
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragType, dragStart, height, position, width]);

  const DragHandle = ({ type }: { type: 'resize' | 'width' }) => {
    const handleClass = type === 'width' 
      ? "absolute right-0 top-0 w-2 h-full cursor-ew-resize z-50 bg-transparent hover:bg-blue-500/20 transition-colors"
      : "absolute bottom-0 left-0 w-full h-2 cursor-ns-resize z-50 bg-transparent hover:bg-blue-500/20 transition-colors";

    return (
      <div 
        className={handleClass}
        onMouseDown={(e) => handleMouseDown(e, type)}
      />
    );
  };

  return { handleHeaderMouseDown, DragHandle };
};