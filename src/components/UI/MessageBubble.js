const { useState } = React;

// Enhanced Message Bubble Component with Full Features
const MessageBubble = ({ message, isStreaming, onSpeak, isSpeaking, onReaction, onReport }) => {
  const [showActions, setShowActions] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const isUser = message.role === 'user';
  const time = message.timestamp?.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) || 'Now';

  const handleReaction = (reaction) => {
    setUserReaction(reaction);
    onReaction?.(message.id, reaction);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const reactions = ['👍', '👎', '❤️', '😮', '😂', '😢'];

  return (
    <div className="animate-fade-in">
      <div 
        className={`max-w-5xl p-6 rounded-2xl transition-all duration-300 message-bubble relative ${
          isUser
            ? 'ml-auto glass-panel border-blue-400/50'
            : 'mr-auto glass-elevated border-purple-400/50'
        } ${isStreaming ? 'animate-pulse-gentle' : ''}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Message Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold relative ${
              isUser
                ? 'bg-blue-600/30 border border-blue-400/60 text-blue-200'
                : 'bg-purple-600/30 border border-purple-400/60 text-purple-200'
            }`}>
              {isUser ? '👤' : '🤖'}
              {!isUser && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse-gentle" 
                     title="AI Online" />
              )}
            </div>
            <div>
              <div className={`font-bold text-lg flex items-center gap-2 ${isUser ? 'text-blue-200' : 'text-purple-200'}`}>
                {isUser ? 'Your Query' : 'VANTA AI Assistant'}
                {!isUser && <span className="badge-verified text-xs">VERIFIED</span>}
              </div>
              <div className="text-xs text-gray-400 font-mono flex items-center gap-2">
                <span>{time}</span>
                {isStreaming && (
                  <div className="flex items-center gap-1">
                    <span className="text-purple-400 animate-pulse-gentle">⚡ Analyzing</span>
                    <VoiceVisualizer isActive={true} />
                  </div>
                )}
                {message.confidence && (
                  <span className="text-cyan-400">
                    • {Math.round(message.confidence * 100)}% confidence
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {showActions && !isUser && message.content && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onSpeak?.(message.content)}
                className="p-2 rounded-lg glass-panel border border-purple-400/40 text-purple-300 hover:border-purple-400 transition-colors duration-300"
                title="Listen to response"
              >
                {isSpeaking ? '⏹️' : '🔊'}
              </button>
              <button
                onClick={() => copyToClipboard(message.content)}
                className="p-2 rounded-lg glass-panel border border-green-400/40 text-green-300 hover:border-green-400 transition-colors duration-300"
                title="Copy response"
              >
                📋
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg glass-panel border border-blue-400/40 text-blue-300 hover:border-blue-400 transition-colors duration-300"
                title="Expand details"
              >
                {isExpanded ? '📄' : '📋'}
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Risk Analysis for User Messages */}
        {isUser && message.analysis && message.analysis.riskScore > 0 && (
          <div className={`mb-4 p-4 rounded-lg border transition-all duration-300 ${
            message.analysis.riskLevel === 'CRITICAL' ? 'risk-critical border-red-400/60 animate-pulse-gentle' :
            message.analysis.riskLevel === 'HIGH' ? 'risk-high border-red-400/50' :
            message.analysis.riskLevel === 'MEDIUM' ? 'risk-medium border-yellow-400/50' :
            'risk-low border-green-400/50'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h5 className={`font-semibold flex items-center gap-2 ${
                message.analysis.riskLevel === 'CRITICAL' ? 'text-red-200' :
                message.analysis.riskLevel === 'HIGH' ? 'text-red-300' :
                message.analysis.riskLevel === 'MEDIUM' ? 'text-yellow-300' :
                'text-green-300'
              }`}>
                🔍 Advanced Risk Analysis
                <span className={`px-3 py-1 rounded text-xs font-bold ${
                  message.analysis.riskLevel === 'CRITICAL' ? 'bg-red-600/60 text-red-200 animate-pulse-gentle' :
                  message.analysis.riskLevel === 'HIGH' ? 'bg-red-600/50 text-red-200' :
                  message.analysis.riskLevel === 'MEDIUM' ? 'bg-yellow-600/50 text-yellow-200' :
                  'bg-green-600/50 text-green-200'
                }`}>
                  {message.analysis.riskLevel} RISK
                </span>
              </h5>
              <div className="text-xs text-gray-400">
                Confidence: {message.analysis.confidenceLevel}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-300 font-medium mb-2">Risk Assessment:</div>
                <div className="space-y-1">
                  <div>Score: <span className="font-bold text-white">{message.analysis.riskScore}/25</span></div>
                  <div>Patterns: <span className="text-orange-400">{message.analysis.totalMatches} detected</span></div>
                  <div>Level: <span className={
                    message.analysis.riskLevel === 'CRITICAL' ? 'text-red-400 font-bold' :
                    message.analysis.riskLevel === 'HIGH' ? 'text-red-400' :
                    message.analysis.riskLevel === 'MEDIUM' ? 'text-yellow-400' :
                    'text-green-400'
                  }>{message.analysis.riskLevel}</span></div>
                </div>
              </div>

              <div>
                <div className="text-gray-300 font-medium mb-2">Detected Patterns:</div>
                <div className="space-y-1">
                  {message.analysis.patterns?.slice(0, 3).map((pattern, index) => (
                    <div key={index} className="text-yellow-300 text-xs">
                      • <span className="font-semibold">{pattern.category.toUpperCase()}:</span> {pattern.matches?.slice(0, 2).join(', ')}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-gray-300 font-medium mb-2">🛡️ Immediate Recommendations:</div>
              <div className="space-y-1">
                {message.analysis.recommendations?.slice(0, 3).map((rec, index) => (
                  <div key={index} className="text-blue-300 text-xs">
                    {rec}
                  </div>
                ))}
              </div>
            </div>

            {message.analysis.preventiveActions && message.analysis.preventiveActions.length > 0 && (
              <div className="mt-3">
                <div className="text-gray-300 font-medium mb-2">🔒 Preventive Actions:</div>
                <div className="space-y-1">
                  {message.analysis.preventiveActions.map((action, index) => (
                    <div key={index} className="text-green-300 text-xs">
                      • {action}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Threat Report for User Messages */}
        {isUser && message.metadata?.threatReport && (
          <div className="mb-4 p-4 bg-purple-900/30 rounded-lg border border-purple-400/50">
            <div className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
              🎯 Threat Intelligence Report
              <span className="text-xs bg-purple-600/30 px-2 py-1 rounded">Live Data</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-gray-400">Threat Type:</span>
                <span className="text-purple-300 font-semibold ml-2 block">{message.metadata.threatReport.threatType}</span>
              </div>
              <div>
                <span className="text-gray-400">Region:</span>
                <span className="text-purple-300 font-semibold ml-2 block">{message.metadata.threatReport.region}</span>
              </div>
              <div>
                <span className="text-gray-400">Similar Reports:</span>
                <span className="text-purple-300 font-semibold ml-2 block">{message.metadata.threatReport.similarReports}</span>
              </div>
              <div>
                <span className="text-gray-400">Confidence:</span>
                <span className="text-purple-300 font-semibold ml-2 block">{Math.round(message.metadata.threatReport.confidence * 100)}%</span>
              </div>
            </div>

            {message.metadata.threatReport.tactics && (
              <div className="mt-3">
                <span className="text-gray-400 text-xs">Common Tactics:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {message.metadata.threatReport.tactics.map((tactic, index) => (
                    <span key={index} className="bg-purple-600/30 text-purple-200 px-2 py-1 rounded text-xs">
                      {tactic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Message Content */}
        <div className="text-gray-100 leading-relaxed">
          <div className="prose prose-invert max-w-none">
            <div className={`text-sm lg:text-base whitespace-pre-wrap font-sans ${
              isExpanded ? '' : 'line-clamp-6'
            }`}>
              {message.content}
              {isStreaming && <span className="streaming-cursor"></span>}
            </div>
            {!isExpanded && message.content?.length > 500 && (
              <button 
                onClick={() => setIsExpanded(true)}
                className="text-blue-400 hover:text-blue-300 text-sm mt-2"
              >
                Show more...
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Analysis Summary for AI Messages */}
        {!isUser && message.analysis && (
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div className="glass-panel p-3 rounded text-center">
                <div className="text-blue-400 font-semibold">{message.analysis.riskLevel}</div>
                <div className="text-gray-400">Risk Level</div>
              </div>
              <div className="glass-panel p-3 rounded text-center">
                <div className="text-green-400 font-semibold">{Math.round((message.analysis.confidence || 0.85) * 100)}%</div>
                <div className="text-gray-400">Confidence</div>
              </div>
              <div className="glass-panel p-3 rounded text-center">
                <div className="text-purple-400 font-semibold">{message.analysis.threatType || 'General'}</div>
                <div className="text-gray-400">Analysis Type</div>
              </div>
              <div className="glass-panel p-3 rounded text-center">
                <div className="text-cyan-400 font-semibold">{message.analysis.sources || '5'}</div>
                <div className="text-gray-400">Sources</div>
              </div>
              <div className="glass-panel p-3 rounded text-center">
                <div className="text-yellow-400 font-semibold">{message.analysis.processingTime || '2.1s'}</div>
                <div className="text-gray-400">Response Time</div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Interactive Actions */}
        <div className="mt-4 pt-4 border-t border-gray-600">
          {/* Reaction Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {reactions.map((reaction, index) => (
                <button
                  key={index}
                  onClick={() => handleReaction(reaction)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    userReaction === reaction
                      ? 'bg-blue-500/30 border border-blue-400 scale-110'
                      : 'glass-panel border border-gray-600 hover:border-blue-400 hover:scale-105'
                  }`}
                  title={`React with ${reaction}`}
                >
                  {reaction}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {!isUser && (
                <>
                  <button className="px-3 py-1 glass-panel border border-blue-400/40 text-blue-300 rounded text-xs hover:border-blue-400 transition-colors">
                    💬 Follow Up
                  </button>
                  <button className="px-3 py-1 glass-panel border border-green-400/40 text-green-300 rounded text-xs hover:border-green-400 transition-colors">
                    📤 Share
                  </button>
                </>
              )}
              <button 
                onClick={() => onReport?.(message.id)}
                className="px-3 py-1 glass-panel border border-red-400/40 text-red-300 rounded text-xs hover:border-red-400 transition-colors"
              >
                🚨 Report
              </button>
            </div>
          </div>

          {/* Message Metadata */}
          {isExpanded && (
            <div className="mt-4 p-3 glass-panel rounded-lg text-xs">
              <div className="text-gray-400 font-semibold mb-2">Message Details:</div>
              <div className="grid grid-cols-2 gap-2">
                <div>ID: <span className="text-gray-300 font-mono">{message.id?.slice(-8)}</span></div>
                <div>Size: <span className="text-gray-300">{message.content?.length} chars</span></div>
                <div>Type: <span className="text-gray-300">{isUser ? 'User Query' : 'AI Response'}</span></div>
                <div>Status: <span className="text-green-400">✓ Delivered</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MessageBubble;
}
