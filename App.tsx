import React, { useState, useEffect, useCallback } from 'react';
import WardleyMap from './components/WardleyMap';
import MapManager from './components/MapManager';
import HelpPanel from './components/HelpPanel';
import { EVOLUTION_STAGES, DEFAULT_MAP_NODES, LOCAL_STORAGE_KEY } from './constants';
import { UserIcon, PlusIcon, LinkIcon, MenuIcon, CopyIcon, EditIcon, QuestionMarkCircleIcon } from './components/icons';
import { MapNodeData, ComponentType, SavedMap } from './types';

type DrawingState = {
  isDrawing: boolean;
  fromId: string | null;
};

const App: React.FC = () => {
  const [maps, setMaps] = useState<SavedMap[]>([]);
  const [activeMapId, setActiveMapId] = useState<string | null>(null);
  const [drawingState, setDrawingState] = useState<DrawingState>({ isDrawing: false, fromId: null });
  const [isMapManagerOpen, setMapManagerOpen] = useState(false);
  const [isHelpPanelOpen, setHelpPanelOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [isEditingUserNeedTitle, setIsEditingUserNeedTitle] = useState(false);
  const [tempUserNeedTitle, setTempUserNeedTitle] = useState('');
  const [isEditingUserNeedDescription, setIsEditingUserNeedDescription] = useState(false);
  const [tempUserNeedDescription, setTempUserNeedDescription] = useState('');

  const activeMap = maps.find(m => m.id === activeMapId);

  // --- Map Data Persistence and Routing ---

  useEffect(() => {
    // Load maps from localStorage on initial render
    try {
      const savedMapsRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedMapsRaw) {
        const parsedMaps = JSON.parse(savedMapsRaw);
        if (Array.isArray(parsedMaps) && parsedMaps.length > 0) {
          // Backwards compatibility for maps saved before user need was editable
          const compatibleMaps = parsedMaps.map((map: any) => ({
            ...map,
            userNeedTitle: map.userNeedTitle || 'User Need',
            userNeedDescription: map.userNeedDescription || 'Leverage mapped features within an application.'
          }));
          setMaps(compatibleMaps);
        } else {
          handleNewMap('My First Map', DEFAULT_MAP_NODES, false);
        }
      } else {
        handleNewMap('AI Inference Map', DEFAULT_MAP_NODES, false);
      }
    } catch (error) {
      console.error("Failed to load maps from localStorage", error);
      handleNewMap('My First Map', [], false);
    }
  }, []);

  useEffect(() => {
    // Save maps to localStorage whenever they change
    if (maps.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(maps));
    }
  }, [maps]);

  useEffect(() => {
    // URL Hash Routing
    const handleHashChange = () => {
      const hash = window.location.hash;
      const mapId = hash.startsWith('#/map/') ? hash.substring(6) : null;
      if (mapId && maps.some(m => m.id === mapId)) {
        setActiveMapId(mapId);
      } else if (maps.length > 0) {
        const latestMap = maps.sort((a,b) => b.lastModified - a.lastModified)[0];
        setActiveMapId(latestMap.id);
      }
    };

    if (maps.length > 0 && !activeMapId) {
       handleHashChange(); // Initial load check
    }

    window.addEventListener('hashchange', handleHashChange, false);
    return () => window.removeEventListener('hashchange', handleHashChange);

  }, [maps, activeMapId]);

  useEffect(() => {
    // Sync active map ID to URL hash
    if (activeMapId) {
      window.location.hash = `#/map/${activeMapId}`;
    }
  }, [activeMapId]);


  useEffect(() => {
    // Global key listener for escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawingState({ isDrawing: false, fromId: null });
        setMapManagerOpen(false);
        setHelpPanelOpen(false);
        setIsEditingTitle(false);
        setIsEditingUserNeedTitle(false);
        setIsEditingUserNeedDescription(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Map CRUD Operations ---

  const updateActiveMap = useCallback((updater: (map: SavedMap) => SavedMap) => {
    setMaps(currentMaps =>
      currentMaps.map(m =>
        m.id === activeMapId ? { ...updater(m), lastModified: Date.now() } : m
      )
    );
  }, [activeMapId]);

  const handleNewMap = (name: string, nodes: MapNodeData[] = [], setActive = true) => {
    const newMap: SavedMap = {
      id: `map_${Date.now()}`,
      name,
      userNeedTitle: 'User Need',
      userNeedDescription: 'Leverage mapped features within an application.',
      nodes,
      lastModified: Date.now(),
    };
    setMaps(currentMaps => [...currentMaps, newMap]);
    if (setActive) {
      setActiveMapId(newMap.id);
    }
  };

  const handleCopyMap = () => {
    if (!activeMap) return;
    const newMap: SavedMap = {
      ...JSON.parse(JSON.stringify(activeMap)), // Deep copy
      id: `map_${Date.now()}`,
      name: `${activeMap.name} (Copy)`,
      lastModified: Date.now(),
      copiedFromId: activeMap.id,
    };
    setMaps(currentMaps => [...currentMaps, newMap]);
    setActiveMapId(newMap.id);
  };

  const handleDeleteMap = (mapId: string) => {
    setMaps(currentMaps => currentMaps.filter(m => m.id !== mapId));
    if (activeMapId === mapId) {
      const remainingMaps = maps.filter(m => m.id !== mapId);
      if (remainingMaps.length > 0) {
        setActiveMapId(remainingMaps.sort((a, b) => b.lastModified - a.lastModified)[0].id);
      } else {
        setActiveMapId(null);
      }
    }
  };

  const handleRenameMap = () => {
    if (tempTitle.trim()) {
      updateActiveMap(map => ({ ...map, name: tempTitle.trim() }));
    }
    setIsEditingTitle(false);
  };

  const handleUserNeedTitleChange = () => {
    if (tempUserNeedTitle.trim()) {
        updateActiveMap(map => ({ ...map, userNeedTitle: tempUserNeedTitle.trim() }));
    }
    setIsEditingUserNeedTitle(false);
  };

  const handleUserNeedDescriptionChange = () => {
      updateActiveMap(map => ({ ...map, userNeedDescription: tempUserNeedDescription.trim() }));
      setIsEditingUserNeedDescription(false);
  };
  
  // --- Node and Dependency Operations ---

  const handleNodeUpdate = (id: string, updates: Partial<MapNodeData>) => {
    updateActiveMap(map => ({
      ...map,
      nodes: map.nodes.map(node =>
        node.id === id ? { ...node, ...updates } : node
      )
    }));
  };

  const handleAddNode = () => {
    updateActiveMap(map => {
        const newNode: MapNodeData = {
          id: `node_${Date.now()}`,
          name: 'New Component',
          value: 60,
          evolution: 30,
          type: ComponentType.Software,
          dependencies: [],
        };
        return { ...map, nodes: [...(map.nodes || []), newNode] };
    });
  };

  const handleRemoveNode = (idToRemove: string) => {
    updateActiveMap(map => {
      const filteredNodes = map.nodes.filter(node => node.id !== idToRemove);
      const updatedNodes = filteredNodes.map(node => ({
        ...node,
        dependencies: node.dependencies.filter(depId => depId !== idToRemove),
      }));
      return { ...map, nodes: updatedNodes };
    });
  };

  const handleRemoveDependency = (fromId: string, toId: string) => {
    updateActiveMap(map => ({
      ...map,
      nodes: map.nodes.map(node => {
        if (node.id === fromId) {
          return {
            ...node,
            dependencies: node.dependencies.filter(depId => depId !== toId),
          };
        }
        return node;
      })
    }));
  };
  
  const toggleDrawingMode = () => {
    setDrawingState(prev => ({ isDrawing: !prev.isDrawing, fromId: null }));
  };

  const handleNodeClickForDependency = (nodeId: string) => {
    if (!drawingState.isDrawing) return;

    if (!drawingState.fromId) {
      setDrawingState({ ...drawingState, fromId: nodeId });
    } else {
      if (drawingState.fromId === nodeId) return;
      
      updateActiveMap(map => ({
        ...map,
        nodes: map.nodes.map(node => {
          if (node.id === drawingState.fromId && !node.dependencies.includes(nodeId)) {
            return { ...node, dependencies: [...node.dependencies, nodeId] };
          }
          return node;
        })
      }));
      setDrawingState({ isDrawing: false, fromId: null });
    }
  };

  if (!activeMap) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold">Loading Maps...</h1>
        <p className="mt-4 text-slate-400">If this persists, there might be an issue with your stored maps.</p>
        <button onClick={() => { localStorage.removeItem(LOCAL_STORAGE_KEY); window.location.reload(); }} className="mt-4 px-4 py-2 bg-red-600 rounded-lg">Reset Storage</button>
      </div>
    );
  }

  return (
    <>
      <MapManager 
        isOpen={isMapManagerOpen} 
        maps={maps} 
        activeMapId={activeMapId}
        onLoadMap={(id) => { setActiveMapId(id); setMapManagerOpen(false); }} 
        onDeleteMap={handleDeleteMap} 
        onClose={() => setMapManagerOpen(false)}
      />

      <HelpPanel isOpen={isHelpPanelOpen} onClose={() => setHelpPanelOpen(false)} />

      <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 md:p-8">
        <header className="w-full max-w-7xl mb-8">
          <h1 className="text-center text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-sky-400">
            Wardley Map Generator
          </h1>

          <div className="text-center mt-4 mb-2">
            {isEditingTitle ? (
              <input 
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={handleRenameMap}
                onKeyDown={(e) => e.key === 'Enter' && handleRenameMap()}
                autoFocus
                className="text-3xl font-bold bg-slate-700 text-slate-100 rounded-lg text-center"
              />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-3xl font-bold text-slate-100">{activeMap.name}</h2>
                <button onClick={() => { setIsEditingTitle(true); setTempTitle(activeMap.name); }} className="text-slate-400 hover:text-white">
                  <EditIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          
          <p className="mt-2 text-center text-md text-slate-500">
            Drag to move, double-click to edit, hover to remove a node. Click a line to remove it.
          </p>
          
          <div className="mt-6 flex justify-center items-center flex-wrap gap-x-3 gap-y-4">
            {/* Map Management Group */}
            <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => setMapManagerOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-colors duration-200">
                  <MenuIcon className="w-5 h-5" />
                  <span>My Maps</span>
                </button>
                <button onClick={() => handleNewMap('Untitled Map')} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-colors duration-200">
                  <PlusIcon className="w-5 h-5" />
                  <span>New Map</span>
                </button>
                <button onClick={handleCopyMap} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition-colors duration-200">
                  <CopyIcon className="w-5 h-5" />
                  <span>Copy Map</span>
                </button>
            </div>
            
            {/* Separator */}
            <div className="h-8 w-px bg-slate-600 hidden sm:block"></div>

            {/* Core Actions Group */}
            <div className="flex flex-wrap justify-center gap-3">
                <button onClick={handleAddNode} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Component</span>
                </button>
                <button onClick={toggleDrawingMode} className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg shadow-md transition-colors duration-200 ${drawingState.isDrawing ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}>
                  <LinkIcon className="w-5 h-5" />
                  <span>{drawingState.isDrawing ? 'Cancel' : 'Add Dependency'}</span>
                </button>
            </div>
            
            {/* Separator */}
            <div className="h-8 w-px bg-slate-600 hidden sm:block"></div>

            {/* Support Group */}
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => setHelpPanelOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-colors duration-200">
                <QuestionMarkCircleIcon className="w-5 h-5" />
                <span>Help</span>
              </button>
            </div>
          </div>
        </header>
        
        <main className="w-full flex-grow flex flex-col items-center">
          <div className="w-full max-w-7xl p-4 sm:p-6 bg-slate-800/50 rounded-2xl shadow-2xl border border-slate-700">
            <div className="flex items-start gap-4 px-2 sm:px-4 mb-4">
              <UserIcon className="w-12 h-12 text-teal-300 flex-shrink-0 mt-1" />
              <div className="w-full">
                  {isEditingUserNeedTitle ? (
                    <input 
                      type="text"
                      value={tempUserNeedTitle}
                      onChange={(e) => setTempUserNeedTitle(e.target.value)}
                      onBlur={handleUserNeedTitleChange}
                      onKeyDown={(e) => e.key === 'Enter' && handleUserNeedTitleChange()}
                      autoFocus
                      className="text-xl font-semibold bg-slate-700 text-slate-100 rounded-lg px-2 -mx-2"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-slate-100">{activeMap.userNeedTitle}</h2>
                        <button onClick={() => { setIsEditingUserNeedTitle(true); setTempUserNeedTitle(activeMap.userNeedTitle || ''); }} className="text-slate-400 hover:text-white">
                            <EditIcon className="w-4 h-4" />
                        </button>
                    </div>
                  )}

                  {isEditingUserNeedDescription ? (
                    <textarea 
                      value={tempUserNeedDescription}
                      onChange={(e) => setTempUserNeedDescription(e.target.value)}
                      onBlur={handleUserNeedDescriptionChange}
                      autoFocus
                      className="mt-1 text-slate-400 bg-slate-700 text-slate-100 rounded-lg w-full p-2 -m-2"
                      rows={2}
                    />
                  ) : (
                    <div className="flex items-start gap-2">
                        <p className="text-slate-400 flex-grow">{activeMap.userNeedDescription}</p>
                        <button onClick={() => { setIsEditingUserNeedDescription(true); setTempUserNeedDescription(activeMap.userNeedDescription || ''); }} className="text-slate-400 hover:text-white flex-shrink-0">
                            <EditIcon className="w-4 h-4" />
                        </button>
                    </div>
                  )}
              </div>
            </div>
            <WardleyMap 
              nodes={activeMap.nodes} 
              stages={EVOLUTION_STAGES} 
              drawingState={drawingState}
              onNodeUpdate={handleNodeUpdate} 
              onNodeRemove={handleRemoveNode}
              onDependencyRemove={handleRemoveDependency}
              onNodeClick={handleNodeClickForDependency}
              onCanvasClick={() => setDrawingState({ isDrawing: false, fromId: null })}
            />
          </div>
        </main>

        <footer className="w-full max-w-7xl text-center mt-8 text-slate-500 text-sm space-y-1">
          <p>
            Created by <a href="mailto:seanhorgan@google.com" className="text-slate-400 hover:text-teal-300 transition-colors">seanhorgan@google.com</a>.
            Learn about Wardley Mapping at <a href="https://docs.google.com/presentation/d/1ad9bO_XJvdGIFIH1jad_qXQ62ugopl4g6ynvj911wgk/edit" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-teal-300 transition-colors">go/wardley-in-30mins</a>.
          </p>
          <p>Your maps are saved in your browser's local storage.</p>
        </footer>
      </div>
    </>
  );
};

export default App;