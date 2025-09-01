const { useState } = React;

// Enhanced Professional Sidebar Component
const Sidebar = ({ activeSection, onSectionChange, isCollapsed, onToggleCollapse }) => {
  const { settings, setSettings } = useSettings();
  const [showAuthorityLogin, setShowAuthorityLogin] = useState(false);

  const sections = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: '🏠', 
      description: 'Dashboard Overview', 
      premium: false,
      badge: null,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'verify', 
      label: 'Verify', 
      icon: '🔍', 
      description: 'AI Fact Checker', 
      premium: false,
      badge: 'AI',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'community', 
      label: 'Community', 
      icon: '👥', 
      description: 'Reports & Intelligence', 
      premium: false,
      badge: 'LIVE',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'education', 
      label: 'Learn', 
      icon: '🎓', 
      description: 'Fraud Education', 
      premium: false,
      badge: null,
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      id: 'protection', 
      label: 'Shield', 
      icon: '🛡️', 
      description: 'Active Protection', 
      premium: true,
      badge: 'PRO',
      color: 'from-cyan-500 to-cyan-600'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: '📊', 
      description: 'Insights & Reports', 
      premium: true,
      badge: 'PRO',
      color: 'from-indigo-500 to-indigo-600'
    },
    { 
      id: 'authority', 
      label: 'Authority', 
      icon: '🏛️', 
      description: 'Government Portal', 
      restricted: true,
      badge: 'GOV',
      color: 'from-red-500 to-red-600'
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: '⚙️', 
      description: 'Preferences', 
      premium: false,
      badge: null,
      color: 'from-gray-500 to-gray-600'
    }
  ];

  const handleAuthorityLogin = (userInfo) => {
    setSettings(prev => ({
      ...prev,
      user: { ...prev.user, ...userInfo }
    }));
    onSectionChange('authority');
    setShowAuthorityLogin(false);
  };

  const handleSectionClick = (section) => {
    if (section.restricted && settings.user.role !== 'authority') {
      setShowAuthorityLogin(true);
    } else {
      onSectionChange(section.id);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout from the authority panel?')) {
      setSettings(prev => ({
        ...prev,
        user: {
          ...prev.user,
          name: '',
          email: '',
          role: 'citizen',
          department: '',
          badgeNumber: '',
          verified: false,
          officerName: '',
          verificationLevel: 'NONE',
          permissions: []
        }
      }));
      onSectionChange('home');
    }
  };

  return (
    <>
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 glass-panel border-r border-blue-500/20 h-screen flex flex-col relative overflow-hidden`}>
        
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 animate-pulse-gentle"></div>
        
        {/* Enhanced Header */}
        <div className="relative p-4 border-b border-blue-500/20">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-glow relative overflow-hidden">
  <img 
  src="/public/logo.png"              // Note: No %PUBLIC_URL% needed in JSX
  alt="VANTA AI Logo" 
  className="w-10 h-10 object-contain"
  onError={(e) => {
      console.log('Logo failed to load');
      e.target.style.display = 'none';
    }}
/>
  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse-gentle"></div>
</div>
                  <div>
                    <h1 className="text-xl font-display font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                      VANTA AI
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-400 font-semibold">v2.1.0</span>
                      <span className="badge-premium text-xs">PRO</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 leading-tight">
                  "Intelligence Beyond Limits" 
                </p>
              </div>
            )}
            
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg glass-panel hover:bg-blue-500/20 transition-colors group relative"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span className="text-blue-400 transition-transform duration-300 group-hover:scale-110">
                {isCollapsed ? '→' : '←'}
              </span>
            </button>
          </div>
        </div>

        {/* Enhanced User Status with Authority Badge */}
        {!isCollapsed && settings.user.role === 'authority' && (
          <div className="relative p-3 border-b border-blue-500/20 animate-fade-in">
            <div className="authority-badge text-white p-4 rounded-xl text-center mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 animate-pulse-gentle"></div>
              <div className="relative">
                <div className="text-xs font-bold flex items-center justify-center gap-2">
                  🏛️ VERIFIED AUTHORITY
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-gentle"></div>
                </div>
                <div className="text-sm font-semibold mt-1">{settings.user.officerName}</div>
                <div className="text-xs opacity-90">{settings.user.department}</div>
                <div className="text-xs opacity-75">Badge: {settings.user.badgeNumber}</div>
                <div className="text-xs opacity-75">Level: {settings.user.verificationLevel}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-red-400 hover:text-red-300 px-3 py-2 rounded-lg text-xs transition-colors bg-red-900/20 hover:bg-red-900/30 border border-red-500/30 hover:border-red-400/50"
            >
              🚪 Secure Logout
            </button>
          </div>
        )}

        {/* Enhanced Navigation */}
        <nav className="relative flex-1 p-3 space-y-2 overflow-y-auto scrollable-content">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section)}
              className={`sidebar-item w-full p-3 rounded-xl glass-panel border transition-all duration-300 group relative overflow-hidden ${
                activeSection === section.id
                  ? 'active border-blue-500/40 bg-blue-500/10'
                  : 'border-transparent hover:border-blue-500/30 hover:bg-blue-500/5'
              } ${section.restricted && settings.user.role !== 'authority' ? 'opacity-75' : ''}`}
              title={isCollapsed ? `${section.label} - ${section.description}` : ''}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Button Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative flex items-center gap-3">
                <div className="relative">
                  <span className={`text-xl transition-transform duration-300 group-hover:scale-110 ${isCollapsed ? 'text-center w-full' : ''}`}>
                    {section.icon}
                  </span>
                  
                  {/* Badges and Indicators */}
                  {section.restricted && settings.user.role !== 'authority' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🔒</span>
                    </div>
                  )}
                  
                  {section.badge && (
                    <div className="absolute -top-2 -right-2">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        section.badge === 'PRO' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                        section.badge === 'AI' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                        section.badge === 'LIVE' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse-gentle' :
                        section.badge === 'GOV' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {section.badge}
                      </span>
                    </div>
                  )}
                </div>

                {!isCollapsed && (
                  <div className="text-left flex-1">
                    <div className="font-medium text-white text-sm flex items-center gap-2">
                      {section.label}
                      {section.restricted && settings.user.role !== 'authority' && (
                        <span className="text-red-400 text-xs">🔒</span>
                      )}
                      {activeSection === section.id && (
                        <span className="text-blue-400 text-xs">✓</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                      {section.description}
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* Quick Stats (when expanded) */}
          {!isCollapsed && (
            <div className="mt-4 p-3 glass-panel rounded-xl animate-fade-in">
              <div className="text-xs text-gray-400 font-semibold mb-2">Quick Stats</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Threats Blocked:</span>
                  <span className="text-red-400 font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Verifications:</span>
                  <span className="text-blue-400 font-semibold">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Community Score:</span>
                  <span className="text-green-400 font-semibold">94.2%</span>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Enhanced Footer with System Status */}
        <div className="relative p-4 border-t border-blue-500/20">
          {!isCollapsed ? (
            <div className="text-center animate-fade-in">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-gentle"></div>
                <span className="text-xs text-green-400 font-medium">All Systems Online</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="glass-panel p-2 rounded text-center">
                  <div className="text-gray-400">Uptime</div>
                  <div className="text-green-400 font-semibold">99.8%</div>
                </div>
                <div className="glass-panel p-2 rounded text-center">
                  <div className="text-gray-400">Load</div>
                  <div className="text-blue-400 font-semibold">Normal</div>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 mb-1">Version 2.1.0 Professional</div>
              <div className="text-xs text-gray-500">Code Crusaders</div>
              
              {/* System Health Indicator */}
              <div className="mt-2 flex items-center justify-center gap-1">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse-gentle"></div>
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse-gentle" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse-gentle" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-gentle"></div>
              <div className="text-xs text-green-400 font-mono">OK</div>
            </div>
          )}
        </div>
      </div>

      {/* Authority Login Modal */}
      <AuthorityLoginModal
        isOpen={showAuthorityLogin}
        onClose={() => setShowAuthorityLogin(false)}
        onLogin={handleAuthorityLogin}
      />
    </>
  );
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Sidebar;
}
