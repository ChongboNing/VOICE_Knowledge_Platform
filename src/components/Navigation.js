import React from 'react';
import { Info, HelpCircle, Accessibility, Languages, Menu  } from 'lucide-react';

const Navigation = ({ isNavExpanded, setIsNavExpanded, setShowModal, data }) => {
  const navItems = [
    { id: 'intro', icon: Info, label: 'Introduction', content: `# VOICE Knowledge Platform

The VOICE Knowledge Platform is a publicly accessible resource designed for artists, researchers, the public, and funders. This collaborative space enables artists to discover, follow, and adapt methods developed by VOICE artists for their own contexts and creative practices.

Using a rhizomatic methodology, this platform displays emerging knowledge from the VOICE project as an interconnected ecosystem. The visualization maps relationships between People, Institutions, Projects, and Methods, revealing the holistic and reciprocal nature of creative research networks.

# Core Features
**Network Graph View**: Navigate an interactive D3.js-powered visualization displaying relationships between People, Institutions, Projects, and Methods. Each connection represents verified collaborations and influences within the VOICE research ecosystem.
**Simple Table View**: Access the same data through a streamlined, accessible table format for enhanced readability and data analysis.
**Advanced Filtering**: Refine your exploration using category-based filters to focus on specific entity types or relationship patterns.` },
    { id: 'howto', icon: HelpCircle, label: 'How to use it', content: `**Graph View**: Click and drag nodes to explore relationships. Hover over nodes to see connections and discover how different entities collaborate and influence each other.
**Simple View**: Toggle to table format using the "Simple View" button for a more traditional data browsing experience.
**Navigation**: Use sidebar controls to switch between view modes, apply filters, or access detailed entity information. Each interaction reveals new pathways through the evolving landscape of interactive art and research.` },
    { id: 'accessibility', icon: Accessibility, label: 'Accessibility', content: 'This site supports screen readers and keyboard navigation. Use Tab to navigate through interactive elements...' },
    { id: 'translation', icon: Languages, label: 'Translation Help', content: 'To translate this site, enable your browser\'s built-in translation feature...' }
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isNavExpanded ? 'w-64' : 'w-16'} border-r`}>
      <div className="p-4">
        <button
          onClick={() => setIsNavExpanded(!isNavExpanded)}
          className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded transition-colors"
          title="Toggle Navigation"
        >
           <Menu size={20} className="text-gray-600" />
        </button>
      </div>
      
      <nav className="mt-8">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setShowModal(item)}
              className="w-full flex items-center p-4 hover:bg-gray-100 transition-colors text-left"
              title={item.label}
            >
              <Icon size={20} className="text-gray-600 flex-shrink-0" />
              {isNavExpanded && (
                <span className="ml-3 text-base text-gray-700">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
      
      {isNavExpanded && data.nodes && (
        <div className="absolute bottom-4 left-4 right-4 bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-600 space-y-1">
            <div className="font-semibold">VOICE Prototype V1</div>
            <div className="text-sm text-gray-500 mb-2">Network Statistics:</div>
            <div>Total Nodes: {data.nodes.length}</div>
            <div>Total Links: {data.links?.length || 0}</div>
            <div>People: {data.nodes.filter(n => n.type === 'People').length}</div>
            <div>Institutions: {data.nodes.filter(n => n.type === 'Institutions').length}</div>
            <div>Projects: {data.nodes.filter(n => n.type === 'Projects').length}</div>
            <div>Methods: {data.nodes.filter(n => n.type === 'Methods').length}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;