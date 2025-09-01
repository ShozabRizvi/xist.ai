const { useState, useEffect, useRef } = React;

// Enhanced Analytics Section
const AnalyticsSection = () => {
  const { analytics } = useSettings();
  const chartRef = useRef(null);
  const barChartRef = useRef(null);
  const heatmapRef = useRef(null);

  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState({
    totalVerifications: 2847,
    highRiskDetected: 156,
    accuracyRate: 94.2,
    responseTime: 1.2,
    communityReports: 89,
    governmentAlerts: 12,
    educationalViews: 1234,
    protectionEvents: 567
  });

  useEffect(() => {
    // Trend Analysis Chart
    if (chartRef.current && window.Chart) {
      const ctx = chartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Threats Detected',
              data: [65, 89, 120, 81, 156, 155, 140],
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Successful Blocks',
              data: [60, 85, 115, 78, 150, 148, 135],
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'False Positives',
              data: [5, 4, 5, 3, 6, 7, 5],
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
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
  }, [timeRange]);

  useEffect(() => {
    // Regional Bar Chart
    if (barChartRef.current && window.Chart) {
      const ctx = barChartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Delhi NCR', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'],
          datasets: [{
            label: 'Threat Reports',
            data: [284, 256, 198, 167, 134, 120],
            backgroundColor: [
              '#ef4444',
              '#f59e0b', 
              '#3b82f6',
              '#8b5cf6',
              '#10b981',
              '#ec4899'
            ],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              ticks: { color: '#9ca3af' },
              grid: { display: false }
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

  const metrics = [
    {
      label: 'Total Verifications',
      value: analyticsData.totalVerifications.toLocaleString(),
      change: '+24%',
      color: 'text-blue-400',
      icon: '🔍'
    },
    {
      label: 'High Risk Detected',
      value: analyticsData.highRiskDetected,
      change: '+12%',
      color: 'text-red-400',
      icon: '⚠️'
    },
    {
      label: 'Accuracy Rate',
      value: `${analyticsData.accuracyRate}%`,
      change: '+2%',
      color: 'text-green-400',
      icon: '🎯'
    },
    {
      label: 'Avg Response Time',
      value: `${analyticsData.responseTime}s`,
      change: '-0.3s',
      color: 'text-purple-400',
      icon: '⚡'
    }
  ];

  const regionalData = [
    { region: 'Delhi NCR', threats: 284, level: 'HIGH', trend: '+15%', population: 32000000 },
    { region: 'Mumbai', threats: 256, level: 'HIGH', trend: '+8%', population: 20400000 },
    { region: 'Bangalore', threats: 198, level: 'MEDIUM', trend: '+12%', population: 13200000 },
    { region: 'Chennai', threats: 167, level: 'MEDIUM', trend: '+5%', population: 11000000 },
    { region: 'Kolkata', threats: 134, level: 'LOW', trend: '-3%', population: 14800000 },
    { region: 'Hyderabad', threats: 120, level: 'LOW', trend: '+7%', population: 10500000 }
  ];

  const threatCategories = [
    { name: 'Phishing', count: 1247, percentage: 35, color: 'bg-red-500' },
    { name: 'Financial Fraud', count: 892, percentage: 25, color: 'bg-orange-500' },
    { name: 'Voice Scams', count: 714, percentage: 20, color: 'bg-blue-500' },
    { name: 'Romance Scams', count: 536, percentage: 15, color: 'bg-purple-500' },
    { name: 'Others', count: 178, percentage: 5, color: 'bg-gray-500' }
  ];

  return (
    <div className="p-6 space-y-6 h-screen overflow-y-auto scrollable-content">
      {/* Header */}
      <div className="glass-elevated p-8 rounded-2xl border border-blue-500/20 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            📊 Advanced Analytics Dashboard
          </h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 glass-panel border border-blue-400/40 rounded-lg text-gray-100 focus:outline-none"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
        <p className="text-gray-400 mb-6">Comprehensive threat intelligence and performance insights</p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="glass-panel p-4 rounded-xl text-center">
              <div className="text-2xl mb-2">{metric.icon}</div>
              <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
              <div className="text-gray-400 text-xs mb-1">{metric.label}</div>
              <div className="text-green-400 text-xs font-medium">{metric.change}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Analysis */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">📈 Threat Trend Analysis</h3>
          <div className="chart-container">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        {/* Regional Analysis */}
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">🗺️ Regional Distribution</h3>
          <div className="chart-container">
            <canvas ref={barChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Detailed Regional Analysis */}
      <div className="glass-elevated p-6 rounded-xl border border-blue-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">🌍 Regional Threat Intelligence</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left p-3 text-gray-300">Region</th>
                <th className="text-left p-3 text-gray-300">Threats</th>
                <th className="text-left p-3 text-gray-300">Risk Level</th>
                <th className="text-left p-3 text-gray-300">Trend</th>
                <th className="text-left p-3 text-gray-300">Per Capita</th>
              </tr>
            </thead>
            <tbody>
              {regionalData.map((region, index) => (
                <tr key={index} className="border-b border-gray-700/50 hover:bg-blue-500/5">
                  <td className="p-3 text-white font-medium">{region.region}</td>
                  <td className="p-3 text-blue-400 font-semibold">{region.threats}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      region.level === 'HIGH' ? 'bg-red-600/50 text-red-200' :
                      region.level === 'MEDIUM' ? 'bg-yellow-600/50 text-yellow-200' :
                      'bg-green-600/50 text-green-200'
                    }`}>
                      {region.level}
                    </span>
                  </td>
                  <td className="p-3 text-gray-300">{region.trend}</td>
                  <td className="p-3 text-gray-300">
                    {((region.threats / region.population) * 100000).toFixed(1)}/100K
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Threat Categories */}
      <div className="glass-elevated p-6 rounded-xl border border-purple-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">🎯 Threat Category Breakdown</h3>
        <div className="space-y-4">
          {threatCategories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${category.color}`}></div>
                <span className="text-white font-medium">{category.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <span className="text-gray-300 text-sm w-16 text-right">{category.count}</span>
                <span className="text-gray-400 text-sm w-8 text-right">{category.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl">
          <h4 className="text-white font-semibold mb-4">⚡ System Performance</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Uptime</span>
              <span className="text-green-400 font-semibold">99.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">API Latency</span>
              <span className="text-blue-400 font-semibold">142ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Success Rate</span>
              <span className="text-green-400 font-semibold">97.2%</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <h4 className="text-white font-semibold mb-4">👥 User Engagement</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Active Users</span>
              <span className="text-purple-400 font-semibold">8,934</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Daily Sessions</span>
              <span className="text-purple-400 font-semibold">12,456</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Session</span>
              <span className="text-purple-400 font-semibold">8m 32s</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <h4 className="text-white font-semibold mb-4">🛡️ Protection Impact</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Lives Protected</span>
              <span className="text-cyan-400 font-semibold">15,678</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Money Saved</span>
              <span className="text-cyan-400 font-semibold">₹2.4 Cr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Education Reach</span>
              <span className="text-cyan-400 font-semibold">45,123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnalyticsSection;
}
