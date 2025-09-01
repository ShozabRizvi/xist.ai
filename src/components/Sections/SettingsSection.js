const { useState } = React;

// Complete Enhanced Settings Section with ALL Tabs
const SettingsSection = () => {
  const { settings, setSettings } = useSettings();
  const { userPreferences, setUserPreferences } = useUserSettings();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'ai', label: 'AI & Models', icon: '🤖' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' },
    { id: 'advanced', label: 'Advanced', icon: '🔧' },
    { id: 'about', label: 'About', icon: 'ℹ️' }
  ];

  const exportSettings = () => {
    const exportData = {
      settings,
      userPreferences,
      exportDate: new Date().toISOString(),
      version: '2.1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VANTA-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 h-screen overflow-y-auto scrollable-content">
      {/* Header */}
      <div className="glass-elevated p-8 rounded-2xl border border-blue-500/20 animate-fade-in">
        <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          ⚙️ System Settings & Preferences
        </h2>
        <p className="text-gray-400 mb-6">Configure your VANTA experience, privacy settings, and advanced features</p>

        {/* Settings Navigation */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600/50 text-blue-200 border border-blue-400/50'
                  : 'glass-panel border border-gray-600 text-gray-300 hover:border-blue-400/50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="glass-elevated p-6 rounded-xl border border-blue-500/20">
          <h3 className="text-xl font-semibold text-white mb-6">⚙️ General Settings</h3>
          
          <div className="space-y-6">
            <ApiKeyManager 
              apiKey={settings.apiKey} 
              onApiKeyChange={(key) => setSettings(prev => ({ ...prev, apiKey: key }))}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-4 rounded-xl">
                <h4 className="text-blue-300 font-semibold mb-4">🎨 Appearance</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Theme</label>
                    <select
                      value={settings.appearance.theme}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, theme: e.target.value }
                      }))}
                      className="w-full p-3 glass-panel border border-blue-400/40 rounded-lg text-gray-100"
                    >
                      <option value="dark">🌙 Dark Theme</option>
                      <option value="light">☀️ Light Theme</option>
                      <option value="auto">🔄 Auto (System)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Font Size</label>
                    <select
                      value={settings.appearance.fontSize}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, fontSize: e.target.value }
                      }))}
                      className="w-full p-3 glass-panel border border-green-400/40 rounded-lg text-gray-100"
                    >
                      <option value="small">Small (14px)</option>
                      <option value="medium">Medium (16px)</option>
                      <option value="large">Large (18px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Accent Color</label>
                    <div className="flex gap-2">
                      {['blue', 'purple', 'green', 'red', 'cyan'].map(color => (
                        <button
                          key={color}
                          onClick={() => setSettings(prev => ({
                            ...prev,
                            appearance: { ...prev.appearance, accentColor: color }
                          }))}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            settings.appearance.accentColor === color 
                              ? 'border-white scale-110' 
                              : 'border-gray-600 hover:border-gray-400'
                          } ${
                            color === 'blue' ? 'bg-blue-500' :
                            color === 'purple' ? 'bg-purple-500' :
                            color === 'green' ? 'bg-green-500' :
                            color === 'red' ? 'bg-red-500' :
                            'bg-cyan-500'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-gray-300">Animations</label>
                    <input
                      type="checkbox"
                      checked={settings.appearance.animations}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        appearance: { ...prev.appearance, animations: e.target.checked }
                      }))}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-xl">
                <h4 className="text-green-300 font-semibold mb-4">🌍 Language & Region</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Language</label>
                    <select
                      value={settings.user.preferences.language}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        user: {
                          ...prev.user,
                          preferences: { ...prev.user.preferences, language: e.target.value }
                        }
                      }))}
                      className="w-full p-3 glass-panel border border-green-400/40 rounded-lg text-gray-100"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="ta">தமிழ் (Tamil)</option>
                      <option value="te">తెలుగు (Telugu)</option>
                      <option value="bn">বাংলা (Bengali)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Timezone</label>
                    <select
                      value={settings.user.preferences.timezone}
                      className="w-full p-3 glass-panel border border-green-400/40 rounded-lg text-gray-100"
                    >
                      <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
                      <option value="Asia/Mumbai">IST (Asia/Mumbai)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Settings */}
      {activeTab === 'ai' && (
        <div className="glass-elevated p-6 rounded-xl border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-6">🤖 AI & Model Configuration</h3>
          
          <div className="space-y-6">
            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-purple-300 font-semibold mb-4">AI Model Selection</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Primary Model</label>
                  <select
                    value={settings.ai.model}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      ai: { ...prev.ai, model: e.target.value }
                    }))}
                    className="w-full p-3 glass-panel border border-purple-400/40 rounded-lg text-gray-100"
                  >
                    <option value="deepseek/deepseek-r1:free">DeepSeek R1 (Free)</option>
                    <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                    <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="google/gemini-pro">Gemini Pro</option>
                    <option value="meta-llama/llama-2-70b-chat">Llama 2 70B</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Backup Model</label>
                  <select
                    value={settings.ai.backupModel}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      ai: { ...prev.ai, backupModel: e.target.value }
                    }))}
                    className="w-full p-3 glass-panel border border-purple-400/40 rounded-lg text-gray-100"
                  >
                    <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                    <option value="openai/gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-gray-300 mb-2">Confidence Threshold</label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.0"
                    step="0.05"
                    value={settings.ai.confidence}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      ai: { ...prev.ai, confidence: parseFloat(e.target.value) }
                    }))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{settings.ai.confidence}</span>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Max Tokens</label>
                  <input
                    type="number"
                    min="1000"
                    max="8000"
                    value={settings.ai.maxTokens}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      ai: { ...prev.ai, maxTokens: parseInt(e.target.value) }
                    }))}
                    className="w-full p-3 glass-panel border border-purple-400/40 rounded-lg text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Temperature</label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={settings.ai.temperature}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      ai: { ...prev.ai, temperature: parseFloat(e.target.value) }
                    }))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{settings.ai.temperature}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-cyan-300 font-semibold mb-4">Analysis Features</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'multiSource', label: 'Multi-source Verification' },
                  { key: 'behavioralAnalysis', label: 'Behavioral Analysis' },
                  { key: 'contextMemory', label: 'Context Memory' },
                  { key: 'voiceEnabled', label: 'Voice Features' }
                ].map(feature => (
                  <div key={feature.key} className="flex items-center justify-between">
                    <span className="text-gray-300">{feature.label}</span>
                    <input
                      type="checkbox"
                      checked={settings.ai[feature.key]}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        ai: { ...prev.ai, [feature.key]: e.target.checked }
                      }))}
                      className="rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ FIXED: Privacy Settings */}
      {activeTab === 'privacy' && (
        <div className="glass-elevated p-6 rounded-xl border border-red-500/20">
          <h3 className="text-xl font-semibold text-white mb-6">🔒 Privacy & Security Settings</h3>
          
          <div className="space-y-6">
            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-red-300 font-semibold mb-4">Data Privacy</h4>
              <div className="space-y-4">
                {[
                  { key: 'dataSharing', label: 'Share Usage Data', description: 'Help improve VANTA AI by sharing anonymous usage statistics' },
                  { key: 'anonymousReporting', label: 'Anonymous Reporting', description: 'Submit threat reports anonymously' },
                  { key: 'localProcessing', label: 'Local Processing', description: 'Process data locally when possible' },
                  { key: 'encryptReports', label: 'Encrypt Reports', description: 'Encrypt all submitted reports and data' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 glass-panel rounded-lg">
                    <div className="flex-1">
                      <div className="text-white font-medium">{item.label}</div>
                      <div className="text-gray-400 text-sm">{item.description}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy[item.key]}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, [item.key]: e.target.checked }
                      }))}
                      className="rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-orange-300 font-semibold mb-4">Data Retention</h4>
              <div>
                <label className="block text-gray-300 mb-2">Delete Data After</label>
                <select
                  value={settings.privacy.dataRetentionDays}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, dataRetentionDays: parseInt(e.target.value) }
                  }))}
                  className="w-full p-3 glass-panel border border-orange-400/40 rounded-lg text-gray-100"
                >
                  <option value="30">30 Days</option>
                  <option value="90">90 Days</option>
                  <option value="180">6 Months</option>
                  <option value="365">1 Year</option>
                  <option value="-1">Never Delete</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ FIXED: Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="glass-elevated p-6 rounded-xl border border-yellow-500/20">
          <h3 className="text-xl font-semibold text-white mb-6">🔔 Notification Preferences</h3>
          
          <div className="space-y-6">
            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-yellow-300 font-semibold mb-4">Notification Types</h4>
              <div className="space-y-4">
                {[
                  { key: 'threatAlerts', label: 'Threat Alerts', description: 'Get notified about new security threats', icon: '🚨' },
                  { key: 'communityUpdates', label: 'Community Updates', description: 'New reports and community activities', icon: '👥' },
                  { key: 'authorityUpdates', label: 'Authority Alerts', description: 'Official government and authority notifications', icon: '🏛️' },
                  { key: 'educationReminders', label: 'Education Reminders', description: 'Reminders for fraud prevention learning', icon: '🎓' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 glass-panel rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <div className="text-white font-medium">{item.label}</div>
                        <div className="text-gray-400 text-sm">{item.description}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications[item.key]}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, [item.key]: e.target.checked }
                      }))}
                      className="rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-green-300 font-semibold mb-4">Notification Methods</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">🔊 Sound Effects</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.soundEnabled}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, soundEnabled: e.target.checked }
                    }))}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">📧 Email Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, emailNotifications: e.target.checked }
                    }))}
                    className="rounded"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-gray-300 mb-2">Notification Frequency</label>
                <select
                  value={settings.notifications.frequency}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, frequency: e.target.value }
                  }))}
                  className="w-full p-3 glass-panel border border-green-400/40 rounded-lg text-gray-100"
                >
                  <option value="immediate">Immediate</option>
                  <option value="hourly">Hourly Summary</option>
                  <option value="daily">Daily Summary</option>
                  <option value="weekly">Weekly Summary</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ FIXED: Accessibility Settings */}
      {activeTab === 'accessibility' && (
        <div className="glass-elevated p-6 rounded-xl border border-green-500/20">
          <h3 className="text-xl font-semibold text-white mb-6">♿ Accessibility Features</h3>
          
          <div className="space-y-6">
            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-green-300 font-semibold mb-4">Visual Accessibility</h4>
              <div className="space-y-4">
                {[
                  { key: 'highContrast', label: 'High Contrast Mode', description: 'Increase contrast for better visibility' },
                  { key: 'largeText', label: 'Large Text', description: 'Increase text size throughout the application' },
                  { key: 'reduceMotion', label: 'Reduce Motion', description: 'Minimize animations and transitions' },
                  { key: 'colorBlindSupport', label: 'Color Blind Support', description: 'Enhanced color patterns for color blindness' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 glass-panel rounded-lg">
                    <div className="flex-1">
                      <div className="text-white font-medium">{item.label}</div>
                      <div className="text-gray-400 text-sm">{item.description}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility[item.key]}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        accessibility: { ...prev.accessibility, [item.key]: e.target.checked }
                      }))}
                      className="rounded"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-gray-300 mb-2">Font Size</label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={settings.accessibility.fontSize || 16}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    accessibility: { ...prev.accessibility, fontSize: parseInt(e.target.value) }
                  }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>12px</span>
                  <span>{settings.accessibility.fontSize || 16}px</span>
                  <span>24px</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-blue-300 font-semibold mb-4">Audio Accessibility</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Voice Speed</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={settings.accessibility.voiceSpeed || 1.0}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      accessibility: { ...prev.accessibility, voiceSpeed: parseFloat(e.target.value) }
                    }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>0.5x</span>
                    <span>{settings.accessibility.voiceSpeed || 1.0}x</span>
                    <span>2.0x</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-300">🔊 Audio Descriptions</span>
                  <input
                    type="checkbox"
                    checked={settings.accessibility.audioDescriptions}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      accessibility: { ...prev.accessibility, audioDescriptions: e.target.checked }
                    }))}
                    className="rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ FIXED: Advanced Settings */}
      {activeTab === 'advanced' && (
        <div className="glass-elevated p-6 rounded-xl border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-6">🔧 Advanced Configuration</h3>
          
          <div className="space-y-6">
            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-purple-300 font-semibold mb-4">Developer Options</h4>
              <div className="space-y-4">
                {[
                  { key: 'developerMode', label: 'Developer Mode', description: 'Enable advanced debugging and development features' },
                  { key: 'debugMode', label: 'Debug Mode', description: 'Show detailed error messages and logs' },
                  { key: 'experimentalFeatures', label: 'Experimental Features', description: 'Enable beta and experimental features' },
                  { key: 'betaAccess', label: 'Beta Access', description: 'Get early access to new features' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 glass-panel rounded-lg">
                    <div className="flex-1">
                      <div className="text-white font-medium">{item.label}</div>
                      <div className="text-gray-400 text-sm">{item.description}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.advanced[item.key]}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        advanced: { ...prev.advanced, [item.key]: e.target.checked }
                      }))}
                      className="rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl">
              <h4 className="text-cyan-300 font-semibold mb-4">Performance Settings</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Performance Mode</label>
                  <select
                    value={settings.advanced.performanceMode}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      advanced: { ...prev.advanced, performanceMode: e.target.value }
                    }))}
                    className="w-full p-3 glass-panel border border-cyan-400/40 rounded-lg text-gray-100"
                  >
                    <option value="battery">Battery Saver</option>
                    <option value="balanced">Balanced</option>
                    <option value="performance">High Performance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">API Timeout (seconds)</label>
                  <input
                    type="number"
                    min="10"
                    max="120"
                    value={settings.advanced.timeout / 1000}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      advanced: { ...prev.advanced, timeout: parseInt(e.target.value) * 1000 }
                    }))}
                    className="w-full p-3 glass-panel border border-cyan-400/40 rounded-lg text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Max Concurrent Requests</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.advanced.maxConcurrentRequests}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      advanced: { ...prev.advanced, maxConcurrentRequests: parseInt(e.target.value) }
                    }))}
                    className="w-full p-3 glass-panel border border-cyan-400/40 rounded-lg text-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-yellow-500/30">
              <h4 className="text-yellow-300 font-semibold mb-4">⚠️ Danger Zone</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    if (confirm('Are you sure? This will reset all settings to default.')) {
                      // Reset settings logic here
                      alert('Settings reset to default');
                    }
                  }}
                  className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                >
                  🔄 Reset All Settings
                </button>
                <button 
                  onClick={() => {
                    if (confirm('Are you sure? This will clear all local data.')) {
                      localStorage.clear();
                      alert('All local data cleared');
                    }
                  }}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  🗑️ Clear All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Tab */}
      {activeTab === 'about' && (
        <div className="glass-elevated p-8 rounded-xl border border-green-500/20">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
              <span className="text-white font-bold text-4xl">P</span>
            </div>
            <h3 className="text-3xl font-display font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              VANTA AI System v2.1.0
            </h3>
            <p className="text-gray-400 text-lg mb-6">
              Professional Reality Intelligence & Misinformation Evaluation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-xl">
              <h4 className="text-blue-300 font-semibold mb-4">🏆 Project Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Version:</span>
                  <span className="text-white">2.1.0 Professional</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Release Date:</span>
                  <span className="text-white">September 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform:</span>
                  <span className="text-white">Web Application</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Framework:</span>
                  <span className="text-white">React 18 + AI Integration</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <h4 className="text-green-300 font-semibold mb-4">👨‍💻 Development Team</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-blue-400 font-semibold">Lead Developer:</span>
                  <span className="text-white block ml-2">Shozab Rizvi</span>
                </div>
                <div>
                  <span className="text-purple-400 font-semibold">AI Specialist:</span>
                  <span className="text-white block ml-2">Rishabh Srivastava</span>
                </div>
                <div>
                  <span className="text-orange-400 font-semibold">Security Expert:</span>
                  <span className="text-white block ml-2">Asmit Gupta</span>
                </div>
                <div>
                  <span className="text-cyan-400 font-semibold">Team Name:</span>
                  <span className="text-white block ml-2">Code Crusaders</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={exportSettings}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold mr-4"
            >
              📥 Export Settings
            </button>
            <button className="px-6 py-3 glass-panel border border-green-400/40 text-green-300 rounded-lg hover:border-green-400 transition-all">
              🔄 Check for Updates
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SettingsSection;
}
