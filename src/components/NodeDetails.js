import React, { useState, useRef, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { getNodeColor } from '../utils/graphUtils';

const NodeDetails = ({ selectedNode, onNodeSelection, data }) => {
  const [width, setWidth] = useState(50); // 默认50%宽度
  const isDragging = useRef(false);
  const detailsRef = useRef(null);
  const previousFocusRef = useRef(null);

  // 焦点管理effect
  useEffect(() => {
    if (selectedNode) {
      // 保存当前焦点
      previousFocusRef.current = document.activeElement;
      
      // 设置焦点到详情面板
      setTimeout(() => {
        detailsRef.current?.focus();
      }, 100);
      
      // Escape键处理
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onNodeSelection(null);
        }
      };
      
      // 键盘调整大小功能 - WCAG 2.2 AA合规 (2.5.7)
      const handleKeyResize = (e) => {
        if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const newWidth = Math.min(80, width + 5);
            setWidth(newWidth);
            // 添加屏幕阅读器反馈
            const announcement = `Details panel width increased to ${Math.round(newWidth)}%`;
            console.log(announcement); // 临时日志，可以连接到aria-live区域
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            const newWidth = Math.max(20, width - 5);
            setWidth(newWidth);
            // 添加屏幕阅读器反馈
            const announcement = `Details panel width decreased to ${Math.round(newWidth)}%`;
            console.log(announcement); // 临时日志，可以连接到aria-live区域
          }
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleKeyResize);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleKeyResize);
        // 恢复焦点
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [selectedNode, onNodeSelection, width]);

  if (!selectedNode || !data || !data.links) return null;

  const handleMouseDown = (e) => {
    isDragging.current = true;
    e.preventDefault();
    
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      
      const newWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
      // 限制宽度在20%到80%之间
      const clampedWidth = Math.min(Math.max(newWidth, 20), 80);
      setWidth(clampedWidth);
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // 获取相关连接
  const relatedLinks = data.links.filter(
    link => link.source === selectedNode.id || link.target === selectedNode.id
  );

  return (
    <div 
      className={`
        fixed bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col
        
        // 桌面端：保持原有样式和功能
        md:right-0 md:top-0 md:h-full
        
        // 移动端：全屏显示
        inset-0 md:inset-auto
      `}
      style={{ width: window.innerWidth > 768 ? `${width}%` : '100%' }}
      role="complementary"
      aria-labelledby="details-title"
      ref={detailsRef}
      tabIndex={-1}
    >
      {/* 移动端顶部导航条 */}
      <div className="flex items-center p-4 border-b bg-gray-50 md:hidden">
        <button
          onClick={() => onNodeSelection(null)}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          aria-label="Close details and return to main view"
        >
          <span className="text-lg">←</span>
        </button>
        <h2 className="flex-1 text-center font-bold text-lg">{selectedNode.name}</h2>
        <div className="w-10"></div> {/* 占位符保持居中 */}
      </div>
      
      {/* 桌面端面板头部 */}
      <div className="hidden md:flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center">
          <div 
            className="w-6 h-6 rounded-full mr-3 flex-shrink-0"
            style={{ backgroundColor: getNodeColor(selectedNode.type) }}
          ></div>
          <div>
            <h2 id="details-title" className="text-2xl font-bold text-gray-900">{selectedNode.name}</h2>
            <div className="flex items-center gap-4">
              <p className="text-base text-gray-500 font-medium">{selectedNode.type}</p>
              <p className="text-sm text-gray-600">
                Use Ctrl/Cmd + ← → to resize panel
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => onNodeSelection(null)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Close details panel"
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
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Biography</h3>
                <p className="text-base text-gray-700 leading-relaxed">{selectedNode.bio || '/'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Institutional Connections</h3>
                <div className="text-base p-4 rounded-lg border" style={{ backgroundColor: '#F4F3F8', borderColor: '#5F5BA3', color: '#5F5BA3' }}>
                  {selectedNode.connections || '/'}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Website</h3>
                {selectedNode.website ? (
                  <a
                    href={selectedNode.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-base p-4 rounded-lg border font-medium transition-colors hover:opacity-90"
                    style={{ 
                      backgroundColor: '#F4F3F8', 
                      borderColor: '#5F5BA3',
                      color: '#5F5BA3'
                    }}
                    aria-label={`Visit ${selectedNode.name}'s website (opens in new tab)`}
                  >
                    Visit Website <ExternalLink size={16} className="ml-2" />
                  </a>
                ) : (
                  <div className="text-base text-gray-700">/</div>
                )}
              </div>
            </>
          )}
          
          {/* Institutions节点字段 */}
          {selectedNode.type === 'Institutions' && (
            <>
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Description</h3>
                <p className="text-base text-gray-700 leading-relaxed">{selectedNode.bio || '/'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Website</h3>
                {selectedNode.website ? (
                  <a
                    href={selectedNode.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-base p-4 rounded-lg border font-medium transition-colors hover:opacity-90"
                    style={{ 
                      backgroundColor: '#FFF6FB', 
                      borderColor: '#DC2680',
                      color: '#DC2680'
                    }}
                    aria-label={`Visit institution website (opens in new tab)`}
                  >
                    Visit Website <ExternalLink size={16} className="ml-2" />
                  </a>
                ) : (
                  <div className="text-base text-gray-700">/</div>
                )}
              </div>
            </>
          )}

          {selectedNode.type === 'Projects' && (
            <>
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Description</h3>
                <p className="text-base text-gray-700 leading-relaxed">{selectedNode.description || '/'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Budget</h3>
                {selectedNode.budget ? (
                  <span className="inline-block px-4 py-2 text-base rounded-full font-medium" style={{ backgroundColor: '#FFFAF3', color: '#EB631A' }}>
                    {selectedNode.budget}
                  </span>
                ) : (
                  <div className="text-base text-gray-700">/</div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Methods</h3>
                <p className="text-base text-gray-700 leading-relaxed">{selectedNode.methods || '/'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Involved Institutions</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {selectedNode.involved_institutions || '/'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Website</h3>
                {selectedNode.website ? (
                  <a
                    href={selectedNode.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-base p-4 rounded-lg border font-medium transition-colors hover:opacity-90"
                    style={{ 
                      backgroundColor: '#FFFAF3', 
                      borderColor: '#EB631A',
                      color: '#EB631A'
                    }}
                    aria-label={`Visit project website (opens in new tab)`}
                  >
                    Visit Website <ExternalLink size={16} className="ml-2" />
                  </a>
                ) : (
                  <div className="text-base text-gray-700">/</div>
                )}
              </div>
            </>
          )}

          {selectedNode.type === 'Methods' && (
            <>
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Description</h3>
                <p className="text-base text-gray-700 leading-relaxed">{selectedNode.description || '/'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Category</h3>
                {selectedNode.category && selectedNode.category !== '/' ? (
                  <span className="inline-block px-4 py-2 text-base rounded-full font-medium" style={{ backgroundColor: '#EEF9F6', color: '#148D66' }}>
                    {selectedNode.category}
                  </span>
                ) : (
                  <div className="text-base text-gray-700">/</div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Steps</h3>
                {selectedNode.steps ? (
                  <div className="text-base text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-lg border">{selectedNode.steps}</div>
                ) : (
                  <div className="text-base text-gray-700">/</div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">What challenges might you encounter?</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {selectedNode.challenges || '/'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">What conditions / materials are needed?</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {selectedNode.conditions || '/'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Links</h3>
                {selectedNode.links ? (
                  <a
                    href={selectedNode.links}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-base p-4 rounded-lg border font-medium transition-colors hover:opacity-90"
                    style={{ 
                      backgroundColor: '#EEF9F6', 
                      borderColor: '#148D66',
                      color: '#148D66'
                    }}
                    aria-label={`View method publication (opens in new tab)`}
                  >
                    View Publication <ExternalLink size={16} className="ml-2" />
                  </a>
                ) : (
                  <div className="text-base text-gray-700">/</div>
                )}
              </div>
            </>
          )}

          <div>
            <h3 className="font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2 text-lg">Connected Entities</h3>
            <div className="space-y-3">
              {relatedLinks.map((link, index) => {
                const connectedNodeId = link.source === selectedNode.id ? link.target : link.source;
                const connectedNode = data.nodes.find(n => n.id === connectedNodeId);
                if (!connectedNode) return null;
                return (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer"
                       onClick={() => onNodeSelection(connectedNode)}>
                    <div 
                      className="w-4 h-4 rounded-full mr-4 flex-shrink-0"
                      style={{ backgroundColor: getNodeColor(connectedNode.type) }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-base text-gray-900 truncate">
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
      
      {/* 左侧拖拽手柄 */}
      <div 
        className="absolute left-0 top-0 w-1 h-full bg-gray-300 cursor-col-resize transition-colors"
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#00837F'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#d1d5db'}
        title="Drag to resize"
      />
    </div>
  );
};

export default NodeDetails;