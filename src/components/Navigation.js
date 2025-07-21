import React from 'react';
import { Info, HelpCircle, Accessibility, Languages, Menu  } from 'lucide-react';

const Navigation = ({ isNavExpanded, setIsNavExpanded, setShowModal, data }) => {
  const navItems = [
    { id: 'intro', icon: Info, label: 'Introduction', content: 'This is an interactive relationship graph showing connections between people, institutions, projects, and methods in the field of interactive and immersive art...' },
    { id: 'howto', icon: HelpCircle, label: 'How to use it', content: 'GRAPH VIEW: Click and drag nodes to explore relationships. Hover over nodes to see connections...' },
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
                <span className="ml-3 text-sm text-gray-700">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
      
      {isNavExpanded && data.nodes && (
        <div className="absolute bottom-4 left-4 right-4 bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="font-semibold">VOICE Prototype V1</div>
            <div className="text-xs text-gray-500 mb-2">Network Statistics:</div>
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