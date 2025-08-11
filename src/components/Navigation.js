import React from 'react';
import { Info, HelpCircle, Accessibility, Languages, Menu  } from 'lucide-react';
import SimpleFeedback from './SimpleFeedback';

const Navigation = ({ isNavExpanded, setIsNavExpanded, setShowModal, data }) => {
  const navItems = [
    { id: 'intro', icon: Info, label: 'Introduction', content: `# VOICE Knowledge Platform

The VOICE Knowledge Platform is a publicly accessible resource designed for artists, researchers, the public, and funders. This collaborative space enables artists to discover, follow, and adapt methods developed by VOICE artists for their own contexts and creative practices.

Using a rhizomatic methodology, this platform displays emerging knowledge from the VOICE project as an interconnected ecosystem. The visualization maps relationships between People, Institutions, Projects, and Methods, revealing the holistic and reciprocal nature of creative research networks.

# Core Features
**Network Map View**: Navigate an interactive D3.js-powered visualization displaying relationships between People, Institutions, Projects, and Methods. Each connection represents verified collaborations and influences within the VOICE research ecosystem.
**Simple Table View**: Access the same data through a streamlined, accessible table format for enhanced readability and data analysis.
**Advanced Filtering**: Refine your exploration using category-based filters to focus on specific entity types or relationship patterns.` },
    { id: 'howto', icon: HelpCircle, label: 'How to use it', content: `**Map View**: Click and drag nodes to explore relationships. Hover over nodes to see connections and discover how different entities collaborate and influence each other.
**Simple View**: Toggle to table format using the "Simple View" button for a more traditional data browsing experience.
**Navigation**: Use sidebar controls to switch between view modes, apply filters, or access detailed entity information. Each interaction reveals new pathways through the evolving landscape of interactive art and research.` },
    { id: 'accessibility', icon: Accessibility, label: 'Accessibility', content: `# Accessibility Features

This site supports screen readers and keyboard navigation to ensure inclusive access for all users.

# Keyboard Navigation
- Use **Tab** to navigate through interactive elements
- Use **Enter** or **Space** to activate buttons and links
- Use **Escape** to close modal windows and detail panels
- Use **Arrow keys** to navigate within the map view
- Use **Ctrl/Cmd + ← →** to resize panels when modals or details are open

# Screen Reader Support
The site includes proper semantic markup and ARIA labels for assistive technologies. All interactive elements have descriptive labels and roles.

# Visual Accessibility
- High contrast color scheme for better readability (WCAG 2.2 AA compliant)
- Scalable text that respects browser zoom settings
- Clear visual focus indicators for keyboard navigation
- Alternative text descriptions for visual elements

# Keyboard Shortcuts
- **Ctrl/Cmd + E**: Switch between Map and Table view
- **Ctrl/Cmd + K**: Focus search box
- **Ctrl/Cmd + B**: Toggle navigation sidebar
- **?**: Show keyboard shortcuts help` },
    { id: 'translation', icon: Languages, label: 'Translation Help', content: `# Step 1: Choose a Translation Tool
We recommend one of the following:
- [Google Translate Extension (for Chrome)](https://chromewebstore.google.com/detail/google-translate/aapbdbdomjkkjkaonfhkkikfgjllcleb)
- [Microsoft Translator (for Edge)](https://microsoftedge.microsoft.com/addons/detail/microsoft-translator-bui/fbhhdpcmomckhopgphnkegobjdggdfhe)
- [To Google Translate (for Firefox)](https://addons.mozilla.org/en-US/firefox/addon/to-google-translate/)
- [Safari Built-in Translation (for Safari)](https://support.apple.com/en-lb/guide/safari/ibrw646b2ca2/mac)

# Step 2: Install or Enable the Tool
- **Chrome / Edge / Firefox:** Click the link above, then click **Add to browser** or **Install** and follow the instructions.
- **Safari:** No installation is needed. Safari on macOS (Big Sur or later) includes a built-in translation feature. To use it:
  - Open the webpage in Safari.
  - Click the **Translate** button in the address bar.
  - Choose your preferred language.

# Step 3: Translate This Website
Once the tool is installed or enabled:
- Open the plugin or use the browser feature.
- Select your language.
- The content should translate instantly.` }
  ];

  return (
    <>
      {/* 移动端遮罩层 - 只在移动端显示 */}
      {isNavExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsNavExpanded(false)}
          aria-label="Close navigation menu"
        />
      )}
      
      <div className={`
        bg-white shadow-lg transition-all duration-300 border-r h-screen flex flex-col
        
        // 移动端样式
        fixed md:relative
        w-full md:w-auto
        z-50 md:z-auto
        ${isNavExpanded ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        
        // 桌面端样式（保持原有逻辑）
        md:${isNavExpanded ? 'w-64' : 'w-16'}
      `}>
      <div className="p-4">
        <button
          onClick={() => setIsNavExpanded(!isNavExpanded)}
          className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label={`${isNavExpanded ? 'Collapse' : 'Expand'} navigation menu`}
          aria-expanded={isNavExpanded}
        >
          <Menu size={20} className="text-gray-600" aria-hidden="true" />
        </button>
      </div>
      
      <nav className="mt-8 flex-1">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setShowModal(item)}
              className={`w-full flex items-center hover:bg-gray-100 transition-colors ${isNavExpanded ? 'p-4 text-left' : 'p-4 justify-center'}`}
              aria-label={`Open ${item.label} dialog`}
              aria-describedby={`nav-${item.id}-desc`}
            >
              <Icon size={20} className="text-gray-600 flex-shrink-0" aria-hidden="true" />
              {isNavExpanded && (
                <span className="ml-3 text-base text-gray-700">{item.label}</span>
              )}
              <span id={`nav-${item.id}-desc`} className="sr-only">
                {item.id === 'intro' ? 'Learn about the VOICE Knowledge Platform' :
                 item.id === 'howto' ? 'Instructions for using the platform' :
                 item.id === 'accessibility' ? 'Accessibility features and keyboard shortcuts' :
                 item.id === 'translation' ? 'Help with translating this site' :
                 `Learn more about ${item.label}`}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Feedback按钮 - 现在是独立浮窗 */}
      <SimpleFeedback />
      
      {isNavExpanded && data.nodes && (
        <div className="mx-4 mb-20 bg-gray-50 rounded-lg p-3">
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
    </>
  );
};

export default Navigation;