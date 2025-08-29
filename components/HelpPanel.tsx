import React from 'react';
import { XIcon } from './icons';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpPanel: React.FC<HelpPanelProps> = ({ isOpen, onClose }) => {
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
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-slate-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">How to Use</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700">
            <XIcon className="w-6 h-6 text-slate-400" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(100vh-65px)] text-slate-300 space-y-6">
          
          <section>
            <h3 className="text-lg font-semibold text-teal-300 mb-2">Working with Components</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong className="text-white">Add Component:</strong> Click the "Add Component" button to place a new item on your map.</li>
              <li><strong className="text-white">Move Component:</strong> Click and drag any component to change its position on the Value Chain and Evolution axes.</li>
              <li><strong className="text-white">Rename Component:</strong> Double-click on a component's name to edit it. Press Enter or click away to save.</li>
              <li><strong className="text-white">Remove Component:</strong> Hover over a component and click the 'x' button that appears in the top-right corner.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-teal-300 mb-2">Managing Dependencies</h3>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong className="text-white">Add Dependency:</strong> Click the "Add Dependency" button to enter drawing mode. First, click the component that provides value, then click the component that depends on it.</li>
               <li><strong className="text-white">Cancel Drawing:</strong> While in drawing mode, press the 'Escape' key, click the "Cancel" button, or click on the map background to exit.</li>
              <li><strong className="text-white">Remove Dependency:</strong> Hover over a dependency line (it will turn red), and simply click it to delete.</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold text-teal-300 mb-2">Map Management</h3>
             <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong className="text-white">Manage Your Maps:</strong> Click the "My Maps" button to open a panel showing all your saved maps.</li>
                <li><strong className="text-white">Create New Map:</strong> Use the "New Map" button to start a fresh, empty canvas.</li>
                <li><strong className="text-white">Copy Map:</strong> Use the "Copy Map" button to duplicate your current map and start a new version.</li>
                <li><strong className="text-white">Rename Map:</strong> Click the edit icon next to the map's title to give it a new name.</li>
                <li><strong className="text-white">Edit User Need:</strong> Click the edit icon next to the "User Need" text to customize it for your map.</li>
                <li><strong className="text-white">Load & Delete:</strong> In the "My Maps" panel, click any map to load it, or click the trash icon to delete it.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-teal-300 mb-2">Saving & Sharing</h3>
             <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong className="text-white">Automatic Saving:</strong> All your changes are automatically saved in your browser's local storage. There is no save button!</li>
                <li><strong className="text-white">Share a Map:</strong> Each map has a unique URL in your browser's address bar (e.g., `.../#/map/map_123`). Copy this URL and send it to others to share your map.</li>
            </ul>
          </section>

        </div>
      </aside>
    </>
  );
};

export default HelpPanel;
