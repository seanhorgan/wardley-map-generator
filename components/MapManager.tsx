
import React from 'react';
import { SavedMap } from '../types';
import { XIcon, TrashIcon } from './icons';

interface MapManagerProps {
  isOpen: boolean;
  maps: SavedMap[];
  activeMapId: string | null;
  onLoadMap: (id: string) => void;
  onDeleteMap: (id: string) => void;
  onClose: () => void;
}

const MapManager: React.FC<MapManagerProps> = ({
  isOpen,
  maps,
  activeMapId,
  onLoadMap,
  onDeleteMap,
  onClose,
}) => {
  const sortedMaps = [...maps].sort((a, b) => b.lastModified - a.lastModified);

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">My Maps</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700">
            <XIcon className="w-6 h-6 text-slate-400" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-65px)]">
          {sortedMaps.length === 0 ? (
            <p className="text-slate-400 text-center mt-8">You don't have any maps yet. Create one to get started!</p>
          ) : (
            <ul className="space-y-3">
              {sortedMaps.map(map => (
                <li
                  key={map.id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer group ${
                    map.id === activeMapId
                      ? 'bg-teal-500/20 border-teal-500 border'
                      : 'bg-slate-700/50 hover:bg-slate-600/70'
                  }`}
                  onClick={() => onLoadMap(map.id)}
                >
                  <div className="flex-grow">
                    <p className="font-semibold text-white">{map.name}</p>
                    <p className="text-xs text-slate-400">
                      {map.id === activeMapId ? 'Currently active' : `Updated ${timeAgo(map.lastModified)}`}
                    </p>
                  </div>
                   {maps.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete "${map.name}"? This cannot be undone.`)) {
                          onDeleteMap(map.id);
                        }
                      }}
                      className="p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                      aria-label={`Delete map ${map.name}`}
                    >
                      <TrashIcon className="w-5 h-5 text-red-400" />
                    </button>
                   )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
};

export default MapManager;