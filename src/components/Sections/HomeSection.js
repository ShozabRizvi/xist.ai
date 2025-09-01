const { useState, useEffect, useRef } = React;

// Enhanced Home Dashboard with Advanced Analytics
const HomeSection = () => {
  const { analytics, authorityAlerts, protectionStatus } = useSettings();
  const chartRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const [realTimeStats, setRealTimeStats] = useState({
    threatsBlocked: 1247,
    liveThreats: 12,
    activeUsers: 8934,
    systemLoad: 45
  });

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        threatsBlocked: prev.threatsBlocked + Math.floor(Math.random() * 3),
        liveThreats: Math.max(0, prev.liveThreats + Math.floor(Math.random() * 5) - 2),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        systemLoad: Math.max(20, Math.min(80, prev.systemLoad + Math.floor(Math.random() * 10) - 5))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Main Threat Distribution Chart
    if (chartRef.current && window.Chart) {
      const ctx = chartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Phishing', 'Financial Fraud', 'Tech Scams', 'Identity Theft', 'Romance Scams', 'Others'],
          datasets: [{
            data: [35, 25, 20, 15, 8, 7],
            backgroundColor: [
              '#ef4444',
              '#f59e0b', 
              '#3b82f6',
              '#8b5cf6',
              '#ec4899',
              '#6b7280'
            ],
            borderWidth: 0,
            hoverBorderWidth: 3,
            hoverBorderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#9ca3af',
                font: { size: 12 },
                padding: 20,
                usePointStyle: true
              }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              titleColor: '#ffffff',
              bodyColor: '#9ca3af',
              borderColor: '#3b82f6',
              borderWidth: 1,
              cornerRadius: 8
            }
          },
          animation: {
            animateRotate: true,
            duration: 1500
          }
        }
      });

      return () => chart.destroy();
    }
  }, []);

  useEffect(() => {
    // Regional Distribution Pie Chart
    if (pieChartRef.current && window.Chart) {
      const ctx = pieChartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Delhi NCR', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Others'],
          datasets: [{
            data: [28, 22, 18, 15, 10, 7],
            backgroundColor: [
              '#dc2626',
              '#ea580c',
              '#d97706', 
              '#65a30d',
              '#0891b2',
              '#7c3aed'
            ],
            borderWidth: 2,
            borderColor: '#1e293b'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: { 
                color: '#9ca3af', 
                font: { size: 11 },
                boxWidth: 12
              }
            }
          }
        }
      });

      return () => chart.destroy();
    }
  }, []);

  useEffect(() => {
    // Trend Line Chart
    if (lineChartRef.current && window.Chart) {
      const ctx = lineChartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Threats Detected',
            data: [120, 190, 150, 250, 220, 180, 300],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          }, {
            label: 'Successful Blocks',
            data: [100, 170, 140, 230, 200, 160, 280],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: '#9ca3af', font: { size: 12 } }
            }
          },
          scales: {
            x: {
              ticks: { color: '#9ca3af' },
              grid: { color: 'rgba(156, 163, 175, 0.1)' }
            },
            y: {
              ticks: { color: '#9ca3af' },
              grid: { color: 'rgba(156, 163, 175, 0.1)' }
            }
          }
        }
      });

      return () => chart.destroy();
    }
  }, []);

  const stats = [
    {
      label: 'Threats Blocked Today',
      value: realTimeStats.threatsBlocked.toLocaleString(),
      change: '+12%',
      icon: '🛡️',
      color: 'text-red-400',
      trend: 'up',
      description: 'AI-powered threat detection',
      isLive: true
    },
    {
      label: 'Active Verifications',
      value: analytics.totalVerifications.toLocaleString(),
      change: '+24%',
      icon: '🔍',
      color: 'text-blue-400',
      trend: 'up',
      description: 'Fact-checking requests processed'
    },
    {
      label: 'Community Reports',
      value: analytics.communityReports,
      change: '+35%',
      icon: '👥',
      color: 'text-green-400',
      trend: 'up',
      description: 'User-submitted fraud reports'
    },
    {
      label: 'System Accuracy',
      value: `${analytics.accuracyRate}%`,
      change: '+2.1%',
      icon: '🎯',
      color: 'text-purple-400',
      trend: 'up',
      description: 'AI prediction accuracy rate'
    },
    {
      label: 'Response Time',
      value: `${analytics.responseTime}s`,
      change: '-0.3s',
      icon: '⚡',
      color: 'text-cyan-400',
      trend: 'down',
      description: 'Average query processing time'
    },
    {
      label: 'Active Users',
      value: realTimeStats.activeUsers.toLocaleString(),
      change: '+18%',
      icon: '👤',
      color: 'text-yellow-400',
      trend: 'up',
      description: 'Engaged community members',
      isLive: true
    }
  ];

  const recentAlerts = authorityAlerts.slice(0, 2);

  return (
    <div className="p-6 space-y-6 scrollable-content">
      {/* Enhanced Hero Section */}
      <div className="glass-elevated p-8 rounded-2xl border border-blue-500/20 animate-fade-in relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse-gentle"></div>
        <div className="relative max-w-6xl">
          <div className="flex items-center gap-6 mb-6">
           <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center animate-bounce-gentle relative overflow-hidden">
  <img 
    src="/public/logo.png" 
    alt="VANTA AI Logo" 
    className="w-20 h-20 object-contain"
  />
  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-pulse-gentle">
    <span className="text-white text-xs">✓</span>
  </div>
</div>
            <div>
              <h1 className="text-6xl font-display font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                VANTA AI
              </h1>
              <div className="text-xl text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text font-semibold italic mb-6 tracking-wide">
  Intelligence Beyond Limits
</div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="badge-verified">AI-Powered</div>
                <div className="badge-verified">Government Certified</div>
                <div className="badge-verified">Community Driven</div>
                <div className="badge-verified animate-pulse-gentle">Live Protection</div>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed max-w-4xl mb-6">
            Advanced AI-powered platform combining multi-source verification, behavioral analysis,
            community intelligence, and government cooperation to combat misinformation and protect citizens from digital fraud.
          </p>
          
          {/* Live System Status */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="flex items-center gap-3 p-4 glass-panel rounded-lg">
              <span className="text-3xl">🤖</span>
              <div>
                <div className="text-blue-400 font-semibold text-sm">Multi-AI</div>
                <div className="text-gray-400 text-xs">Verification</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 glass-panel rounded-lg">
              <span className="text-3xl">🧠</span>
              <div>
                <div className="text-purple-400 font-semibold text-sm">Behavioral</div>
                <div className="text-gray-400 text-xs">Analysis</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 glass-panel rounded-lg">
              <span className="text-3xl">🌐</span>
              <div>
                <div className="text-cyan-400 font-semibold text-sm">Community</div>
                <div className="text-gray-400 text-xs">Intelligence</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 glass-panel rounded-lg">
              <span className="text-3xl">🎓</span>
              <div>
                <div className="text-green-400 font-semibold text-sm">Educational</div>
                <div className="text-gray-400 text-xs">Insights</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 glass-panel rounded-lg">
              <span className="text-3xl">🏛️</span>
              <div>
                <div className="text-red-400 font-semibold text-sm">Government</div>
                <div className="text-gray-400 text-xs">Integration</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Authority Alerts */}
      {recentAlerts.length > 0 && (
        <div className="glass-elevated p-6 rounded-xl border border-red-500/20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-300 flex items-center gap-2">
              🚨 Critical Authority Alerts
              <div className="notification-dot"></div>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{recentAlerts.length} active alerts</span>
              <button className="px-3 py-1 bg-red-600/20 text-red-300 rounded text-xs hover:bg-red-600/30 transition-colors">
                View All
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {recentAlerts.map(alert => (
              <div key={alert.id} className="glass-panel p-4 rounded-lg border border-red-400/30 hover:border-red-400/50 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-red-300 flex items-center gap-2">
                    {alert.urgency === 'CRITICAL' ? '🔴' : alert.urgency === 'HIGH' ? '🟡' : '🟢'}
                    {alert.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      alert.urgency === 'CRITICAL' ? 'bg-red-600/50 text-red-200 animate-pulse-gentle' :
                      alert.urgency === 'HIGH' ? 'bg-orange-600/50 text-orange-200' :
                      'bg-yellow-600/50 text-yellow-200'
                    }`}>
                      {alert.urgency}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">{alert.content}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-blue-400">
                    🏛️ {alert.authority} • Officer: {alert.officerName}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">👁️ {alert.views?.toLocaleString()} views</span>
                    <div className="verified-badge px-2 py-1 rounded text-white">
                      ✓ Verified
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glass-elevated p-6 rounded-xl border border-blue-500/20 animate-fade-in hover:scale-105 transition-transform duration-300 message-bubble relative overflow-hidden"
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            {stat.isLive && (
              <div className="absolute top-2 right-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse-gentle"></div>
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-400' : 'text-blue-400'
              }`}>
                {stat.trend === 'up' ? '↗️' : '↘️'} {stat.change}
              </span>
              <span className="text-gray-500 text-sm">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-elevated p-6 rounded-xl border border-blue-500/20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Threat Distribution</h3>
          <div className="chart-container">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div className="glass-elevated p-6 rounded-xl border border-blue-500/20 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Regional Analysis</h3>
          <div className="chart-container">
            <canvas ref={pieChartRef}></canvas>
          </div>
        </div>

        <div className="glass-elevated p-6 rounded-xl border border-blue-500/20 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Trend Analysis</h3>
          <div className="chart-container">
            <canvas ref={lineChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="glass-elevated p-6 rounded-xl border border-blue-500/20 animate-fade-in" style={{ animationDelay: '0.9s' }}>
        <h3 className="text-lg font-semibold text-white mb-6">Quick Actions & Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Verify Content', icon: '🔍', color: 'from-blue-500 to-blue-600', action: 'verify', description: 'AI fact-checking' },
            { label: 'Report Fraud', icon: '🚨', color: 'from-red-500 to-red-600', action: 'community', description: 'Community alert' },
            { label: 'Learn Safety', icon: '🎓', color: 'from-green-500 to-green-600', action: 'education', description: 'Interactive lessons' },
            { label: 'View Analytics', icon: '📊', color: 'from-purple-500 to-purple-600', action: 'analytics', description: 'Threat intelligence' },
            { label: 'Protection Hub', icon: '🛡️', color: 'from-cyan-500 to-cyan-600', action: 'protection', description: 'Active monitoring' },
            { label: 'Community Hub', icon: '👥', color: 'from-indigo-500 to-indigo-600', action: 'community', description: 'Collaborative security' },
            { label: 'Authority Portal', icon: '🏛️', color: 'from-orange-500 to-red-600', action: 'authority', description: 'Official channel' },
            { label: 'System Settings', icon: '⚙️', color: 'from-gray-500 to-gray-600', action: 'settings', description: 'Customize experience' }
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: action.action }))}
              className={`p-6 bg-gradient-to-br ${action.color} rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2 group-hover:animate-bounce-gentle">{action.icon}</div>
                <p className="text-white font-medium text-sm">{action.label}</p>
                <p className="text-white/70 text-xs mt-1">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* System Health Dashboard */}
      <div className="glass-elevated p-6 rounded-xl border border-blue-500/20 animate-fade-in" style={{ animationDelay: '1.0s' }}>
        <h3 className="text-lg font-semibold text-white mb-4">System Health & Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { service: 'AI Engine', status: 'Operational', uptime: '99.9%', load: 'Normal', color: 'text-green-400' },
            { service: 'Community Network', status: 'Operational', uptime: '99.8%', load: 'Low', color: 'text-green-400' },
            { service: 'Government API', status: 'Operational', uptime: '99.7%', load: 'Normal', color: 'text-green-400' },
            { service: 'Threat Database', status: 'Operational', uptime: '100%', load: 'Low', color: 'text-green-400' }
          ].map((item, index) => (
            <div key={index} className="glass-panel p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm font-medium">{item.service}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-gentle"></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${item.color}`}>{item.status}</span>
                <span className="text-gray-400">↑ {item.uptime}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">Load: {item.load}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Copyright Footer */}
      <div className="glass-panel p-6 rounded-xl border border-gray-500/20 text-center animate-fade-in" style={{ animationDelay: '1.1s' }}>
        <div className="text-gray-400">
          <div className="mb-3">
            <h4 className="text-lg font-semibold text-white mb-2">© 2025 VANTA AI</h4>
            <p className="text-sm">"Intelligence Beyond Limits" </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="glass-panel p-3 rounded-lg">
              <div className="text-blue-400 font-semibold text-sm">🏆 Hackathon Project</div>
              <div className="text-xs mt-1">Google Cloud Gen AI Exchange Hackathon</div>
            </div>
            <div className="glass-panel p-3 rounded-lg">
              <div className="text-purple-400 font-semibold text-sm">👨‍💻 Development Team</div>
              <div className="text-xs mt-1">Code Crusaders</div>
            </div>
            <div className="glass-panel p-3 rounded-lg">
              <div className="text-green-400 font-semibold text-sm">🚀 Version</div>
              <div className="text-xs mt-1">2.1.0 Professional</div>
            </div>
          </div>
          <div className="text-xs">
            <div className="mb-2">
              <span className="text-blue-400 font-semibold">Lead Developer:</span> Shozab Rizvi •
              <span className="text-green-400 font-semibold"> AI Specialist:</span> Rishabh Srivastava •
              <span className="text-purple-400 font-semibold"> Security Expert:</span> Asmit Gupta
            </div>
            <div className="text-gray-500">
              Empowering citizens with AI-driven truth verification and comprehensive fraud protection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HomeSection;
}
