import React from 'react';
import { Search, X, Eye, EyeOff } from 'lucide-react';

const Toolbar = ({ 
  searchTerm, 
  setSearchTerm, 
  viewMode, 
  setViewMode, 
  highlightedNodes 
}) => {
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="bg-white shadow-sm border-b px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex justify-center">
          <div className="flex items-center max-w-md w-full">
            <Search size={20} className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search nodes, descriptions, methods..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 outline-none text-base bg-gray-50 px-3 py-2 rounded border"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch('')}
                className="ml-2 p-1 hover:bg-gray-100 rounded"
                title="Clear search"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'graph' ? 'simple' : 'graph')}
            className="flex items-center px-4 py-2 text-white rounded hover:opacity-90 transition-colors"
            style={{ backgroundColor: '#00837F' }}
            title={`Switch to ${viewMode === 'graph' ? 'Simple' : 'Graph'} View`}
          >
            {viewMode === 'graph' ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="ml-2 text-base">
              {viewMode === 'graph' ? 'Simple View' : 'Graph View'}
            </span>
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-base"
            title="Reset & Refresh"
          >
            Reset
          </button>
        </div>
      </div>

      {highlightedNodes.size > 0 && (
        <div className="mt-2 text-center text-base" style={{ color: '#00837F' }}>
          Found {highlightedNodes.size} matching node{highlightedNodes.size !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default Toolbar;