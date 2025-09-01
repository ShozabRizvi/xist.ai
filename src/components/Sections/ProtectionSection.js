const { useState, useEffect } = React;

// Enhanced Protection Section
const ProtectionSection = () => {
  const { protectionStatus, setProtectionStatus } = useSettings();
  const [blockedNumbers, setBlockedNumbers] = useState([]);
  const [newBlockNumber, setNewBlockNumber] = useState('');
  const [protectionLogs, setProtectionLogs] = useState([]);
  const [realTimeThreats, setRealTimeThreats] = useState(12);

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem('protection_logs') || '[]');
    setProtectionLogs(logs.slice(0, 20));
    
    const blocked = JSON.parse(localStorage.getItem('blocked_numbers') || '[]');
    setBlockedNumbers(blocked);

    // Real-time threat simulation
    const interval = setInterval(() => {
      setRealTimeThreats(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const addBlockedNumber = () => {
    if (newBlockNumber.trim()) {
      const newBlock = {
        id: Date.now(),
        number: newBlockNumber.trim(),
        timestamp: new Date().toISOString(),
        source: 'manual',
        reason: 'User blocked'
      };
      
      const updated = [...blockedNumbers, newBlock];
      setBlockedNumbers(updated);
      localStorage.setItem('blocked_numbers', JSON.stringify(updated));
      
      // Add to protection logs
      const logEntry = {
        id: Date.now(),
        type: 'block_added',
        message: `Number ${newBlockNumber} added to block list`,
        timestamp: new Date().toISOString(),
        severity: 'info'
      };
      
      const updatedLogs = [logEntry, ...protectionLogs.slice(0, 19)];
      setProtectionLogs(updatedLogs);
      localStorage.setItem('protection_logs', JSON.stringify(updatedLogs));
      
      setNewBlockNumber('');
      alert(`✅ Number ${newBlockNumber} has been blocked successfully!`);
    }
  };

  const removeBlockedNumber = (id) => {
    if (confirm('Are you sure you want to unblock this number?')) {
      const updated = blockedNumbers.filter(b => b.id !== id);
      setBlockedNumbers(updated);
      localStorage.setItem('blocked_numbers', JSON.stringify(updated));
    }
  };

  const toggleProtection = (setting, value) => {
    setProtectionStatus(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div className="p-6 space-y-6 h-screen overflow-y-auto scrollable-content">
      {/* Header */}
      <div className="glass-elevated p-8 rounded-2xl border border-green-500/20 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🛡️ Active Protection Suite
          </h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${protectionStatus.isActive ? 'bg-green-400 animate-pulse-gentle' : 'bg-red-400'}`}></div>
            <span className={`text-sm font-medium ${protectionStatus.isActive ? 'text-green-400' : 'text-red-400'}`}>
              {protectionStatus.isActive ? 'Protection Active' : 'Protection Disabled'}
            </span>
          </div>
        </div>
        <p className="text-gray-400 mb-6">Real-time fraud protection and security monitoring with advanced threat detection</p>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { 
              label: 'Calls Blocked', 
              value: protectionStatus.scanResults.callsBlocked, 
              color: 'text-red-400', 
              icon: '📞',
              trend: '+12 today'
            },
            { 
              label: 'SMS Filtered', 
              value: protectionStatus.scanResults.smsFiltered, 
              color: 'text-yellow-400', 
              icon: '💬',
              trend: '+34 today'
            },
            { 
              label: 'Emails Scanned', 
              value: protectionStatus.scanResults.emailsScanned, 
              color: 'text-blue-400', 
              icon: '📧',
              trend: '+56 today'
            },
            { 
              label: 'Sites Blocked', 
              value: protectionStatus.scanResults.sitesBlocked, 
              color: 'text-purple-400', 
              icon: '🌐',
              trend: '+8 today'
            }
          ].map((stat, index) => (
            <div key={index} className="glass-panel p-4 rounded-xl text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
              <div className="relative">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
                <div className="text-green-400 text-xs mt-1">{stat.trend}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Threat Monitor */}
        <div className="glass-panel p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-red-300">🚨 Live Threat Monitor</h4>
            <span className="text-red-400 font-bold">{realTimeThreats} Active Threats</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  realTimeThreats > 20 ? 'bg-red-500' : 
                  realTimeThreats > 10 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(realTimeThreats * 2, 100)}%` }}
              ></div>
            </div>
            <span className="text-gray-400 text-sm">Threat Level: {
              realTimeThreats > 20 ? 'HIGH' : 
              realTimeThreats > 10 ? 'MEDIUM' : 'LOW'
            }</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Block Number Management */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-red-300 mb-4 flex items-center gap-2">
            🚫 Number Block Management
            <span className="text-xs bg-red-600/30 px-2 py-1 rounded">{blockedNumbers.length} Blocked</span>
          </h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex gap-2">
              <input
                type="tel"
                value={newBlockNumber}
                onChange={(e) => setNewBlockNumber(e.target.value)}
                placeholder="Enter phone number to block (+91-XXXXXXXXXX)"
                className="flex-1 p-3 glass-panel border border-red-400/40 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-red-400"
              />
              <button
                onClick={addBlockedNumber}
                disabled={!newBlockNumber.trim()}
                className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 font-semibold"
              >
                🚫 Block
              </button>
            </div>

            {/* Quick Block Suggestions */}
            <div className="flex flex-wrap gap-2">
              <span className="text-gray-400 text-xs">Quick add known scam numbers:</span>
              {['+91-9876543210', '+91-8765432109', '+91-7654321098'].map((number) => (
                <button
                  key={number}
                  onClick={() => setNewBlockNumber(number)}
                  className="px-2 py-1 bg-red-900/30 text-red-300 rounded text-xs hover:bg-red-900/50 transition-colors"
                >
                  {number}
                </button>
              ))}
            </div>
          </div>

          {blockedNumbers.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Recently Blocked Numbers:</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {blockedNumbers.slice(-10).reverse().map(blocked => (
                  <div key={blocked.id} className="flex justify-between items-center p-3 glass-panel rounded-lg">
                    <div>
                      <span className="text-red-400 font-mono text-sm">{blocked.number}</span>
                      <div className="text-xs text-gray-400">
                        Blocked {getRelativeTime(blocked.timestamp)} • {blocked.reason}
                      </div>
                    </div>
                    <button
                      onClick={() => removeBlockedNumber(blocked.id)}
                      className="text-gray-400 hover:text-red-400 p-1"
                      title="Unblock number"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Protection Settings */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-purple-300 mb-4">⚙️ Advanced Protection Settings</h3>
          <div className="space-y-4">
            {[
              { 
                key: 'realTimeScanning', 
                label: 'Real-time Threat Scanning', 
                description: 'Continuously monitor for new threats',
                checked: protectionStatus.isActive 
              },
              { 
                key: 'smsFiltering', 
                label: 'SMS Spam Filtering', 
                description: 'Filter suspicious text messages',
                checked: true 
              },
              { 
                key: 'autoBlock', 
                label: 'Auto-Block Suspicious Numbers', 
                description: 'Automatically block numbers reported by community',
                checked: true 
              },
              { 
                key: 'communitySharing', 
                label: 'Share Threats with Community', 
                description: 'Help others by sharing detected threats',
                checked: false 
              },
              { 
                key: 'emailProtection', 
                label: 'Email Protection', 
                description: 'Scan incoming emails for phishing attempts',
                checked: true 
              },
              { 
                key: 'webProtection', 
                label: 'Web Browsing Protection', 
                description: 'Block malicious websites and downloads',
                checked: true 
              }
            ].map((setting, index) => (
              <div key={index} className="flex items-center justify-between p-3 glass-panel rounded-lg">
                <div className="flex-1">
                  <div className="text-white font-medium">{setting.label}</div>
                  <div className="text-gray-400 text-sm">{setting.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={setting.checked}
                    onChange={(e) => toggleProtection(setting.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Protection Logs */}
      <div className="glass-elevated p-6 rounded-xl border border-blue-500/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📋 Protection Activity Log
          <span className="text-xs bg-blue-600/30 px-2 py-1 rounded">Last 24 Hours</span>
        </h3>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {protectionLogs.length > 0 ? protectionLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-3 glass-panel rounded-lg">
              <div className="flex items-center gap-3">
                <span className={`text-lg ${
                  log.severity === 'error' ? 'text-red-400' :
                  log.severity === 'warning' ? 'text-yellow-400' :
                  log.severity === 'success' ? 'text-green-400' :
                  'text-blue-400'
                }`}>
                  {log.severity === 'error' ? '❌' :
                   log.severity === 'warning' ? '⚠️' :
                   log.severity === 'success' ? '✅' : 'ℹ️'}
                </span>
                <div>
                  <div className="text-white text-sm">{log.message}</div>
                  <div className="text-gray-400 text-xs">{getRelativeTime(log.timestamp)}</div>
                </div>
              </div>
              <span className="text-xs text-gray-400">{log.type}</span>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">📋</div>
              <p>No protection activity logged yet.</p>
              <p className="text-sm mt-2">Your protection system is monitoring for threats.</p>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Actions */}
      <div className="glass-elevated p-6 rounded-xl border border-red-500/20">
        <h3 className="text-lg font-semibold text-red-300 mb-4">🚨 Emergency Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl hover:scale-105 transition-all text-white">
            <div className="text-2xl mb-2">🔒</div>
            <div className="text-sm font-semibold">Lock All Access</div>
          </button>
          <button className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl hover:scale-105 transition-all text-white">
            <div className="text-2xl mb-2">📞</div>
            <div className="text-sm font-semibold">Report to Police</div>
          </button>
          <button className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl hover:scale-105 transition-all text-white">
            <div className="text-2xl mb-2">🛡️</div>
            <div className="text-sm font-semibold">Max Protection</div>
          </button>
          <button className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl hover:scale-105 transition-all text-white">
            <div className="text-2xl mb-2">📱</div>
            <div className="text-sm font-semibold">Contact Support</div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProtectionSection;
}
