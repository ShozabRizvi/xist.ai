const { useState, useEffect } = React;

// Main PRIME Application Component
const MainApp = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAuthorityLogin, setShowAuthorityLogin] = useState(false);
  
  // Listen for navigation events
  useEffect(() => {
    const handleNavigate = (event) => {
      setActiveSection(event.detail);
    };

    const handleAuthorityLogin = () => {
      setShowAuthorityLogin(true);
    };

    window.addEventListener('navigate', handleNavigate);
    window.addEventListener('showAuthorityLogin', handleAuthorityLogin);

    return () => {
      window.removeEventListener('navigate', handleNavigate);
      window.removeEventListener('showAuthorityLogin', handleAuthorityLogin);
    };
  }, []);

  // Authority login handler
  const handleAuthorityLogin = (userInfo) => {
    const { setSettings } = useSettings();
    setSettings(prev => ({
      ...prev,
      user: { ...prev.user, ...userInfo }
    }));
    setActiveSection('authority');
    setShowAuthorityLogin(false);
  };

  // Render active section
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />;
      case 'verify':
        return <VerifySection />;
      case 'community':
        return <CommunitySection />;
      case 'education':
        return <EducationSection />;
      case 'protection':
        return <ProtectionSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'authority':
        return <AuthoritySection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className="flex-1 overflow-hidden">
        {renderActiveSection()}
      </main>

      <AuthorityLoginModal
        isOpen={showAuthorityLogin}
        onClose={() => setShowAuthorityLogin(false)}
        onLogin={handleAuthorityLogin}
      />
    </div>
  );
};

// Root App Component with Providers
const App = () => {
  return (
    <UserSettingsProvider>
      <SettingsProvider>
        <MainApp />
      </SettingsProvider>
    </UserSettingsProvider>
  );
};

// Initialize the application
ReactDOM.render(<App />, document.getElementById('root'));

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
