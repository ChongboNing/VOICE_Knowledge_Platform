import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Toolbar from './components/Toolbar';
import GraphView from './components/GraphView';
import SimpleView from './components/SimpleView';
import NodeDetails from './components/NodeDetails';
import Modal from './components/Modal';
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
  const [visibleTypes, setVisibleTypes] = useState({
    People: true,
    Institutions: true,
    Projects: true,
    Methods: true
  });

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

  // 处理搜索
  useEffect(() => {
    if (data) {
      const matches = searchNodes(data, searchTerm);
      setHighlightedNodes(matches);
    }
  }, [searchTerm, data]);

  // 切换节点类型显示
  const toggleNodeType = (type) => {
    setVisibleTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
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
      {/* 左侧导航栏 */}
      <Navigation 
        isNavExpanded={isNavExpanded} 
        setIsNavExpanded={setIsNavExpanded} 
        setShowModal={setShowModal}
        data={data}
      />

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部工具栏 */}
        <Toolbar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
          highlightedNodes={highlightedNodes}
        />

        {/* 主视图区域 */}
        <div className="flex-1 relative bg-white">
          {viewMode === 'graph' ? (
            <GraphView 
              data={data}
              visibleTypes={visibleTypes}
              toggleNodeType={toggleNodeType}
              highlightedNodes={highlightedNodes}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              zoomLevel={zoomLevel}
              setZoomLevel={setZoomLevel}
            />
          ) : (
            <SimpleView 
              data={data}
              visibleTypes={visibleTypes}
              highlightedNodes={highlightedNodes}
              setSelectedNode={setSelectedNode}
            />
          )}
        </div>
      </div>

      {/* 节点详情面板 */}
      <NodeDetails 
        selectedNode={selectedNode} 
        setSelectedNode={setSelectedNode}
        data={data}
      />

      {/* 导航栏模态框 */}
      <Modal 
        showModal={showModal} 
        setShowModal={setShowModal} 
      />
    </div>
  );
};

export default RelationshipGraphApp;