const { useState } = React;

// Authority Portal for Government Officials
const AuthoritySection = () => {
  const { settings, authorityAlerts, setAuthorityAlerts } = useSettings();
  const [newAlert, setNewAlert] = useState({
    title: '',
    content: '',
    urgency: 'MEDIUM',
    category: 'general',
    targetRegions: [],
    actionItems: [''],
    expiryDate: ''
  });
  const [activeTab, setActiveTab] = useState('dashboard');

  const isAuthorized = settings.user.role === 'authority' && settings.user.verified;

  if (!isAuthorized) {
    return (
      <div className="p-6 h-screen flex items-center justify-center">
        <div className="glass-elevated p-12 rounded-2xl border border-red-500/30 text-center max-w-md">
          <div className="text-6xl mb-6">🔒</div>
          <h3 className="text-2xl font-bold text-red-300 mb-4">Access Restricted</h3>
          <p className="text-gray-400 mb-6">
            This section is reserved for verified government authorities and law enforcement personnel only.
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('showAuthorityLogin'))}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all font-semibold"
          >
            🏛️ Authority Login
          </button>
        </div>
      </div>
    );
  }

  const publishAlert = () => {
    if (!newAlert.title.trim() || !newAlert.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const alert = {
      id: Date.now().toString(),
      ...newAlert,
      timestamp: new Date().toISOString(),
      authority: settings.user.department,
      badgeNumber: settings.user.badgeNumber,
      officerName: settings.user.officerName,
      verified: true,
      views: 0,
      shares: 0,
      status: 'active'
    };

    setAuthorityAlerts(prev => [alert, ...prev]);
    setNewAlert({
      title: '',
      content: '',
      urgency: 'MEDIUM',
      category: 'general',
      targetRegions: [],
      actionItems: [''],
      expiryDate: ''
    });

    alert('🚨 Alert published successfully to the community!');
  };

  return (
    <div className="p-6 space-y-6 h-screen overflow-y-auto scrollable-content">
      {/* Authority Header */}
      <div className="glass-elevated p-8 rounded-2xl border border-red-500/20 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            🏛️ Government Authority Portal
          </h2>
          <div className="authority-badge text-white px-4 py-2 rounded-lg">
            <div className="text-xs font-bold">VERIFIED AUTHORITY</div>
            <div className="text-sm">{settings.user.officerName}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-panel p-4 rounded-xl">
            <div className="text-red-400 font-semibold">Department</div>
            <div className="text-white">{settings.user.department}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <div className="text-orange-400 font-semibold">Badge Number</div>
            <div className="text-white">{settings.user.badgeNumber}</div>
          </div>
          <div className="glass-panel p-4 rounded-xl">
            <div className="text-yellow-400 font-semibold">Clearance Level</div>
            <div className="text-white">{settings.user.verificationLevel}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'publish', label: 'Publish Alert', icon: '📢' },
            { id: 'reports', label: 'Community Reports', icon: '📋' },
            { id: 'analytics', label: 'Authority Analytics', icon: '📈' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-red-600/50 text-red-200 border border-red-400/50'
                  : 'glass-panel border border-gray-600 text-gray-300 hover:border-red-400/50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Alerts', value: authorityAlerts.length, icon: '🚨', color: 'text-red-400' },
            { label: 'Community Reports', value: '156', icon: '📋', color: 'text-blue-400' },
            { label: 'Verifications Completed', value: '89', icon: '✅', color: 'text-green-400' },
            { label: 'Public Reach', value: '12.4K', icon: '👥', color: 'text-purple-400' }
          ].map((stat, index) => (
            <div key={index} className="glass-panel p-6 rounded-xl text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Publish Alert Tab */}
      {activeTab === 'publish' && (
        <div className="glass-elevated p-8 rounded-xl border border-red-500/20">
          <h3 className="text-xl font-semibold text-red-300 mb-6">📢 Publish Community Alert</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Alert Title (Required)"
                value={newAlert.title}
                onChange={(e) => setNewAlert(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-4 glass-panel border border-red-400/40 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-red-400"
              />
              
              <select
                value={newAlert.urgency}
                onChange={(e) => setNewAlert(prev => ({ ...prev, urgency: e.target.value }))}
                className="w-full p-4 glass-panel border border-orange-400/40 rounded-lg text-gray-100"
              >
                <option value="LOW">🟢 Low Priority</option>
                <option value="MEDIUM">🟡 Medium Priority</option>
                <option value="HIGH">🟠 High Priority</option>
                <option value="CRITICAL">🔴 Critical Alert</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={newAlert.category}
                onChange={(e) => setNewAlert(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-4 glass-panel border border-blue-400/40 rounded-lg text-gray-100"
              >
                <option value="general">General Alert</option>
                <option value="financial">Financial Fraud</option>
                <option value="cyber">Cyber Crime</option>
                <option value="government">Government Scam</option>
                <option value="emergency">Emergency Alert</option>
              </select>

              <input
                type="date"
                value={newAlert.expiryDate}
                onChange={(e) => setNewAlert(prev => ({ ...prev, expiryDate: e.target.value }))}
                className="w-full p-4 glass-panel border border-purple-400/40 rounded-lg text-gray-100"
              />
            </div>

            <textarea
              placeholder="Detailed Alert Content (Required)"
              value={newAlert.content}
              onChange={(e) => setNewAlert(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
              className="w-full p-4 glass-panel border border-blue-400/40 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400"
            />

            <div>
              <label className="block text-gray-300 mb-2">Action Items for Citizens:</label>
              {newAlert.actionItems.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Action item ${index + 1}`}
                    value={item}
                    onChange={(e) => {
                      const updated = [...newAlert.actionItems];
                      updated[index] = e.target.value;
                      setNewAlert(prev => ({ ...prev, actionItems: updated }));
                    }}
                    className="flex-1 p-3 glass-panel border border-green-400/40 rounded-lg text-gray-100"
                  />
                  {index === newAlert.actionItems.length - 1 && (
                    <button
                      onClick={() => setNewAlert(prev => ({ ...prev, actionItems: [...prev.actionItems, ''] }))}
                      className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={publishAlert}
              disabled={!newAlert.title.trim() || !newAlert.content.trim()}
              className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all font-semibold disabled:opacity-50 text-lg"
            >
              🚨 Publish Official Alert
            </button>
          </div>
        </div>
      )}

      {/* Active Alerts Management */}
      {activeTab === 'reports' && (
        <div className="glass-elevated p-6 rounded-xl border border-blue-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">📋 Published Authority Alerts</h3>
          <div className="space-y-4">
            {authorityAlerts.map(alert => (
              <div key={alert.id} className="glass-panel p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-red-300">{alert.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded text-xs font-bold ${
                      alert.urgency === 'CRITICAL' ? 'bg-red-600/50 text-red-200' :
                      alert.urgency === 'HIGH' ? 'bg-orange-600/50 text-orange-200' :
                      alert.urgency === 'MEDIUM' ? 'bg-yellow-600/50 text-yellow-200' :
                      'bg-green-600/50 text-green-200'
                    }`}>
                      {alert.urgency}
                    </span>
                    <span className="verified-badge px-2 py-1 rounded text-white text-xs">
                      ✓ Official
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4 leading-relaxed">{alert.content}</p>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-blue-400">👁️ {alert.views} views</span>
                    <span className="text-green-400">📤 {alert.shares} shares</span>
                  </div>
                  <span className="text-gray-400">
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthoritySection;
}
