import React from 'react';
import { ExternalLink } from 'lucide-react';

const SimpleView = ({ data, visibleTypes, highlightedNodes, setSelectedNode }) => {
  if (!data || !data.nodes) return null;

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="bg-white rounded-lg shadow border">
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 font-semibold text-base text-gray-700 rounded-t-lg border-b">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{backgroundColor: '#5F5BA3'}}></div>
            People ({data.nodes.filter(n => n.type === 'People' && visibleTypes.People).length})
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{backgroundColor: '#DC2680'}}></div>
            Institutions ({data.nodes.filter(n => n.type === 'Institutions' && visibleTypes.Institutions).length})
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{backgroundColor: '#EB631A'}}></div>
            Projects ({data.nodes.filter(n => n.type === 'Projects' && visibleTypes.Projects).length})
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{backgroundColor: '#F8AE15'}}></div>
            Methods ({data.nodes.filter(n => n.type === 'Methods' && visibleTypes.Methods).length})
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 p-4">
          <div className="space-y-3">
            {data.nodes.filter(n => n.type === 'People' && visibleTypes.People).map(node => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`w-full text-left p-3 rounded border transition-all hover:shadow-md ${
                  highlightedNodes.has(node.id) ? 'shadow-md' : 'hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: highlightedNodes.has(node.id) ? '#F6FFFF' : '#F4F3F8',
                  borderColor: highlightedNodes.has(node.id) ? '#00837F' : 'rgba(95, 91, 163, 0.5)'
                }}
              >
                <div className="font-medium text-base text-gray-900">{node.name}</div>
                <div className="text-sm text-gray-500 mt-1 line-clamp-2">{node.connections}</div>
                <div className="text-sm text-gray-400 mt-1 truncate">{node.bio?.substring(0, 80)}...</div>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {data.nodes.filter(n => n.type === 'Institutions' && visibleTypes.Institutions).map(node => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`w-full text-left p-3 rounded border transition-all hover:shadow-md ${
                  highlightedNodes.has(node.id) ? 'shadow-md' : 'hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: highlightedNodes.has(node.id) ? '#F6FFFF' : '#FFF6FB',
                  borderColor: highlightedNodes.has(node.id) ? '#00837F' : 'rgba(220, 38, 128, 0.5)'
                }}
              >
                <div className="font-medium text-base text-gray-900">{node.name}</div>
                <div className="text-sm text-gray-400 mt-1 truncate">{node.bio?.substring(0, 100)}...</div>
                {node.website && (
                  <div className="text-sm mt-1 flex items-center" style={{ color: '#DC2680' }}>
                    <ExternalLink size={10} className="mr-1" />
                    Website
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {data.nodes.filter(n => n.type === 'Projects' && visibleTypes.Projects).map(node => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`w-full text-left p-3 rounded border transition-all hover:shadow-md ${
                  highlightedNodes.has(node.id) ? 'shadow-md' : 'hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: highlightedNodes.has(node.id) ? '#F6FFFF' : '#FFFAF3',
                  borderColor: highlightedNodes.has(node.id) ? '#00837F' : 'rgba(235, 98, 26, 0.5)'
                }}
              >
                <div className="font-medium text-base text-gray-900">{node.name}</div>
                <div className="text-sm text-gray-400 mt-1 truncate">{node.description?.substring(0, 100)}...</div>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {data.nodes.filter(n => n.type === 'Methods' && visibleTypes.Methods).map(node => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`w-full text-left p-3 rounded border transition-all hover:shadow-md ${
                  highlightedNodes.has(node.id) ? 'shadow-md' : 'hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: highlightedNodes.has(node.id) ? '#F6FFFF' : '#FFFBF2',
                  borderColor: highlightedNodes.has(node.id) ? '#00837F' : 'rgba(248, 174, 21, 0.5)'
                }}
              >
                <div className="font-medium text-base text-gray-900">{node.name}</div>
                {node.category && (
                  <div className="text-sm text-white mt-1 inline-block px-2 py-1 rounded" style={{ backgroundColor: '#F8AE15' }}>
                    {node.category}
                  </div>
                )}
                <div className="text-sm text-gray-400 mt-2 line-clamp-3">{node.description?.substring(0, 100)}...</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleView;