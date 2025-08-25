// 颜色配置
export const getNodeColor = (type) => {
  switch (type) {
    case 'People': return '#5F5BA3';     
    case 'Institutions': return '#DC2680'; 
    case 'Projects': return '#EB631A';    
    case 'Methods': return '#148D66';   
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
    const lowerTerm = term.toLowerCase();
    
    // 检查名称
    if (node.name.toLowerCase().includes(lowerTerm)) {
      matches.add(node.id);
      return;
    }
    
    // 检查 bio（可能是字符串或数组）
    if (node.bio) {
      const bioText = Array.isArray(node.bio) ? node.bio.join(' ') : node.bio;
      if (bioText.toLowerCase().includes(lowerTerm)) {
        matches.add(node.id);
        return;
      }
    }
    
    // 检查 description（可能是字符串或数组）
    if (node.description) {
      const descText = Array.isArray(node.description) ? node.description.join(' ') : node.description;
      if (descText.toLowerCase().includes(lowerTerm)) {
        matches.add(node.id);
        return;
      }
    }
    
    // 检查 methods
    if (node.methods && node.methods.toLowerCase().includes(lowerTerm)) {
      matches.add(node.id);
      return;
    }
    
    // 检查 category
    if (node.category && node.category.toLowerCase().includes(lowerTerm)) {
      matches.add(node.id);
      return;
    }
  });
  
  return matches;
};