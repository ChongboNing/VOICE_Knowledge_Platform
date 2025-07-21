// 颜色配置
export const getNodeColor = (type) => {
  switch (type) {
    case 'People': return '#5F5BA3';     
    case 'Institutions': return '#DC2680'; 
    case 'Projects': return '#EB631A';    
    case 'Methods': return '#F8AE15';   
    default: return '#999';
  }
};

export const getLinkColor = (relationship) => {
  return '#999'; 
};

export const getFilteredData = (data, visibleTypes) => {
  const filteredNodes = data.nodes.filter(node => visibleTypes[node.type]);
  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
  const filteredLinks = data.links.filter(link => 
    filteredNodeIds.has(link.source) && filteredNodeIds.has(link.target)
  );
  
  return { nodes: filteredNodes, links: filteredLinks };
};

export const searchNodes = (data, term) => {
  if (term.trim() === '') {
    return new Set();
  }
  
  const matches = new Set();
  data.nodes.forEach(node => {
    if (node.name.toLowerCase().includes(term.toLowerCase()) ||
        (node.bio && node.bio.toLowerCase().includes(term.toLowerCase())) ||
        (node.description && node.description.toLowerCase().includes(term.toLowerCase())) ||
        (node.methods && node.methods.toLowerCase().includes(term.toLowerCase())) ||
        (node.category && node.category.toLowerCase().includes(term.toLowerCase()))) {
      matches.add(node.id);
    }
  });
  
  return matches;
};