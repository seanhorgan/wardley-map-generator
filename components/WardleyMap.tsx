
import React, { useMemo, useRef } from 'react';
import { MapNodeData } from '../types';
import MapNode from './MapNode';

interface WardleyMapProps {
  nodes: MapNodeData[];
  stages: string[];
  drawingState: { isDrawing: boolean; fromId: string | null };
  onNodeUpdate: (id: string, updates: Partial<MapNodeData>) => void;
  onNodeRemove: (id: string) => void;
  onDependencyRemove: (fromId: string, toId: string) => void;
  onNodeClick: (id: string) => void;
  onCanvasClick: () => void;
}

const WardleyMap: React.FC<WardleyMapProps> = ({ 
  nodes, 
  stages, 
  drawingState,
  onNodeUpdate, 
  onNodeRemove, 
  onDependencyRemove,
  onNodeClick,
  onCanvasClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const nodePositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number }>();
    nodes.forEach(node => {
      positions.set(node.id, {
        x: node.evolution,
        y: 100 - node.value, // Invert Y-axis for top-down
      });
    });
    return positions;
  }, [nodes]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const mapDiv = mapContainerRef.current;
    if (!mapDiv) return;

    const nodeId = event.dataTransfer.getData('application/node-id');
    if (!nodeId) return;
    
    const rect = mapDiv.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let evolution = (x / rect.width) * 100;
    let value = 100 - ((y / rect.height) * 100);

    // Clamp values to be within the 0-100 bounds
    evolution = Math.max(0, Math.min(100, evolution));
    value = Math.max(0, Math.min(100, value));

    onNodeUpdate(nodeId, { evolution, value });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow dropping
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click is on the canvas itself and not a node/line, cancel drawing
    if (e.target === e.currentTarget && drawingState.isDrawing) {
      onCanvasClick();
    }
  };


  return (
    <div 
      className={`w-full aspect-[4/3] relative p-8 pl-16 pr-10 bg-slate-900 rounded-lg border border-slate-700 touch-none ${drawingState.isDrawing ? 'cursor-crosshair' : ''}`}
      onClick={handleCanvasClick}
      >
      {/* Y-Axis Label */}
      <div className="absolute top-1/2 -left-3 -translate-y-1/2 -rotate-90 text-slate-400 font-semibold tracking-widest flex items-center gap-2">
        <span>Invisible</span>
        <div className="w-16 h-px bg-slate-500"></div>
        <span>VALUE CHAIN</span>
        <div className="w-16 h-px bg-slate-500"></div>
        <span>Visible</span>
      </div>
      
      {/* X-Axis Label */}
      <div className="absolute bottom-1 -left-4 right-0 text-center text-slate-400 font-semibold tracking-widest flex justify-center items-center gap-2">
        <div className="w-32 h-px bg-slate-500"></div>
        <span>EVOLUTION</span>
        <div className="w-32 h-px bg-slate-500"></div>
      </div>
      
      {/* Stage Dividers and Labels */}
      <div className="absolute inset-0 top-0 left-12 right-8 bottom-12">
        {stages.map((stage, index) => (
          <React.Fragment key={stage}>
            {index > 0 && (
              <div
                className="absolute top-0 bottom-0 w-px border-l border-dashed border-slate-600"
                style={{ left: `${(index / stages.length) * 100}%` }}
              ></div>
            )}
            <div
              className="absolute -bottom-1 text-sm text-slate-500 text-center"
              style={{
                left: `${(index / stages.length) * 100}%`,
                width: `${(1 / stages.length) * 100}%`,
              }}
            >
              {stage}
            </div>
          </React.Fragment>
        ))}
      </div>
      
      {/* Map Content Area */}
      <div 
        ref={mapContainerRef}
        className="relative w-full h-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* SVG Layer for Dependency Lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 1 }}
        >
          {nodes.map(node => {
            const startPos = nodePositions.get(node.id);
            if (!startPos) return null;

            return node.dependencies.map(depId => {
              const endPos = nodePositions.get(depId);
              if (!endPos) return null;

              return (
                <line
                  key={`${node.id}-${depId}`}
                  x1={`${startPos.x}%`}
                  y1={`${startPos.y}%`}
                  x2={`${endPos.x}%`}
                  y2={`${endPos.y}%`}
                  className="stroke-slate-500/70 hover:stroke-red-500/90 transition-all duration-200 cursor-pointer"
                  strokeWidth="2"
                  onClick={(e) => { e.stopPropagation(); onDependencyRemove(node.id, depId); }}
                />
              );
            });
          })}
        </svg>

        {/* Nodes Layer */}
        {nodes.map(node => {
          const pos = nodePositions.get(node.id);
          if (!pos) return null;
          return (
            <MapNode 
              key={node.id} 
              node={node} 
              position={pos} 
              drawingState={drawingState}
              onNodeUpdate={onNodeUpdate} 
              onNodeRemove={onNodeRemove}
              onNodeClick={onNodeClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default WardleyMap;
