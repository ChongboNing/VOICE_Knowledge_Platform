import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { getNodeColor } from '../utils/graphUtils';

const NodeDetails = ({ selectedNode, setSelectedNode, data }) => {
  if (!selectedNode || !data || !data.links) return null;

  // 获取相关连接
  const relatedLinks = data.links.filter(
    link => link.source === selectedNode.id || link.target === selectedNode.id
  );

  return (
    <div className="fixed right-0 top-0 w-1/2 h-full bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      {/* 面板头部 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <div 
            className="w-6 h-6 rounded-full mr-3 flex-shrink-0"
            style={{ backgroundColor: getNodeColor(selectedNode.type) }}
          ></div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selectedNode.name}</h2>
            <p className="text-sm text-gray-500 font-medium">{selectedNode.type}</p>
          </div>
        </div>
        <button
          onClick={() => setSelectedNode(null)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          title="Close"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>
      
      {/* 可滚动内容区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* People节点字段 */}
          {selectedNode.type === 'People' && (
            <>
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Biography</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedNode.bio || '/'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Institutional Connections</h3>
                <div className="text-sm text-gray-700 p-4 rounded-lg border" style={{ backgroundColor: '#E6F7F6', borderColor: '#00837F' }}>
                  {selectedNode.connections || '/'}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Website</h3>
                {selectedNode.website ? (
                  <a
                    href={selectedNode.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm p-4 rounded-lg border font-medium transition-colors hover:opacity-90"
                    style={{ 
                      backgroundColor: '#E6F7F6', 
                      borderColor: '#00837F',
                      color: '#00837F'
                    }}
                  >
                    Visit Website <ExternalLink size={16} className="ml-2" />
                  </a>
                ) : (
                  <div className="text-sm text-gray-700">/</div>
                )}
              </div>
            </>
          )}
          
          {/* Institutions节点字段 */}
          {selectedNode.type === 'Institutions' && (
            <>
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedNode.bio || '/'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Website</h3>
                {selectedNode.website ? (
                  <a
                    href={selectedNode.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm p-4 rounded-lg border font-medium transition-colors hover:opacity-90"
                    style={{ 
                      backgroundColor: '#E6F7F6', 
                      borderColor: '#00837F',
                      color: '#00837F'
                    }}
                  >
                    Visit Website <ExternalLink size={16} className="ml-2" />
                  </a>
                ) : (
                  <div className="text-sm text-gray-700">/</div>
                )}
              </div>
            </>
          )}

          {selectedNode.type === 'Projects' && (
            <>
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedNode.description || '/'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Budget</h3>
                {selectedNode.budget ? (
                  <span className="inline-block px-4 py-2 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                    {selectedNode.budget}
                  </span>
                ) : (
                  <div className="text-sm text-gray-700">/</div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Methods</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedNode.methods || '/'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Involved Institutions</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedNode.involved_institutions || '/'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Website</h3>
                {selectedNode.website ? (
                  <a
                    href={selectedNode.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm p-4 rounded-lg border font-medium transition-colors hover:opacity-90"
                    style={{ 
                      backgroundColor: '#E6F7F6', 
                      borderColor: '#00837F',
                      color: '#00837F'
                    }}
                  >
                    Visit Website <ExternalLink size={16} className="ml-2" />
                  </a>
                ) : (
                  <div className="text-sm text-gray-700">/</div>
                )}
              </div>
            </>
          )}

          {selectedNode.type === 'Methods' && (
            <>
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedNode.description || '/'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Category</h3>
                {selectedNode.category && selectedNode.category !== '/' ? (
                  <span className="inline-block px-4 py-2 text-sm rounded-full font-medium" style={{ backgroundColor: '#E6F7F6', color: '#00837F' }}>
                    {selectedNode.category}
                  </span>
                ) : (
                  <div className="text-sm text-gray-700">/</div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Steps</h3>
                {selectedNode.steps ? (
                  <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg border">{selectedNode.steps}</div>
                ) : (
                  <div className="text-sm text-gray-700">/</div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">What challenges might you encounter?</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedNode.challenges || '/'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">What conditions / materials are needed?</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedNode.conditions || '/'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Links</h3>
                {selectedNode.links ? (
                  <a
                    href={selectedNode.links}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm p-4 rounded-lg border font-medium transition-colors hover:opacity-90"
                    style={{ 
                      backgroundColor: '#E6F7F6', 
                      borderColor: '#00837F',
                      color: '#00837F'
                    }}
                  >
                    View Publication <ExternalLink size={16} className="ml-2" />
                  </a>
                ) : (
                  <div className="text-sm text-gray-700">/</div>
                )}
              </div>
            </>
          )}

          <div>
            <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">Connected Entities</h3>
            <div className="space-y-3">
              {relatedLinks.map((link, index) => {
                const connectedNodeId = link.source === selectedNode.id ? link.target : link.source;
                const connectedNode = data.nodes.find(n => n.id === connectedNodeId);
                if (!connectedNode) return null;
                return (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer"
                       onClick={() => setSelectedNode(connectedNode)}>
                    <div 
                      className="w-4 h-4 rounded-full mr-4 flex-shrink-0"
                      style={{ backgroundColor: getNodeColor(connectedNode.type) }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {connectedNode.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {connectedNode.type}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      →
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeDetails;