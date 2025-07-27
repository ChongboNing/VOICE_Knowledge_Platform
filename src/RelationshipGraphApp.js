import React, { useState, useEffect, useCallback } from 'react';
import Navigation from './components/Navigation';
import Toolbar from './components/Toolbar';
import GraphView from './components/GraphView';
import SimpleView from './components/SimpleView';
import NodeDetails from './components/NodeDetails';
import Modal from './components/Modal';
import KeyboardHelp from './components/KeyboardHelp';
import { searchNodes } from './utils/graphUtils';

const RelationshipGraphApp = () => {
  // 状态管理
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('graph'); // 'graph' or 'simple'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showModal, setShowModal] = useState(null);
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const [announcements, setAnnouncements] = useState('');
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [visibleTypes, setVisibleTypes] = useState({
    People: true,
    Institutions: true,
    Projects: true,
    Methods: true
  });

  // 处理节点选择
  const handleNodeSelection = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  // 处理视图模式切换
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/graphData.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 设置页面标题
  useEffect(() => {
    document.title = 'VOICE Prototype V1';
  }, []);

  // 全局键盘快捷键
  useEffect(() => {
    const handleGlobalKeydown = (e) => {
      // Cmd/Ctrl + E: 切换视图模式 (E = Exchange views, 避免Shift组合)
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && (e.code === 'KeyE' || e.key.toLowerCase() === 'e')) {
        e.preventDefault();
        handleViewModeChange(viewMode === 'graph' ? 'simple' : 'graph');
        setAnnouncements(`Switched to ${viewMode === 'graph' ? 'accessible table' : 'interactive graph'} view`);
      }
      
      // Cmd/Ctrl + K: 聚焦到搜索框 (通用快捷键)
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && (e.code === 'KeyK' || e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        const searchInput = document.querySelector('input[role="searchbox"]');
        if (searchInput) {
          searchInput.focus();
          setAnnouncements('Search box focused');
        }
      }
      
      // Cmd/Ctrl + B: 切换导航栏 (类似VS Code侧边栏)
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && (e.code === 'KeyB' || e.key.toLowerCase() === 'b')) {
        e.preventDefault();
        setIsNavExpanded(!isNavExpanded);
        setAnnouncements(`Navigation ${!isNavExpanded ? 'expanded' : 'collapsed'}`);
      }
      
      // ? 键: 显示快捷键帮助
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        setShowKeyboardHelp(true);
      }
    };

    document.addEventListener('keydown', handleGlobalKeydown);
    
    return () => {
      document.removeEventListener('keydown', handleGlobalKeydown);
    };
  }, [viewMode, handleViewModeChange, isNavExpanded, setAnnouncements]);

  // 处理搜索
  useEffect(() => {
    if (data) {
      const matches = searchNodes(data, searchTerm);
      setHighlightedNodes(matches);
    }
  }, [searchTerm, data]);

  // 切换节点类型显示
  const toggleNodeType = (type) => {
    setVisibleTypes(prev => {
      const newState = {
        ...prev,
        [type]: !prev[type]
      };
      // 添加状态通知
      setAnnouncements(`${type} nodes ${newState[type] ? 'shown' : 'hidden'}`);
      return newState;
    });
  };

  // 加载状态
  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-gray-50">Loading data...</div>;
  }

  // 错误状态
  if (error) {
    return <div className="h-screen flex items-center justify-center bg-gray-50 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* 跳过导航链接 - 仅在获得焦点时可见 */}
      <a 
        href="#main-content" 
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView();
          }
        }}
      >
        Skip to main content
      </a>

      {/* 左侧导航栏 */}
      <aside role="navigation" aria-label="Main navigation">
        <Navigation 
          isNavExpanded={isNavExpanded} 
          setIsNavExpanded={setIsNavExpanded} 
          setShowModal={setShowModal}
          data={data}
        />
      </aside>

      {/* 主内容区域 */}
      <main className="flex-1 flex flex-col" role="main">
        {/* 顶部工具栏 */}
        <header role="banner">
          <Toolbar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            highlightedNodes={highlightedNodes}
            onShowKeyboardHelp={() => setShowKeyboardHelp(true)}
          />
        </header>

        {/* 主视图区域 */}
        <section id="main-content" className="flex-1 relative bg-white" tabIndex={-1} aria-label="Data visualization content">
          {viewMode === 'graph' ? (
            <GraphView 
              data={data}
              visibleTypes={visibleTypes}
              toggleNodeType={toggleNodeType}
              highlightedNodes={highlightedNodes}
              selectedNode={selectedNode}
              onNodeSelection={handleNodeSelection}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
            />
          ) : (
            <SimpleView 
              data={data}
              visibleTypes={visibleTypes}
              highlightedNodes={highlightedNodes}
              onNodeSelection={handleNodeSelection}
            />
          )}
        </section>
      </main>

      {/* 节点详情面板 */}
      <NodeDetails 
        selectedNode={selectedNode} 
        onNodeSelection={handleNodeSelection}
        data={data}
      />

      {/* 导航栏模态框 */}
      <Modal 
        showModal={showModal} 
        setShowModal={setShowModal} 
      />

      {/* 键盘快捷键帮助 */}
      <KeyboardHelp 
        show={showKeyboardHelp} 
        onClose={() => setShowKeyboardHelp(false)} 
      />

      {/* 屏幕阅读器通知区域 */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements}
      </div>
    </div>
  );
};

export default RelationshipGraphApp;