import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ showModal, setShowModal }) => {
  const [width, setWidth] = useState(50); // 默认50%宽度
  const isDragging = useRef(false);

  if (!showModal) return null;

  const handleMouseDown = (e) => {
    isDragging.current = true;
    e.preventDefault();
    
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      
      const newWidth = (e.clientX / window.innerWidth) * 100;
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

  return (
    <div className="fixed left-0 top-0 h-full bg-white shadow-2xl border-r border-gray-200 z-50 flex flex-col" style={{ width: `${width}%` }}>
      {/* 模态框头部 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900">{showModal.label}</h2>
        <button
          onClick={() => setShowModal(null)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          title="Close"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>
      
      {/* 可滚动内容区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
            {showModal.content.split('\n').map((line, index) => {
              // 处理一级标题
              if (line.startsWith('# ')) {
                return <h2 key={index} className="text-xl font-bold text-gray-900 mt-3 mb-1">{line.substring(2)}</h2>;
              }
              
              // 处理带链接的列表项
              if (line.startsWith('- [') && line.includes('](') && line.includes(')')) {
                const linkRegex = /- \[([^\]]+)\]\(([^)]+)\)/;
                const match = line.match(linkRegex);
                if (match) {
                  return (
                    <p key={index} className="mb-2 ml-4">
                      • <a 
                          href={match[2]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                          style={{ color: '#00837F' }}
                        >
                          {match[1]}
                        </a>
                    </p>
                  );
                }
              }
              
              // 处理普通列表项（一级）
              if (line.startsWith('- ') && !line.startsWith('  -')) {
                return (
                  <p key={index} className="mb-2 ml-4">
                    • {line.substring(2).split('**').map((part, partIndex) => {
                      if (partIndex % 2 === 1) {
                        return <strong key={partIndex}>{part}</strong>;
                      }
                      return part;
                    })}
                  </p>
                );
              }
              
              // 处理嵌套列表项（二级）
              if (line.startsWith('  - ')) {
                return (
                  <p key={index} className="mb-2 ml-8">
                    • {line.substring(4).split('**').map((part, partIndex) => {
                      if (partIndex % 2 === 1) {
                        return <strong key={partIndex}>{part}</strong>;
                      }
                      return part;
                    })}
                  </p>
                );
              }
              
              // 处理粗体文本
              if (line.includes('**')) {
                const parts = line.split('**');
                return (
                  <p key={index} className="mb-2">
                    {parts.map((part, partIndex) => {
                      if (partIndex % 2 === 1) {
                        return <strong key={partIndex}>{part}</strong>;
                      }
                      return part;
                    })}
                  </p>
                );
              }
              
              // 处理空行
              if (line.trim() === '') {
                return <br key={index} />;
              }
              
              // 普通段落
              return <p key={index} className="mb-2">{line}</p>;
            })}
          </div>
        </div>
      </div>
      
      {/* 右侧拖拽手柄 */}
      <div 
        className="absolute right-0 top-0 w-1 h-full bg-gray-300 cursor-col-resize transition-colors"
        style={{ ':hover': { backgroundColor: '#00837F' } }}
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#00837F'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#d1d5db'}
        title="Drag to resize"
      />
    </div>
  );
};

export default Modal;