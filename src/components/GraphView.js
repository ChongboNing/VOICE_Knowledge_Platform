import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, Filter } from 'lucide-react';
import { getNodeColor, getFilteredData } from '../utils/graphUtils';

const GraphView = ({ 
  data, 
  visibleTypes, 
  toggleNodeType, 
  highlightedNodes, 
  selectedNode, 
  setSelectedNode,
  zoomLevel,
  setZoomLevel
}) => {
  const svgRef = useRef();
  const simulationRef = useRef();
  const zoomRef = useRef();

  // 处理缩放
  const handleZoom = (direction) => {
    const svg = d3.select(svgRef.current);
    
    if (direction === 'in') {
      svg.transition().call(zoomRef.current.scaleBy, 1.5);
    } else {
      svg.transition().call(zoomRef.current.scaleBy, 0.67);
    }
  };

  // 初始化D3力导向图
  useEffect(() => {
    if (!data || !data.nodes || !data.links) return;

    const currentData = getFilteredData(data, visibleTypes);
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 1000;
    const height = svgRef.current.clientHeight || 700;
    
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g');

    // 缩放功能
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    // 确保连线数据中的source和target是对象引用
    const nodesMap = new Map(currentData.nodes.map(d => [d.id, d]));
    const processedLinks = currentData.links.map(link => ({
      ...link,
      source: typeof link.source === 'string' ? nodesMap.get(link.source) : link.source,
      target: typeof link.target === 'string' ? nodesMap.get(link.target) : link.target
    }));

    // 力导向图模拟
    const simulation = d3.forceSimulation(currentData.nodes)
      .force('link', d3.forceLink(processedLinks).id(d => d.id).distance(d => {
        switch (d.relationship) {
          case 'leads': return 150;
          case 'develops': return 180;
          case 'applies': return 200;
          case 'supports': return 220;
          default: return 180;
        }
      }))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(140));

    simulationRef.current = simulation;

    // 连线
    const link = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(processedLinks)
      .enter().append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.strength) * 2);

    // 节点
    const node = g.append('g')
      .attr('class', 'nodes')
      .selectAll('foreignObject')
      .data(currentData.nodes)
      .enter().append('foreignObject')
      .attr('width', 260)
      .attr('height', 180)
      .attr('x', -130)
      .attr('y', -90)
      .style('cursor', 'pointer')
      .style('filter', d => highlightedNodes.size > 0 && !highlightedNodes.has(d.id) ? 'opacity(0.3)' : 'none')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', (event, d) => {
        setSelectedNode(d);
      })
      .on('mouseover', function(event, d) {
        // 改变字体大小
        d3.select(this).select('div')
          .transition().duration(200)
          .style('transform', 'scale(1.15)');
        
        // 高亮相连的节点和线
        const connectedNodes = new Set();
        processedLinks.forEach(l => {
          if (l.source.id === d.id) connectedNodes.add(l.target.id);
          if (l.target.id === d.id) connectedNodes.add(l.source.id);
        });
        
        g.selectAll('foreignObject')
          .style('opacity', n => n.id === d.id || connectedNodes.has(n.id) ? 1 : 0.3);
        g.selectAll('line')
          .style('opacity', l => l.source.id === d.id || l.target.id === d.id ? 1 : 0.2);
      })
      .on('mouseout', function(event, d) {
        // 恢复原始大小
        d3.select(this).select('div')
          .transition().duration(200)
          .style('transform', 'scale(1)');
        
        g.selectAll('foreignObject').style('opacity', 1);
        g.selectAll('line').style('opacity', 0.6);
      });

    // 添加HTML内容到foreignObject
    node.append('xhtml:div')
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .style('text-align', 'center')
      .style('font-size', '18px')
      .style('font-weight', '700')
      .style('line-height', '1.2')
      .style('word-wrap', 'break-word')
      .style('overflow-wrap', 'break-word')
      .style('hyphens', 'auto')
      .style('color', d => getNodeColor(d.type))
      .style('padding', '8px')
      .style('transform-origin', 'center')
      .style('transition', 'transform 0.2s ease')
      .text(d => d.name);



    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      // 更新节点位置
      node
        .attr('x', d => d.x - 130)
        .attr('y', d => d.y - 90);


    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data, visibleTypes, highlightedNodes,setSelectedNode, setZoomLevel]);

  return (
    <div className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full bg-gradient-to-br from-gray-50 to-white"></svg>
 
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="font-semibold text-sm mb-3 flex items-center">
          <Filter size={16} className="mr-2 text-gray-500" />
          Filters
        </h3>
        <div className="space-y-3">
          {[
            { type: 'People', color: '#5F5BA3', count: data.nodes?.filter(n => n.type === 'People').length || 0 },
            { type: 'Institutions', color: '#DC2680', count: data.nodes?.filter(n => n.type === 'Institutions').length || 0 },
            { type: 'Projects', color: '#EB631A', count: data.nodes?.filter(n => n.type === 'Projects').length || 0 },
            { type: 'Methods', color: '#F8AE15', count: data.nodes?.filter(n => n.type === 'Methods').length || 0 }
          ].map(item => (
            <div 
              key={item.type} 
              className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              onClick={() => toggleNodeType(item.type)}
            >
              <div 
                className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-all`}
                style={{ 
                  backgroundColor: visibleTypes[item.type] ? item.color : 'white',
                  borderColor: visibleTypes[item.type] ? item.color : '#d1d5db'
                }}
              >
                {visibleTypes[item.type] && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm select-none ${visibleTypes[item.type] ? 'text-gray-900' : 'text-gray-400'}`}>
                {item.type} ({item.count})
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <div>• Drag text to explore</div>
            <div>• Hover for connections</div>
            <div>• Click for details</div>
            <div>• Check/uncheck to filter</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => handleZoom('in')}
          className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow border"
          title="Zoom In"
        >
          <ZoomIn size={20} className="text-gray-600" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow border"
          title="Zoom Out"
        >
          <ZoomOut size={20} className="text-gray-600" />
        </button>
        <div className="text-xs text-center text-gray-500 mt-1 bg-white rounded px-2 py-1 shadow">
          {Math.round(zoomLevel * 100)}%
        </div>
      </div>
    </div>
  );
};

export default GraphView;