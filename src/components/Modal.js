import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ showModal, setShowModal }) => {
  const [width, setWidth] = useState(50); // 默认50%宽度
  const isDragging = useRef(false);
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // 焦点管理effect
  useEffect(() => {
    if (showModal) {
      // 保存当前焦点
      previousFocusRef.current = document.activeElement;
      
      // 设置焦点到模态框
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
      
      // Escape键处理
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setShowModal(null);
        }
      };
      
      // 键盘调整大小功能 - WCAG 2.2 AA合规 (2.5.7)
      const handleKeyResize = (e) => {
        if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const newWidth = Math.max(20, width - 5);
            setWidth(newWidth);
            // 添加屏幕阅读器反馈
            const announcement = `Panel width decreased to ${Math.round(newWidth)}%`;
            console.log(announcement); // 临时日志，可以连接到aria-live区域
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            const newWidth = Math.min(80, width + 5);
            setWidth(newWidth);
            // 添加屏幕阅读器反馈
            const announcement = `Panel width increased to ${Math.round(newWidth)}%`;
            console.log(announcement); // 临时日志，可以连接到aria-live区域
          }
        }
      };
      
      // 焦点陷阱
      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
              // Shift + Tab
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              // Tab
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleKeyResize);
      document.addEventListener('keydown', handleTabKey);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleKeyResize);
        document.removeEventListener('keydown', handleTabKey);
        // 恢复焦点
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [showModal, setShowModal, width]);

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
    <div 
      className={`
        fixed bg-white shadow-2xl border-gray-200 z-50 flex flex-col
        
        // 桌面端：保持原有侧边面板样式
        md:left-0 md:top-0 md:h-full md:border-r
        
        // 移动端：全屏模态框
        inset-0 md:inset-auto
      `}
      style={{ width: window.innerWidth > 768 ? `${width}%` : '100%' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
      tabIndex={-1}
    >
      {/* 移动端顶部导航条 */}
      <div className="flex items-center p-4 border-b bg-gray-50 md:hidden">
        <button
          onClick={() => setShowModal(null)}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          aria-label="Close dialog and return to main view"
        >
          <span className="text-lg">←</span>
        </button>
        <h2 className="flex-1 text-center font-bold text-lg">{showModal.label}</h2>
        <div className="w-10"></div> {/* 占位符保持居中 */}
      </div>
      
      {/* 桌面端模态框头部 */}
      <div className="hidden md:flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <div>
          <h2 id="modal-title" className="text-2xl font-bold text-gray-900">{showModal.label}</h2>
          <p className="text-sm text-gray-600 mt-1">
            Use Ctrl/Cmd + ← → to resize panel, or drag the right edge
          </p>
        </div>
        <button
          onClick={() => setShowModal(null)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Close dialog"
          title="Close"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>
      
      {/* 可滚动内容区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6">
          <div className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
            {showModal.content.split('\n').map((line, index) => {
              // 处理一级标题
              if (line.startsWith('# ')) {
                return <h2 key={index} className="text-lg md:text-xl font-bold text-gray-900 mt-3 mb-1">{line.substring(2)}</h2>;
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
              
              // 处理粗体文本和链接
              if (line.includes('**') || (line.includes('[') && line.includes('](') && line.includes(')'))) {
                let processedLine = line;
                
                // 处理链接
                const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                const parts = [];
                let lastIndex = 0;
                let match;
                
                while ((match = linkRegex.exec(line)) !== null) {
                  // 添加链接前的文本
                  if (match.index > lastIndex) {
                    parts.push(line.substring(lastIndex, match.index));
                  }
                  
                  // 添加链接
                  parts.push(
                    <a 
                      key={match.index}
                      href={match[2]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: '#00837F' }}
                    >
                      {match[1]}
                    </a>
                  );
                  
                  lastIndex = match.index + match[0].length;
                }
                
                // 添加最后部分的文本
                if (lastIndex < line.length) {
                  parts.push(line.substring(lastIndex));
                }
                
                // 如果没有找到链接，处理粗体
                if (parts.length === 0 && line.includes('**')) {
                  const boldParts = line.split('**');
                  return (
                    <p key={index} className="mb-2">
                      {boldParts.map((part, partIndex) => {
                        if (partIndex % 2 === 1) {
                          return <strong key={partIndex}>{part}</strong>;
                        }
                        return part;
                      })}
                    </p>
                  );
                }
                
                // 处理包含链接的行，也要处理粗体
                return (
                  <p key={index} className="mb-2">
                    {parts.map((part, partIndex) => {
                      if (typeof part === 'string' && part.includes('**')) {
                        const boldParts = part.split('**');
                        return boldParts.map((boldPart, boldIndex) => {
                          if (boldIndex % 2 === 1) {
                            return <strong key={`${partIndex}-${boldIndex}`}>{boldPart}</strong>;
                          }
                          return boldPart;
                        });
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
      
      {/* 桌面端右侧拖拽手柄 */}
      <div 
        className="hidden md:block absolute right-0 top-0 w-1 h-full bg-gray-300 cursor-col-resize transition-colors"
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