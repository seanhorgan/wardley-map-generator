
import React, { useState, useEffect } from 'react';
import { MapNodeData, ComponentType } from '../types';
import { SoftwareIcon, HardwareIcon, ServiceIcon, XIcon } from './icons';

interface MapNodeProps {
  node: MapNodeData;
  position: { x: number; y: number };
  drawingState: { isDrawing: boolean; fromId: string | null };
  onNodeUpdate: (id: string, updates: Partial<MapNodeData>) => void;
  onNodeRemove: (id: string) => void;
  onNodeClick: (id: string) => void;
}

const TYPE_STYLES = {
  [ComponentType.Software]: 'bg-sky-500/20 border-sky-400 text-sky-200',
  [ComponentType.Hardware]: 'bg-teal-500/20 border-teal-400 text-teal-200',
  [ComponentType.Service]: 'bg-indigo-500/20 border-indigo-400 text-indigo-200',
};

const TYPE_ICONS = {
  [ComponentType.Software]: <SoftwareIcon className="w-4 h-4 flex-shrink-0" />,
  [ComponentType.Hardware]: <HardwareIcon className="w-4 h-4 flex-shrink-0" />,
  [ComponentType.Service]: <ServiceIcon className="w-4 h-4 flex-shrink-0" />,
};

const MapNode: React.FC<MapNodeProps> = ({ node, position, drawingState, onNodeUpdate, onNodeRemove, onNodeClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(node.name);

  useEffect(() => {
    setName(node.name);
  }, [node.name]);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/node-id', node.id);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (name.trim() === '') {
      setName(node.name); // Revert if name is empty
    } else if (name.trim() !== node.name) {
      onNodeUpdate(node.id, { name: name.trim() });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setName(node.name);
      setIsEditing(false);
    }
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeRemove(node.id);
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas click handler from firing
    if (!drawingState.isDrawing) {
      setIsEditing(true);
    }
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent canvas click handler from firing
    if (drawingState.isDrawing) {
      onNodeClick(node.id);
    }
  };

  const isSelectedFromNode = drawingState.isDrawing && drawingState.fromId === node.id;

  const baseClasses = 'absolute flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-lg transition-all duration-200 ease-in-out group border-2';
  const typeClasses = TYPE_STYLES[node.type];
  
  const cursorClass = drawingState.isDrawing ? 'cursor-crosshair' : 'cursor-grab';
  const selectionClass = isSelectedFromNode 
    ? 'border-yellow-400 scale-110 shadow-2xl shadow-yellow-500/30'
    : 'border-transparent hover:scale-110 hover:shadow-xl';


  return (
    <div
      className={`${baseClasses} ${typeClasses} ${cursorClass} ${selectionClass}`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
      }}
      draggable={!isEditing && !drawingState.isDrawing}
      onDragStart={handleDragStart}
      onDoubleClick={handleDoubleClick}
      onClick={handleClick}
    >
      {TYPE_ICONS[node.type]}
      {isEditing ? (
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="bg-transparent border-0 focus:ring-0 w-full p-0 m-0 text-center text-inherit"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="whitespace-nowrap">{node.name}</span>
      )}
      <button 
        onClick={handleRemove}
        className="absolute -top-2 -right-2 w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
        aria-label={`Remove ${node.name}`}
      >
        <XIcon className="w-3 h-3 text-white"/>
      </button>
    </div>
  );
};

export default MapNode;
