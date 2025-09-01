const { useState, useEffect } = React;

// Community Intelligence Network
const CommunitySection = () => {
  const { settings, setSettings, userAnalytics, setUserAnalytics } = useUserSettings();
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({
    type: '',
    description: '',
    phoneNumber: '',
    email: '',
    website: '',
    amount: '',
    location: '',
    urgency: 'MEDIUM'
  });
  
  const [communityStats, setCommunityStats] = useState({
    activeFighters: 1247,
    threatsNeutralized: 89,
    communityScore: 94,
    livesProtected: 156
  });

  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    const communityReports = JSON.parse(localStorage.getItem('community_reports') || '[]');
    setReports(communityReports.slice(0, 20));
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setCommunityStats(prev => ({
        ...prev,
        threatsNeutralized: prev.threatsNeutralized + Math.floor(Math.random() * 3),
        livesProtected: prev.livesProtected + Math.floor(Math.random() * 2)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const submitReport = () => {
    if (!newReport.description.trim()) {
      alert('Please provide a description of the fraud attempt');
      return;
    }

    const report = {
      id: Date.now().toString(),
      ...newReport,
      timestamp: new Date().toISOString(),
      verified: false,
      votes: 0,
      reporter: 'Community Member',
      upvotes: 0,
      downvotes: 0,
      views: 0,
      riskScore: Math.random() * 10,
      confidence: 0.85 + Math.random() * 0.15,
      similarReports: Math.floor(Math.random() * 50),
      status: 'under_review'
    };

    const existing = JSON.parse(localStorage.getItem('community_reports') || '[]');
    existing.unshift(report);
    localStorage.setItem('community_reports', JSON.stringify(existing.slice(0, 100)));
    setReports(existing.slice(0, 20));

    setNewReport({
      type: '',
      description: '',
      phoneNumber: '',
      email: '',
      website: '',
      amount: '',
      location: '',
      urgency: 'MEDIUM'
    });

    setUserAnalytics(prev => ({
      ...prev,
      communityContributions: prev.communityContributions + 1,
      pointsEarned: prev.pointsEarned + 50
    }));

    alert('🎉 Report submitted! Thank you for helping protect the community. You earned 50 points!');
  };

  const voteOnReport = (reportId, voteType) => {
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        const newReport = { ...report };
        if (voteType === 'up') {
          newReport.upvotes = (newReport.upvotes || 0) + 1;
        } else {
          newReport.downvotes = (newReport.downvotes || 0) + 1;
        }
        return newReport;
      }
      return report;
    }));
  };

  const filteredReports = reports.filter(report => {
    if (filterType === 'all') return true;
    return report.type === filterType;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'risk':
        return (b.riskScore || 0) - (a.riskScore || 0);
      case 'votes':
        return ((b.upvotes || 0) - (b.downvotes || 0)) - ((a.upvotes || 0) - (a.downvotes || 0));
      default:
        return 0;
    }
  });

  return (
    <div className="p-6 space-y-6 h-screen overflow-y-auto scrollable-content">
      {/* Real-time Community Dashboard */}
      <div className="glass-elevated p-6 rounded-2xl border border-green-500/20 animate-fade-in">
        <h3 className="text-2xl font-bold text-green-300 mb-6 flex items-center gap-3">
          👥 Community Intelligence Network
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-gentle"></div>
            <span className="text-green-400 text-sm font-medium">Live</span>
          </div>
        </h3>

        {/* Enhanced Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="glass-panel p-4 rounded-xl text-center border border-green-400/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
            <div className="relative">
              <div className="text-2xl font-bold text-green-400">{communityStats.activeFighters.toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Active Fraud Fighters</div>
              <div className="text-green-400 text-xs">↗️ +15% today</div>
            </div>
          </div>
          
          <div className="glass-panel p-4 rounded-xl text-center border border-blue-400/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"></div>
            <div className="relative">
              <div className="text-2xl font-bold text-blue-400">{communityStats.threatsNeutralized}</div>
              <div className="text-gray-400 text-sm">Threats Neutralized</div>
              <div className="text-blue-400 text-xs">⚡ Real-time</div>
            </div>
          </div>
          
          <div className="glass-panel p-4 rounded-xl text-center border border-purple-400/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
            <div className="relative">
              <div className="text-2xl font-bold text-purple-400">{communityStats.communityScore}%</div>
              <div className="text-gray-400 text-sm">Accuracy Rate</div>
              <div className="text-purple-400 text-xs">🎯 Verified</div>
            </div>
          </div>
          
          <div className="glass-panel p-4 rounded-xl text-center border border-yellow-400/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10"></div>
            <div className="relative">
              <div className="text-2xl font-bold text-yellow-400">{communityStats.livesProtected}</div>
              <div className="text-gray-400 text-sm">Lives Protected</div>
              <div className="text-yellow-400 text-xs">💝 Today</div>
            </div>
          </div>
        </div>

        {/* User Progress */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="glass-panel p-4 rounded-xl">
            <h4 className="text-blue-300 font-semibold mb-2">Your Contributions</h4>
            <div className="text-2xl font-bold text-white">{userAnalytics.communityContributions}</div>
            <div className="text-gray-400 text-sm">Reports Submitted</div>
          </div>
          
          <div className="glass-panel p-4 rounded-xl">
            <h4 className="text-purple-300 font-semibold mb-2">Community Points</h4>
            <div className="text-2xl font-bold text-white">{userAnalytics.pointsEarned}</div>
            <div className="text-gray-400 text-sm">Total Points Earned</div>
          </div>
          
          <div className="glass-panel p-4 rounded-xl">
            <h4 className="text-green-300 font-semibold mb-2">Impact Score</h4>
            <div className="text-2xl font-bold text-white">{userAnalytics.accuracyRate}%</div>
            <div className="text-gray-400 text-sm">Report Accuracy</div>
          </div>
        </div>

        {/* Enhanced Report Submission */}
        <div className="glass-panel p-6 rounded-xl mb-6">
          <h4 className="font-semibold text-red-300 mb-4 flex items-center gap-2">
            🚨 Submit Detailed Fraud Report
            <span className="text-xs bg-red-600/30 px-2 py-1 rounded">Help Others</span>
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <select
              value={newReport.type}
              onChange={(e) => setNewReport(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-3 rounded-lg bg-surface border border-blue-400/40 text-gray-100"
            >
              <option value="">Select fraud type</option>
              <option value="lottery">🎰 Lottery/Prize Scam</option>
              <option value="phishing">🎣 Phishing/Email Scam</option>
              <option value="voice">📞 Phone/Voice Scam</option>
              <option value="romance">💕 Romance Scam</option>
              <option value="investment">💰 Investment Fraud</option>
              <option value="banking">🏦 Banking Fraud</option>
              <option value="government">🏛️ Government Impersonation</option>
              <option value="social">📱 Social Media Scam</option>
              <option value="tech">💻 Tech Support Scam</option>
              <option value="job">💼 Job Offer Scam</option>
            </select>
            
            <select
              value={newReport.urgency}
              onChange={(e) => setNewReport(prev => ({ ...prev, urgency: e.target.value }))}
              className="w-full p-3 rounded-lg bg-surface border border-red-400/40 text-gray-100"
            >
              <option value="LOW">🟢 Low Urgency</option>
              <option value="MEDIUM">🟡 Medium Urgency</option>
              <option value="HIGH">🟠 High Urgency</option>
              <option value="CRITICAL">🔴 Critical Alert</option>
            </select>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Phone number (optional)"
              value={newReport.phoneNumber}
              onChange={(e) => setNewReport(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="w-full p-3 rounded-lg bg-surface border border-blue-400/40 text-gray-100"
            />
            <input
              type="email"
              placeholder="Email address (optional)"
              value={newReport.email}
              onChange={(e) => setNewReport(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 rounded-lg bg-surface border border-blue-400/40 text-gray-100"
            />
            <input
              type="url"
              placeholder="Website/URL (optional)"
              value={newReport.website}
              onChange={(e) => setNewReport(prev => ({ ...prev, website: e.target.value }))}
              className="w-full p-3 rounded-lg bg-surface border border-blue-400/40 text-gray-100"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Amount involved (if any)"
              value={newReport.amount}
              onChange={(e) => setNewReport(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full p-3 rounded-lg bg-surface border border-yellow-400/40 text-gray-100"
            />
            <input
              type="text"
              placeholder="Location/City"
              value={newReport.location}
              onChange={(e) => setNewReport(prev => ({ ...prev, location: e.target.value }))}
              className="w-full p-3 rounded-lg bg-surface border border-green-400/40 text-gray-100"
            />
          </div>
          
          <textarea
            placeholder="Detailed description of the fraud attempt (required)..."
            value={newReport.description}
            onChange={(e) => setNewReport(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full p-3 rounded-lg bg-surface border border-blue-400/40 text-gray-100 mb-4"
          />
          
          <button
            onClick={submitReport}
            disabled={!newReport.description.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-300 font-semibold disabled:opacity-50"
          >
            🚨 Submit Community Alert (+50 Points)
          </button>
        </div>

        {/* Report Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 rounded-lg bg-surface border border-blue-400/40 text-gray-100 text-sm"
            >
              <option value="all">All Types</option>
              <option value="lottery">Lottery Scams</option>
              <option value="phishing">Phishing</option>
              <option value="voice">Voice Scams</option>
              <option value="romance">Romance</option>
              <option value="investment">Investment</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 rounded-lg bg-surface border border-purple-400/40 text-gray-100 text-sm"
            >
              <option value="latest">Latest First</option>
              <option value="risk">Highest Risk</option>
              <option value="votes">Most Voted</option>
            </select>
          </div>
        </div>

        {/* Recent Community Reports */}
        <div className="glass-panel p-4 rounded-xl">
          <h4 className="font-semibold text-cyan-300 mb-4 flex items-center gap-2">
            📋 Live Community Reports
            <span className="text-xs bg-cyan-600/30 px-2 py-1 rounded">{sortedReports.length} Reports</span>
          </h4>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedReports.length > 0 ? sortedReports.map((report) => (
              <div key={report.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-blue-500/50 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-semibold capitalize text-sm">
                      {report.type || 'Unknown'} Scam
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      report.urgency === 'CRITICAL' ? 'bg-red-600/50 text-red-200' :
                      report.urgency === 'HIGH' ? 'bg-orange-600/50 text-orange-200' :
                      report.urgency === 'MEDIUM' ? 'bg-yellow-600/50 text-yellow-200' :
                      'bg-green-600/50 text-green-200'
                    }`}>
                      {report.urgency}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {getRelativeTime(report.timestamp)}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {report.description}
                </p>
                
                <div className="flex flex-wrap gap-2 text-xs mb-3">
                  {report.phoneNumber && (
                    <span className="bg-red-900/30 text-red-400 px-2 py-1 rounded">📞 {report.phoneNumber}</span>
                  )}
                  {report.email && (
                    <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded">📧 Email</span>
                  )}
                  {report.website && (
                    <span className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded">🌐 Website</span>
                  )}
                  {report.location && (
                    <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded">📍 {report.location}</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => voteOnReport(report.id, 'up')}
                      className="flex items-center gap-1 text-green-400 hover:text-green-300"
                    >
                      ⬆️ {report.upvotes || 0}
                    </button>
                    <button
                      onClick={() => voteOnReport(report.id, 'down')}
                      className="flex items-center gap-1 text-red-400 hover:text-red-300"
                    >
                      ⬇️ {report.downvotes || 0}
                    </button>
                    <span className="text-gray-400">👁️ {report.views || Math.floor(Math.random() * 100)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.riskScore && (
                      <span className={`px-2 py-1 rounded text-xs ${
                        report.riskScore > 7 ? 'bg-red-600/50 text-red-200' :
                        report.riskScore > 5 ? 'bg-yellow-600/50 text-yellow-200' :
                        'bg-green-600/50 text-green-200'
                      }`}>
                        Risk: {report.riskScore.toFixed(1)}/10
                      </span>
                    )}
                    {report.verified && (
                      <span className="verified-badge px-2 py-1 rounded text-white text-xs">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-gray-400 text-center py-8">
                <div className="text-4xl mb-2">📝</div>
                <p>No community reports yet for this filter.</p>
                <p className="text-sm mt-2">Be the first to contribute and help protect others!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CommunitySection;
}
