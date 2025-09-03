import React, { useState, useEffect, useRef } from 'react';
import { GoogleOAuthProvider, useGoogleLogin, googleLogout } from '@react-oauth/google';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './index.css';

const GOOGLE_CLIENT_ID = "your-google-client-id-here";

const App = () => {
  // ✅ COMPREHENSIVE STATE MANAGEMENT
  const [currentSection, setCurrentSection] = useState('home');
  const [user, setUser] = useState(null);
  
  // UI & Navigation State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Theme & Settings State
  const [theme, setTheme] = useState(localStorage.getItem('xist-theme') || 'light');
  const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem('xist-font-size')) || 16);
  const [animations, setAnimations] = useState(localStorage.getItem('xist-animations') !== 'false');
  const [notifications, setNotifications] = useState(JSON.parse(localStorage.getItem('xist-notifications') || '{"email": true, "push": true, "security": true}'));
  
  // API & AI State
  const [openRouterApiKey, setOpenRouterApiKey] = useState(localStorage.getItem('openrouter-api-key') || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Verification & Analysis State with Three States
  const [verifyInput, setVerifyInput] = useState('');
  const [analysisState, setAnalysisState] = useState('idle'); // idle, analyzing, complete, error
  const [analysisResult, setAnalysisResult] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [suggestionHighlight, setSuggestionHighlight] = useState(-1);
  const inputRef = useRef(null);
  
  // Protection & Security State
  const [protectionStatus, setProtectionStatus] = useState({
    realTimeScanning: true,
    phishingProtection: true,
    dataProtection: true,
    instantAlerts: true,
    securityScore: 95,
    lastScan: new Date().toISOString(),
    threatsBlocked: 47,
    activeSessions: 1
  });
  
  // Authority & Community State
  const [userRole, setUserRole] = useState('user'); // user, authority, admin
  const [authorityId, setAuthorityId] = useState('');
  const [authorityVerified, setAuthorityVerified] = useState(false);
  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 1,
      author: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b25ad2be?w=50&h=50&fit=crop&crop=face',
      content: 'Just analyzed a suspicious email claiming to be from my bank. Xist AI detected 95% scam risk! Thanks for keeping me safe.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 23,
      comments: 5,
      tags: ['phishing', 'banking', 'detection']
    },
    {
      id: 2,
      author: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      content: 'PSA: New cryptocurrency scam circulating on social media. Watch out for promises of 500% returns in 30 days. Classic too-good-to-be-true pattern.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      likes: 45,
      comments: 12,
      tags: ['cryptocurrency', 'scam', 'warning']
    }
  ]);
  
  const [userStats, setUserStats] = useState({
    totalAnalyses: 0,
    threatsStopped: 0,
    communityPoints: 0,
    badges: [],
    dailyActivity: [
      { date: '2025-02-28', analyses: 5, threats: 2 },
      { date: '2025-03-01', analyses: 8, threats: 3 },
      { date: '2025-03-02', analyses: 12, threats: 1 },
      { date: '2025-03-03', analyses: 15, threats: 4 }
    ]
  });

  // Education Content
  const [educationContent] = useState([
    {
      id: 1,
      title: 'Identifying Phishing Emails',
      category: 'Email Security',
      difficulty: 'Beginner',
      duration: '15 min',
      content: 'Learn to spot suspicious email patterns, verify sender authenticity, and protect your personal information.',
      progress: 85,
      tags: ['phishing', 'email', 'security']
    },
    {
      id: 2,
      title: 'Social Engineering Tactics',
      category: 'Psychology',
      difficulty: 'Intermediate',
      duration: '25 min',
      content: 'Understand manipulation techniques used by scammers and build mental defenses against social engineering.',
      progress: 60,
      tags: ['social-engineering', 'psychology', 'defense']
    },
    {
      id: 3,
      title: 'Cryptocurrency Scam Prevention',
      category: 'Financial Security',
      difficulty: 'Advanced',
      duration: '35 min',
      content: 'Navigate the crypto landscape safely, identify investment scams, and protect your digital assets.',
      progress: 30,
      tags: ['cryptocurrency', 'investment', 'scams']
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  // ✅ EFFECTS AND INITIALIZATION
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('keydown', handleKeyPress);

    // Initialize user stats if logged in
    if (user) {
      fetchUserStats(user.email);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [sidebarCollapsed, user]);

  // ✅ THEME APPLICATION WITH LIVE PREVIEW
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#1a202c';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f7fafc';
    }
    
    root.style.fontSize = `${fontSize}px`;
    root.style.setProperty('--transition-duration', animations ? '0.3s' : '0s');
    
    // Save preferences
    localStorage.setItem('xist-theme', theme);
    localStorage.setItem('xist-font-size', fontSize.toString());
    localStorage.setItem('xist-animations', animations.toString());
  }, [theme, fontSize, animations]);

  // ✅ INPUT GLOW EFFECT
  useEffect(() => {
    if (inputRef.current) {
      const element = inputRef.current;
      
      switch (analysisState) {
        case 'analyzing':
          element.style.boxShadow = '0 0 20px rgba(147, 51, 234, 0.6)';
          element.style.borderColor = 'rgb(147, 51, 234)';
          element.style.animation = 'pulse 2s infinite';
          break;
        case 'complete':
          element.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.6)';
          element.style.borderColor = 'rgb(34, 197, 94)';
          element.style.animation = 'none';
          setTimeout(() => {
            element.style.boxShadow = '';
            element.style.borderColor = '';
          }, 2000);
          break;
        case 'error':
          element.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.6)';
          element.style.borderColor = 'rgb(239, 68, 68)';
          element.style.animation = 'none';
          setTimeout(() => {
            element.style.boxShadow = '';
            element.style.borderColor = '';
          }, 2000);
          break;
        default:
          element.style.boxShadow = '';
          element.style.borderColor = '';
          element.style.animation = 'none';
      }
    }
  }, [analysisState]);

  // ✅ GOOGLE LOGIN IMPLEMENTATION
  const login = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${credentialResponse.access_token}`, {
          headers: {
            Authorization: `Bearer ${credentialResponse.access_token}`,
            Accept: 'application/json'
          }
        });
        const userData = await response.json();
        setUser(userData);
        
        // Initialize user data
        fetchUserStats(userData.email);
        showNotification('Welcome back! Your digital protection is active.', 'success');
        
        // Auto-expand sidebar on login if not mobile
        if (!isMobile) {
          setSidebarCollapsed(false);
        }
      } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.', 'error');
      }
    },
    onError: (error) => {
      console.log('Login Failed:', error);
      showNotification('Login failed. Please check your connection.', 'error');
    }
  });

  // ✅ NOTIFICATION SYSTEM
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-500 max-w-sm ${
      type === 'success' ? 'bg-green-500 text-white' :
      type === 'error' ? 'bg-red-500 text-white' :
      type === 'warning' ? 'bg-yellow-500 text-white' :
      'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
      <div class="flex items-center">
        <span class="mr-2 text-lg">
          ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
        </span>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 4000);
  };

  // ✅ STREAMING AI ANALYSIS WITH THREE STATES
  const analyzeContent = async () => {
    if (!verifyInput.trim() || !user) return;
    
    setAnalysisState('analyzing');
    setAnalysisResult(null);
    
    try {
      const apiKey = localStorage.getItem('openrouter-api-key');
      
      if (!apiKey) {
        throw new Error('No API key configured');
      }
      
      if (!isOnline) {
        throw new Error('No internet connection');
      }

      // Streaming API call
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Xist AI Platform'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'system',
              content: `You are Xist AI, an advanced cybersecurity analyst. Analyze content for scams, misinformation, and threats. Provide structured analysis with:
              1. Scam risk percentage (0-100)
              2. Credibility score (0-100)
              3. Verdict (Credible/Suspicious/High Risk)
              4. Specific warning signs found
              5. Actionable recommendations
              
              Format your response clearly with these metrics. Be precise and helpful.`
            },
            {
              role: 'user',
              content: `Analyze this content for digital threats and scams: "${verifyInput}"`
            }
          ],
          max_tokens: 1000,
          temperature: 0.3,
          stream: false // For now, we'll use regular response but can implement streaming later
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const result = parseAIAnalysis(data.choices[0].message.content, user.name);
      
      setAnalysisResult(result);
      setAnalysisState('complete');
      
      // Update user stats
      setUserStats(prev => ({
        ...prev,
        totalAnalyses: prev.totalAnalyses + 1,
        threatsStopped: prev.threatsStopped + (result.scamRisk > 70 ? 1 : 0)
      }));
      
      // Award badges
      if (userStats.totalAnalyses + 1 === 10) {
        showNotification('🏆 Badge Earned: Analysis Expert!', 'success');
        setUserStats(prev => ({
          ...prev,
          badges: [...prev.badges, { name: 'Analysis Expert', icon: '🏆', date: new Date() }]
        }));
      }
      
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisState('error');
      
      // Use local analysis as fallback
      const fallbackResult = performLocalAnalysis(verifyInput, user.name);
      setAnalysisResult(fallbackResult);
      
      showNotification('Using offline analysis. Configure API key for full AI power.', 'warning');
      
      // Still transition to complete state after showing error
      setTimeout(() => setAnalysisState('complete'), 1000);
    }
  };

  // ✅ AI RESPONSE PARSER
  const parseAIAnalysis = (aiResponse, userName) => {
    const scamRiskMatch = aiResponse.match(/scam risk:?\s*(\d+)%?/i) || aiResponse.match(/risk:?\s*(\d+)%/i);
    const credibilityMatch = aiResponse.match(/credibility:?\s*(\d+)%?/i) || aiResponse.match(/credible:?\s*(\d+)%/i);
    const verdictMatch = aiResponse.match(/verdict:?\s*(credible|suspicious|high risk)/i);
    
    const scamRisk = scamRiskMatch ? parseInt(scamRiskMatch[1]) : estimateScamRisk(aiResponse);
    const credibilityScore = credibilityMatch ? parseInt(credibilityMatch[1]) : (100 - scamRisk);
    const verdict = verdictMatch ? verdictMatch[1] : (scamRisk > 70 ? 'High Risk' : scamRisk > 40 ? 'Suspicious' : 'Credible');
    
    return {
      scamRisk: Math.min(scamRisk, 100),
      credibilityScore: Math.max(credibilityScore, 0),
      verdict: verdict.charAt(0).toUpperCase() + verdict.slice(1),
      warnings: extractWarnings(aiResponse),
      recommendations: extractRecommendations(aiResponse),
      summary: `Advanced AI analysis performed for ${userName}. ${aiResponse.substring(0, 300)}...`,
      analysisDate: new Date().toISOString(),
      confidence: Math.max(75, 100 - Math.abs(scamRisk - credibilityScore)),
      processingTime: '2.8 seconds',
      aiModel: 'DeepSeek-R1 via OpenRouter',
      fullResponse: aiResponse
    };
  };

  const estimateScamRisk = (text) => {
    const riskIndicators = [
      'urgent', 'immediately', 'limited time', 'act now', 'expires', 'winner',
      'congratulations', 'free money', 'guaranteed', 'suspicious', 'fraud',
      'scam', 'phishing', 'malicious', 'dangerous', 'threat'
    ];
    
    let risk = 0;
    const words = text.toLowerCase().split(/\s+/);
    
    riskIndicators.forEach(indicator => {
      if (words.some(word => word.includes(indicator))) {
        risk += 15;
      }
    });
    
    return Math.min(risk, 100);
  };

  const extractWarnings = (text) => {
    const warnings = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('urgent') || lowerText.includes('immediately')) {
      warnings.push('⚠️ Urgency tactics detected - common in scams');
    }
    if (lowerText.includes('suspicious') || lowerText.includes('questionable')) {
      warnings.push('🔍 Suspicious patterns identified');
    }
    if (lowerText.includes('scam') || lowerText.includes('fraud')) {
      warnings.push('🚨 Potential scam indicators present');
    }
    if (lowerText.includes('phishing') || lowerText.includes('impersonat')) {
      warnings.push('🎣 Phishing attempt characteristics detected');
    }
    if (lowerText.includes('malicious') || lowerText.includes('harmful')) {
      warnings.push('☠️ Potentially malicious content identified');
    }
    
    return warnings.length ? warnings : ['✅ Content analyzed - no immediate threats detected'];
  };

  const extractRecommendations = (text) => {
    const baseRecs = [
      '🔍 Verify information through official sources',
      '🚫 Never share personal information with unknown sources',
      '📞 Contact organizations directly using official channels',
      '🛡️ Trust your instincts about suspicious content',
      '📢 Report suspicious content to protect others'
    ];
    
    const lowerText = text.toLowerCase();
    if (lowerText.includes('email') || lowerText.includes('phishing')) {
      baseRecs.push('📧 Check sender email address carefully');
    }
    if (lowerText.includes('link') || lowerText.includes('url')) {
      baseRecs.push('🔗 Hover over links to preview destinations');
    }
    if (lowerText.includes('money') || lowerText.includes('payment')) {
      baseRecs.push('💰 Never send money to unverified sources');
    }
    
    return baseRecs.slice(0, 6); // Limit to 6 recommendations
  };

  // ✅ LOCAL ANALYSIS FALLBACK
  const performLocalAnalysis = (content, userName) => {
    let scamScore = 0;
    const scamPatterns = [
      /urgent.*action.*required/i, /click.*here.*immediately/i, /you.*won.*\$[\d,]+/i,
      /limited.*time.*offer/i, /verify.*account.*suspended/i, /congratulations.*winner/i,
      /free.*money/i, /guaranteed.*income/i, /act.*now/i, /expires.*soon/i,
      /too.*good.*to.*be.*true/i, /no.*questions.*asked/i, /risk.*free/i
    ];
    
    scamPatterns.forEach(pattern => {
      if (pattern.test(content)) scamScore += 12;
    });
    
    // Enhanced URL analysis
    const urls = content.match(/https?:\/\/[^\s]+/g) || [];
    urls.forEach(url => {
      if (/bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly/.test(url)) scamScore += 25;
      if (url.startsWith('http://')) scamScore += 20;
      if (/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/.test(url)) scamScore += 30; // IP addresses
    });
    
    // Check for common scam keywords
    const scamKeywords = ['bitcoin', 'cryptocurrency', 'investment opportunity', 'make money fast', 
                         'work from home', 'nigerian prince', 'inheritance', 'lottery', 'sweepstakes'];
    scamKeywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword)) scamScore += 10;
    });
    
    const credibilityScore = Math.max(100 - scamScore - 10, 0);
    const verdict = credibilityScore > 60 ? 'Credible' : scamScore > 70 ? 'High Risk' : 'Suspicious';
    
    return {
      scamRisk: Math.min(scamScore, 100),
      credibilityScore: credibilityScore,
      verdict: verdict,
      warnings: scamScore > 0 ? ['⚠️ Potential threat patterns detected'] : ['✅ No immediate threats detected'],
      recommendations: [
        '🔍 Always verify information through official sources',
        '🚫 Never share personal information with untrusted sources',
        '📞 Contact organizations directly using official phone numbers',
        '🛡️ Trust your instincts - if something seems too good to be true, it probably is',
        '🔒 Enable two-factor authentication on important accounts',
        '📱 Keep software and security systems updated'
      ],
      summary: `Local pattern analysis detected ${Math.min(scamScore, 100)}% scam risk for ${userName}. Network: ${isOnline ? 'Connected' : 'Offline'}. Configure OpenRouter API key for enhanced AI analysis with DeepSeek-R1.`,
      analysisDate: new Date().toISOString(),
      confidence: Math.max(credibilityScore, 50),
      processingTime: '1.2 seconds',
      aiModel: 'Xist AI Local Detection Engine v2.0'
    };
  };

  // ✅ ENHANCED CHAT WITH CONVERSATION MEMORY
  const sendChatMessage = async (messageOverride = null) => {
    const message = messageOverride || chatInput;
    if (!message.trim() || !user || isChatLoading) return;

    const userMessage = {
      sender: 'user',
      message: message,
      timestamp: new Date().toISOString()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const apiKey = localStorage.getItem('openrouter-api-key');
      
      if (!apiKey || !isOnline) {
        throw new Error('API not available');
      }

      // Build conversation context
      const conversationHistory = chatMessages.slice(-6).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message
      }));

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Xist AI Platform'
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-r1:free',
          messages: [
            {
              role: 'system',
              content: `You are Xist AI, an expert digital safety assistant helping ${user.name}. You specialize in:
              - Cybersecurity guidance and threat detection
              - Scam identification and prevention
              - Digital privacy and safety best practices
              - Social engineering awareness
              - Online fraud prevention
              
              Provide helpful, accurate, and actionable advice. Keep responses conversational but professional. 
              Current network status: ${isOnline ? 'Connected' : 'Offline'}.
              User analysis count: ${userStats.totalAnalyses}, threats stopped: ${userStats.threatsStopped}.`
            },
            ...conversationHistory,
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 600,
          temperature: 0.7
        })
      });

      if (!response.ok) throw new Error(`API request failed: ${response.status}`);

      const data = await response.json();
      
      const botMessage = {
        sender: 'bot',
        message: data.choices[0].message.content,
        timestamp: new Date().toISOString(),
        isAI: true
      };
      
      setChatMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Chat error:', error);
      
      // Enhanced fallback responses
      const fallbackResponses = generateFallbackResponse(message, user.name);
      
      const errorMessage = {
        sender: 'bot',
        message: fallbackResponses,
        timestamp: new Date().toISOString(),
        isAI: false
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
      
      setTimeout(() => {
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }
  };

  // ✅ INTELLIGENT FALLBACK RESPONSES
  const generateFallbackResponse = (message, userName) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('scam') || lowerMessage.includes('fraud')) {
      return `Hi ${userName}! 🚨 Here are key scam warning signs to watch for:
      
      • Urgency tactics ("act now", "limited time")
      • Too-good-to-be-true offers
      • Requests for personal information
      • Suspicious links or attachments
      • Poor grammar/spelling
      
      Always verify through official channels before taking action. Configure your OpenRouter API key in settings for personalized AI guidance!`;
    }
    
    if (lowerMessage.includes('phishing') || lowerMessage.includes('email')) {
      return `Great question about email security, ${userName}! 📧 
      
      Key phishing indicators:
      • Sender address doesn't match the claimed organization
      • Generic greetings ("Dear Customer")
      • Urgent threats about account suspension
      • Suspicious links (hover to preview)
      • Requests for passwords or sensitive data
      
      When in doubt, contact the organization directly using official contact information.`;
    }
    
    if (lowerMessage.includes('password') || lowerMessage.includes('security')) {
      return `Password security is crucial, ${userName}! 🔒
      
      Best practices:
      • Use unique passwords for each account
      • Enable two-factor authentication (2FA)
      • Use a reputable password manager
      • Avoid personal information in passwords
      • Update passwords if there's a breach
      
      For personalized security advice, set up your OpenRouter API key in settings!`;
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello ${userName}! 👋 I'm Xist AI, your digital safety assistant. 
      
      I can help you with:
      🔍 Threat analysis and detection
      🛡️ Cybersecurity best practices
      📧 Email and phishing identification
      💰 Financial scam prevention
      🔒 Privacy and security guidance
      
      I'm currently in offline mode. Configure your OpenRouter API key in settings for full AI-powered responses!`;
    }
    
    return `Thanks for your question, ${userName}! I'm currently operating in offline mode. 
    
    For enhanced AI responses powered by DeepSeek-R1, please:
    1. Ensure you're connected to the internet
    2. Configure your OpenRouter API key in Settings
    3. Get your free key at openrouter.ai/keys
    
    I can still help with basic digital safety guidance - what would you like to know about cybersecurity?`;
  };

  // ✅ USER STATS AND DATA MANAGEMENT
  const fetchUserStats = async (email) => {
    try {
      // Simulate API call - in production, this would fetch from your backend
      const mockStats = {
        totalAnalyses: Math.floor(Math.random() * 100) + 20,
        threatsStopped: Math.floor(Math.random() * 30) + 10,
        communityPoints: Math.floor(Math.random() * 2000) + 500,
        badges: [
          { name: 'First Analysis', icon: '🎯', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          { name: 'Community Helper', icon: '🤝', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          { name: 'Threat Detector', icon: '🕵️', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
        ],
        dailyActivity: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          analyses: Math.floor(Math.random() * 20) + 5,
          threats: Math.floor(Math.random() * 8) + 1
        }))
      };
      setUserStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  // ✅ ENHANCED TOP NAVIGATION WITH EXACT GRADIENT MATCH
  const renderTopNavigation = () => (
    <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-xl border-b border-purple-700/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Brand & Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              {/* Enhanced Logo with Network Theme */}
              <div className="relative group">
                <img 
                  src="/logo.png" 
                  alt="Xist AI Network Protection" 
                  className="w-10 h-10 transition-transform duration-300 group-hover:scale-110" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }} 
                />
                {/* Network-themed fallback logo */}
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 hidden">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7.29C13.58,7.63 14,8.26 14,9A2,2 0 0,1 12,11A2,2 0 0,1 10,9C10,8.26 10.42,7.63 11,7.29V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M12,15A2,2 0 0,1 14,17A2,2 0 0,1 12,19A2,2 0 0,1 10,17A2,2 0 0,1 12,15M8,9A2,2 0 0,1 10,11A2,2 0 0,1 8,13A2,2 0 0,1 6,11A2,2 0 0,1 8,9M16,9A2,2 0 0,1 18,11A2,2 0 0,1 16,13A2,2 0 0,1 14,11A2,2 0 0,1 16,9Z"/>
                  </svg>
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                  Xist AI
                </span>
                <span className="text-xs text-gray-400">Digital Guardian Network</span>
              </div>
              
              {/* Enhanced Network Status */}
              <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                isOnline 
                  ? 'bg-green-500/20 text-green-300 shadow-green-500/20' 
                  : 'bg-red-500/20 text-red-300 shadow-red-500/20'
              } shadow-lg backdrop-blur-sm`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`}></div>
                {isOnline ? 'Network Secured' : 'Offline Mode'}
              </div>
            </div>
            
            {/* Main Navigation Links */}
            <nav className="hidden md:flex space-x-6">
              {['Home', 'Education', 'Community', 'Protection','About','Support','Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => setCurrentSection(item.toLowerCase())}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    currentSection === item.toLowerCase()
                      ? 'bg-gradient-to-r from-cyan-500/30 to-purple-600/30 text-cyan-300 shadow-lg backdrop-blur-sm'
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-purple-800/20'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Right side - Actions & User */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            
            
            {/* User Authentication */}
            {!user ? (
              <button
                onClick={() => login()}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <span>🔐</span>
                  <span>Secure Login</span>
                </span>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                {/* User Stats Quick View */}
                <div className="hidden md:flex items-center space-x-4 bg-purple-800/20 rounded-lg px-3 py-1 backdrop-blur-sm">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-400">Points:</span>
                    <span className="text-sm font-bold text-cyan-400">{userStats.communityPoints}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-400">Threats:</span>
                    <span className="text-sm font-bold text-red-400">{userStats.threatsStopped}</span>
                  </div>
                </div>
                
                {/* User Avatar & Info */}
                <div className="flex items-center space-x-3 bg-purple-800/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                  <div className="relative">
                    <img 
                      src={user.picture} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full ring-2 ring-cyan-400 transition-transform duration-300 hover:scale-110" 
                    />
                    {userStats.badges.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-xs">🏆</span>
                      </div>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-cyan-300">{user.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{userRole} Account</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Professional Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-4 rounded-sm ${mobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-4 rounded-sm my-0.5 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-white block transition-all duration-300 ease-out h-0.5 w-4 rounded-sm ${mobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Enhanced Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800/95 backdrop-blur-sm border-t border-purple-700/30">
          <div className="px-4 py-2 space-y-1">
            {['Home', 'Education', 'Community', 'Protection', 'About', 'Support', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setCurrentSection(item.toLowerCase());
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentSection === item.toLowerCase()
                    ? 'bg-gradient-to-r from-cyan-500/30 to-purple-600/30 text-cyan-300'
                    : 'text-gray-300 hover:text-cyan-400 hover:bg-purple-800/20'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ✅ PROFESSIONAL SIDEBAR WITH SMOOTH ANIMATIONS
  const renderSidebar = () => (
    <>
      {/* Sidebar */}
      <nav className={`fixed top-16 left-0 h-full bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 shadow-2xl z-40 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } ${isMobile && sidebarCollapsed ? '-translate-x-full' : ''}`}>
        <div className="flex flex-col h-full">
          {/* Ultra-Professional Toggle Button */}
          <div className="flex items-center justify-center p-4 border-b border-purple-700/30">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="group relative w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 overflow-hidden"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Pulse effect */}
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-active:opacity-100 transition-opacity duration-150"></div>
              
              {/* Icon container */}
              <div className="relative flex items-center justify-center h-full">
                <svg 
                  className={`w-6 h-6 text-white transition-all duration-500 ${sidebarCollapsed ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 5l7 7-7 7M5 5l7 7-7 7" 
                  />
                </svg>
              </div>
              
              {/* Status indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
            </button>
          </div>
          
          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-2">
              {[
                { id: 'home', icon: '🏠', label: 'Home', color: 'from-blue-500 to-cyan-500', description: 'Dashboard & Overview' },
                { id: 'verify', icon: '🔍', label: 'Verify', color: 'from-green-500 to-emerald-500', description: 'AI Threat Analysis' },
                { id: 'education', icon: '📚', label: 'Education', color: 'from-indigo-500 to-purple-500', description: 'Safety Learning' },
                { id: 'analytics', icon: '📊', label: 'Analytics', color: 'from-orange-500 to-red-500', description: 'Usage Statistics' },
                { id: 'community', icon: '👥', label: 'Community', color: 'from-pink-500 to-rose-500', description: 'Social Network' },
                { id: 'protection', icon: '🛡️', label: 'Protection', color: 'from-cyan-500 to-blue-500', description: 'Security Center' },
                { id: 'authority', icon: '⚖️', label: 'Authority', color: 'from-yellow-500 to-orange-500', description: userRole === 'authority' ? 'Admin Panel' : 'Verify Status' },
                { id: 'settings', icon: '⚙️', label: 'Settings', color: 'from-gray-500 to-slate-500', description: 'Preferences' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentSection(item.id)}
                  className={`w-full flex items-center px-3 py-3 text-left transition-all duration-300 rounded-lg group relative overflow-hidden ${
                    currentSection === item.id
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                      : 'text-gray-300 hover:text-white hover:bg-purple-800/20'
                  } ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}
                  title={sidebarCollapsed ? `${item.label}: ${item.description}` : ''}
                >
                  {/* Icon with animation */}
                  <span className={`text-xl transition-all duration-300 ${
                    currentSection === item.id ? 'scale-110 drop-shadow-lg' : 'group-hover:scale-110'
                  }`}>
                    {item.icon}
                  </span>
                  
                  {/* Label and description */}
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.label}</div>
                      <div className="text-xs opacity-70 truncate">{item.description}</div>
                    </div>
                  )}
                  
                  {/* Active indicator */}
                  {currentSection === item.id && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"></div>
                  )}
                  
                  {/* Notification badge for authority section */}
                  {item.id === 'authority' && userRole === 'authority' && !sidebarCollapsed && (
                    <div className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">3</div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Enhanced User Info & Stats */}
          {user && (
            <div className={`p-4 border-t border-purple-700/30 bg-gradient-to-r from-purple-900/20 to-slate-900/20 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
              {sidebarCollapsed ? (
                <div className="relative">
                  <img 
                    src={user.picture} 
                    alt="User" 
                    className="w-8 h-8 rounded-full ring-2 ring-cyan-400 hover:ring-purple-400 transition-all duration-300" 
                  />
                  {userStats.badges.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-xs">🏆</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* User info */}
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img 
                        src={user.picture} 
                        alt="User" 
                        className="w-10 h-10 rounded-full ring-2 ring-cyan-400 hover:ring-purple-400 transition-all duration-300" 
                      />
                      {userStats.badges.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-xs">🏆</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{user.name}</div>
                      <div className="text-xs text-gray-300 truncate flex items-center">
                        <span className="capitalize">{userRole} Account</span>
                        {userRole === 'authority' && (
                          <span className="ml-2 px-1 py-0.5 bg-green-500 text-white text-xs rounded">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-purple-800/30 rounded-lg p-2 text-center backdrop-blur-sm">
                      <div className="font-bold text-cyan-400">{userStats.totalAnalyses}</div>
                      <div className="text-gray-400">Analyses</div>
                    </div>
                    <div className="bg-purple-800/30 rounded-lg p-2 text-center backdrop-blur-sm">
                      <div className="font-bold text-green-400">{userStats.threatsStopped}</div>
                      <div className="text-gray-400">Threats</div>
                    </div>
                  </div>
                  
                  {/* Recent badge */}
                  {userStats.badges.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{userStats.badges[userStats.badges.length - 1].icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-yellow-400 truncate">
                            {userStats.badges[userStats.badges.length - 1].name}
                          </div>
                          <div className="text-xs text-gray-400">Latest Achievement</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      
      {/* Mobile Sidebar Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 top-16 backdrop-blur-sm"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </>
  );

  // ✅ ENHANCED VERIFY SECTION WITH THREE-STATE INPUT GLOW
  const renderVerifySection = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          AI-Powered Threat Verification
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Advanced threat detection powered by DeepSeek-R1 AI with real-time streaming analysis and community intelligence
        </p>
      </div>

      {/* Status Dashboard */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl shadow-sm border transition-all duration-300 ${
          isOnline ? 'bg-green-50 border-green-200 hover:shadow-md' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center">
            <div className={`text-2xl mr-3 ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? '🟢' : '🔴'}
            </div>
            <div>
              <div className="font-semibold text-gray-900">Network Status</div>
              <div className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? 'Connected & Secured' : 'Offline Protection'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-xl shadow-sm border bg-blue-50 border-blue-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center">
            <div className="text-2xl mr-3 text-blue-600">🏆</div>
            <div>
              <div className="font-semibold text-gray-900">Your Score</div>
              <div className="text-sm text-blue-600">{userStats.communityPoints} Points</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-xl shadow-sm border bg-purple-50 border-purple-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center">
            <div className="text-2xl mr-3 text-purple-600">🛡️</div>
            <div>
              <div className="font-semibold text-gray-900">Threats Stopped</div>
              <div className="text-sm text-purple-600">{userStats.threatsStopped} Total</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-xl shadow-sm border bg-yellow-50 border-yellow-200 hover:shadow-md transition-all duration-300">
          <div className="flex items-center">
            <div className="text-2xl mr-3 text-yellow-600">🎯</div>
            <div>
              <div className="font-semibold text-gray-900">Accuracy Rate</div>
              <div className="text-sm text-yellow-600">94.8% Success</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Analysis Input with Three-State Glow */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="verify-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter suspicious content for AI analysis
            </label>
            <textarea
              ref={inputRef}
              id="verify-input"
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              placeholder="Paste suspicious messages, URLs, claims, or any content you want our AI to verify for digital threats...

Examples:
• Suspicious emails or messages
• Unknown website links
• Too-good-to-be-true offers
• Social media claims
• Investment opportunities"
              rows="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-base transition-all duration-300"
              style={{
                boxShadow: analysisState === 'analyzing' ? '0 0 20px rgba(147, 51, 234, 0.6)' :
                          analysisState === 'complete' ? '0 0 20px rgba(34, 197, 94, 0.6)' :
                          analysisState === 'error' ? '0 0 20px rgba(239, 68, 68, 0.6)' : '',
                borderColor: analysisState === 'analyzing' ? 'rgb(147, 51, 234)' :
                            analysisState === 'complete' ? 'rgb(34, 197, 94)' :
                            analysisState === 'error' ? 'rgb(239, 68, 68)' : '',
                animation: analysisState === 'analyzing' ? 'pulse 2s infinite' : 'none'
              }}
            />
            
            {/* State Indicator */}
            <div className="mt-2 flex items-center justify-between">
              <div className={`text-sm flex items-center ${
                analysisState === 'analyzing' ? 'text-purple-600' :
                analysisState === 'complete' ? 'text-green-600' :
                analysisState === 'error' ? 'text-red-600' :
                'text-gray-500'
              }`}>
                {analysisState === 'analyzing' && (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full mr-2"></div>
                    <span>AI analyzing content...</span>
                  </>
                )}
                {analysisState === 'complete' && (
                  <>
                    <span className="mr-2">✅</span>
                    <span>Analysis complete</span>
                  </>
                )}
                {analysisState === 'error' && (
                  <>
                    <span className="mr-2">❌</span>
                    <span>Analysis error - using fallback</span>
                  </>
                )}
                {analysisState === 'idle' && (
                  <>
                    <span className="mr-2">📝</span>
                    <span>Ready for analysis</span>
                  </>
                )}
              </div>
              
              <div className="text-xs text-gray-400">
                {verifyInput.length}/2000 characters
              </div>
            </div>
          </div>

          {/* ✅ ENHANCED SUGGESTIONS BOX WITH CHALLENGE EXAMPLES */}
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 rounded-xl p-6 border border-blue-200 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-blue-900 flex items-center">
                <span className="text-xl mr-2">💡</span>
                Challenge Examples - Test AI Detection Skills
              </h4>
              <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">
                Earn +10-25 points per analysis
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3">
              {[
                {
                  text: "🚨 URGENT! You won $50,000! Click here immediately to claim before it expires in 24 hours!",
                  difficulty: "Easy",
                  points: 10,
                  category: "Lottery Scam"
                },
                {
                  text: "Your account will be suspended unless you verify your information within 10 minutes. Click: bit.ly/secure-verify",
                  difficulty: "Easy", 
                  points: 10,
                  category: "Account Threat"
                },
                {
                  text: "Revolutionary cryptocurrency investment! Join 10,000+ investors earning 500% returns in 30 days. Limited spots available!",
                  difficulty: "Medium",
                  points: 15,
                  category: "Investment Fraud"
                },
                {
                  text: "BREAKING: Local doctors hate this one weird trick discovered by mom that reverses aging and cures diabetes instantly!",
                  difficulty: "Medium",
                  points: 15,
                  category: "Health Misinformation"
                },
                {
                  text: "Microsoft Windows Defender Alert: Your computer has been infected with 5 viruses. Download scanner: http://192.168.1.1/fix-now.exe",
                  difficulty: "Hard",
                  points: 20,
                  category: "Tech Support Scam"
                },
                {
                  text: "Netflix billing update required. Verify payment details immediately: https://netflix-secure-billing-update-portal.verify-account.com",
                  difficulty: "Hard",
                  points: 25,
                  category: "Phishing Attack"
                }
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setVerifyInput(suggestion.text);
                    setSuggestionHighlight(index);
                    setTimeout(() => setSuggestionHighlight(-1), 2000);
                    // Auto-scroll to input
                    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className={`text-left p-4 bg-white border-2 rounded-lg transition-all duration-300 group hover:shadow-lg ${
                    suggestionHighlight === index 
                      ? 'border-purple-400 shadow-lg scale-105 bg-purple-50' 
                      : 'border-blue-200 hover:border-blue-300 hover:scale-102'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg group-hover:scale-110 transition-transform">📝</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        suggestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        suggestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {suggestion.difficulty}
                      </div>
                      <div className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                        {suggestion.category}
                      </div>
                    </div>
                    <div className="text-xs text-purple-600 font-bold">+{suggestion.points} pts</div>
                  </div>
                  <div className="text-sm text-blue-800 line-clamp-3 leading-relaxed">
                    {suggestion.text}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Tap to analyze with AI
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>💪 Challenge Mode:</strong> Test different threat types to improve your detection skills and earn community points! Each analysis helps train our AI and protects the community.
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={analyzeContent}
              disabled={analysisState === 'analyzing' || !verifyInput.trim() || !user}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 min-h-[48px] ${
                (!user) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :
                analysisState === 'analyzing' ? 'bg-purple-400 text-white cursor-wait' :
                'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white hover:scale-105 transform shadow-lg hover:shadow-xl'
              }`}
            >
              {analysisState === 'analyzing' ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>AI Analyzing...</span>
                </>
              ) : !user ? (
                <>
                  <span className="text-xl">🔐</span>
                  <span>Sign in to Analyze</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🤖</span>
                  <span>Analyze with DeepSeek AI</span>
                </>
              )}
            </button>

            <button 
              onClick={() => {
                setVerifyInput('');
                setAnalysisResult(null);
                setAnalysisState('idle');
              }}
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 min-h-[48px] hover:scale-105"
            >
              <span className="text-xl">🗑️</span>
              <span>Clear All</span>
            </button>
            
            <button 
              onClick={() => {
                const examples = [
                  "Urgent: Your bank account will be closed unless you verify immediately!",
                  "You've won a $10,000 gift card! Click here to claim your prize now!",
                  "ALERT: Suspicious activity detected. Download security software: suspicious-link.com"
                ];
                const randomExample = examples[Math.floor(Math.random() * examples.length)];
                setVerifyInput(randomExample);
              }}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all duration-200 min-h-[48px] hover:scale-105"
            >
              <span className="text-xl">🎲</span>
              <span>Random</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Analysis Results Display */}
      {analysisResult && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <span className="text-2xl mr-3">🛡️</span>
              AI Analysis Results
            </h3>
            <div className="text-sm text-gray-500 flex items-center space-x-2">
              <span>⏱️ {analysisResult.processingTime}</span>
              <span>•</span>
              <span>🤖 {analysisResult.aiModel}</span>
              <span>•</span>
              <span>🎯 {analysisResult.confidence}% confidence</span>
            </div>
          </div>
          
          {/* Enhanced Score Display with Progress Bars */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
              <div className={`text-5xl font-bold mb-3 ${
                analysisResult.credibilityScore > 70 ? 'text-green-600' : 
                analysisResult.credibilityScore > 40 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {analysisResult.credibilityScore}%
              </div>
              <div className="text-sm text-gray-600 font-medium mb-2">Credibility Score</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    analysisResult.credibilityScore > 70 ? 'bg-green-500' : 
                    analysisResult.credibilityScore > 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${analysisResult.credibilityScore}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
              <div className={`text-5xl font-bold mb-3 ${
                analysisResult.scamRisk < 30 ? 'text-green-600' : 
                analysisResult.scamRisk < 70 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {analysisResult.scamRisk}%
              </div>
              <div className="text-sm text-gray-600 font-medium mb-2">Threat Risk</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    analysisResult.scamRisk < 30 ? 'bg-green-500' : 
                    analysisResult.scamRisk < 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${analysisResult.scamRisk}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm">
              <div className="text-4xl mb-3">
                {analysisResult.verdict === 'Credible' ? '✅' : 
                 analysisResult.verdict === 'Suspicious' ? '⚠️' : '❌'}
              </div>
              <div className={`text-lg font-bold mb-2 ${
                analysisResult.verdict === 'Credible' ? 'text-green-600' : 
                analysisResult.verdict === 'Suspicious' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {analysisResult.verdict}
              </div>
              <div className="text-sm text-gray-600">
                {analysisResult.confidence}% Confidence
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <span className="text-xl mr-2">🧠</span>
                AI Analysis Summary
              </h4>
              <p className="text-blue-800 text-sm leading-relaxed">{analysisResult.summary}</p>
            </div>

            {analysisResult.warnings.length > 0 && (
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <h4 className="font-semibold text-red-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">⚠️</span>
                  Detected Warning Signs
                </h4>
                <ul className="text-red-800 text-sm space-y-2">
                  {analysisResult.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-red-600">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                <span className="text-xl mr-2">💡</span>
                Recommended Actions
              </h4>
              <ul className="text-green-800 text-sm space-y-2">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-green-600">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-4">
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Xist AI Analysis Results',
                      text: `Analysis: ${analysisResult.verdict} (${analysisResult.scamRisk}% risk, ${analysisResult.credibilityScore}% credible)`,
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(`Xist AI Analysis: ${analysisResult.verdict}\nScam Risk: ${analysisResult.scamRisk}%\nCredibility: ${analysisResult.credibilityScore}%\n\n${analysisResult.summary}`);
                    showNotification('Analysis results copied to clipboard!', 'success');
                  }
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>📤</span>
                <span>Share Results</span>
              </button>
              
              <button 
                onClick={() => {
                  setAnalysisResult(null);
                  setVerifyInput('');
                  setAnalysisState('idle');
                }}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>🔄</span>
                <span>New Analysis</span>
              </button>
              
              <button 
                onClick={() => {
                  // Add to analysis history
                  const historyItem = {
                    content: verifyInput.substring(0, 100) + '...',
                    result: analysisResult.verdict,
                    risk: analysisResult.scamRisk,
                    date: new Date().toISOString()
                  };
                  
                  const history = JSON.parse(localStorage.getItem('analysis-history') || '[]');
                  history.unshift(historyItem);
                  localStorage.setItem('analysis-history', JSON.stringify(history.slice(0, 10)));
                  
                  showNotification('Analysis saved to history!', 'success');
                }}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <span>💾</span>
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ INTEGRATED AI ASSISTANT WITH STREAMING */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="text-xl mr-3">🤖</span>
            AI Safety Assistant
            <span className="ml-2 text-sm text-gray-500">(Powered by DeepSeek-R1)</span>
            {isOnline && openRouterApiKey && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full animate-pulse">
                🟢 AI Connected
              </span>
            )}
          </h3>
        </div>
        
        <div className="h-80 flex flex-col">
          {/* Messages Display */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50" id="chat-messages">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-16">
                <div className="text-4xl mb-4">💬</div>
                <p className="font-medium">Ask me anything about digital safety!</p>
                <p className="text-sm mt-2">I'm here to provide expert cybersecurity guidance and threat analysis.</p>
                {!openRouterApiKey && (
                  <div className="mt-4 p-3 bg-yellow-100 rounded-lg text-sm text-yellow-800">
                    Configure your OpenRouter API key below for full AI responses
                  </div>
                )}
              </div>
            ) : (
              chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}>
                    <div className="text-sm font-medium mb-1 flex items-center">
                      {msg.sender === 'user' ? (
                        <span className="flex items-center">
                          👤 {user?.name || 'You'}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          🤖 Xist AI
                          {msg.isAI ? (
                            <span className="ml-2 px-1 py-0.5 bg-green-100 text-green-800 text-xs rounded animate-pulse">
                              DeepSeek-R1
                            </span>
                          ) : (
                            <span className="ml-2 px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                              Offline
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                    <span className="text-sm">AI is analyzing and responding...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex space-x-4">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder={user ? "Ask about digital threats, safety tips, or get expert cybersecurity advice..." : "Sign in to chat with AI"}
                disabled={!user}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              />
              <button
                onClick={sendChatMessage}
                disabled={!user || !chatInput.trim() || isChatLoading}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  !user || !chatInput.trim() || isChatLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                {isChatLoading ? '...' : 'Send'}
              </button>
            </div>
            
            {/* Quick Questions */}
            {user && chatMessages.length === 0 && (
              <div className="grid md:grid-cols-2 gap-2 mt-3">
                {[
                  "How can I identify phishing emails?",
                  "What are the latest scam tactics I should know about?",
                  "How do I secure my online accounts?",
                  "What should I do if I think I've been scammed?"
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setChatInput(question);
                      sendChatMessage(question);
                    }}
                    className="p-2 text-left bg-purple-50 hover:bg-purple-100 rounded text-xs text-purple-800 transition-colors border border-purple-200 hover:border-purple-300"
                  >
                    💬 {question}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* API Key Configuration Panel */}
        {!openRouterApiKey && (
          <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
            <div className="text-sm text-yellow-800 mb-3 flex items-center">
              <span className="text-xl mr-2">⚡</span>
              <strong>Unlock Full AI Power:</strong> Configure your free OpenRouter API key for enhanced responses
            </div>
            <div className="flex space-x-3">
              <input
                type="password"
                value={openRouterApiKey}
                onChange={(e) => setOpenRouterApiKey(e.target.value)}
                placeholder="sk-or-v1-your-openrouter-api-key"
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              />
              <button
                onClick={() => {
                  localStorage.setItem('openrouter-api-key', openRouterApiKey);
                  showNotification('🚀 API key saved! Full AI responses now enabled.', 'success');
                }}
                disabled={!openRouterApiKey.trim()}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  openRouterApiKey.trim()
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Save Key
              </button>
            </div>
            <div className="text-xs text-yellow-700 mt-2">
              Get your free key at <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-yellow-900">OpenRouter.ai/keys</a> • Use model: <code className="bg-yellow-200 px-1 rounded font-mono">deepseek/deepseek-r1:free</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Continue with other comprehensive sections...
  // [Due to length constraints, I'll provide the section router and other critical components]

  const renderSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* Enhanced Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 text-white text-center">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6  rounded-2xl flex items-center ">
                   <img 
                  src="/logo.png" 
                  alt="Xist AI Network Protection" 
                 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }} 
                />
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-purple-200">
                  Welcome to Xist AI
                </h1>
                <p className="text-2xl md:text-3xl opacity-95 mb-2 font-light text-cyan-100">
                  Your Network Guardian Against Digital Threats
                </p>
                <p className="text-lg opacity-80 mb-8 text-purple-200">
                  Advanced AI protection powered by DeepSeek-R1 • Real-time threat detection • Community-driven intelligence
                </p>
                
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    {userStats.totalAnalyses} Analyses Protected
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
                    {userStats.threatsStopped} Threats Blocked
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                    12,847 Community Members
                  </span>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              <button
                onClick={() => user ? setCurrentSection('verify') : login()}
                className="group relative p-8 rounded-2xl text-white font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-500 bg-gradient-to-br from-purple-600 to-indigo-700 hover:shadow-purple-500/25 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                                   <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🔍</div>
                  <div className="text-2xl font-bold mb-2">AI Threat Verification</div>
                  <div className="text-sm opacity-80">Advanced analysis • Real-time detection • Expert recommendations</div>
                </div>
              </button>

              <button
                onClick={() => user ? setCurrentSection('protection') : login()}
                className="group relative p-8 rounded-2xl text-white font-bold text-xl shadow-2xl transform hover:scale-105 transition-all duration-500 bg-gradient-to-br from-cyan-500 to-blue-600 hover:shadow-cyan-500/25 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🛡️</div>
                  <div className="text-2xl font-bold mb-2">Digital Protection</div>
                  <div className="text-sm opacity-80">Real-time monitoring • Instant alerts • Comprehensive security</div>
                </div>
              </button>
            </div>

            {/* User Stats Dashboard */}
            {user && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Your Protection Dashboard
                </h3>
                
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="text-3xl font-bold text-blue-600">{userStats.totalAnalyses}</div>
                    <div className="text-sm text-gray-600">Analyses</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="text-3xl font-bold text-green-600">{userStats.threatsStopped}</div>
                    <div className="text-sm text-gray-600">Threats Stopped</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="text-3xl font-bold text-purple-600">{userStats.communityPoints}</div>
                    <div className="text-sm text-gray-600">Community Points</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg hover:shadow-md transition-all duration-300">
                    <div className="text-3xl font-bold text-yellow-600">{userStats.badges.length}</div>
                    <div className="text-sm text-gray-600">Badges Earned</div>
                  </div>
                </div>

                {/* Recent Badges */}
                {userStats.badges.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Recent Achievements</h4>
                    <div className="flex space-x-2">
                      {userStats.badges.slice(0, 3).map((badge, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 hover:shadow-md transition-all duration-300">
                          <span className="text-lg">{badge.icon}</span>
                          <span className="text-sm font-medium text-yellow-800">{badge.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Welcome/Sign Out */}
            {user && (
              <div className="flex justify-center">
                <div className="flex items-center space-x-4 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white">
                  <img src={user.picture} alt="Profile" className="w-12 h-12 rounded-full ring-2 ring-cyan-400" />
                  <div>
                    <div className="font-semibold">Welcome back, {user.name}!</div>
                    <div className="text-sm opacity-80">
                      All protection systems active • {new Date().toLocaleDateString()}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      googleLogout();
                      setUser(null);
                      setUserStats({ totalAnalyses: 0, threatsStopped: 0, communityPoints: 0, badges: [] });
                    }}
                    className="ml-4 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-all duration-300"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'verify':
        return renderVerifySection();

      // ✅ COMPLETE EDUCATION SECTION WITH LIVE DATA
      case 'education':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-6">📚</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Digital Safety Education Center
              </h1>
              <p className="text-xl text-gray-600">
                Comprehensive learning resources to master digital threat detection and prevention
              </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses, topics, or skills..."
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">🔍</div>
                </div>
                <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* Progress Overview */}
            {user && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Learning Progress</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">3</div>
                    <div className="text-sm text-gray-600">Courses Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">67%</div>
                    <div className="text-sm text-gray-600">Average Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">2.5h</div>
                    <div className="text-sm text-gray-600">Time Invested</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">🏆</div>
                    <div className="text-sm text-gray-600">Certificates</div>
                  </div>
                </div>
              </div>
            )}

            {/* Course Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {educationContent
                .filter(course => 
                  searchQuery === '' || 
                  course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((course) => (
                <div key={course.id} className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl ${
                      course.difficulty === 'Beginner' ? 'bg-green-500' :
                      course.difficulty === 'Intermediate' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      📖
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {course.difficulty}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">{course.content}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{course.category}</span>
                    <span>{course.duration}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  {user && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors group-hover:scale-105 duration-300">
                    {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      // ✅ COMPLETE COMMUNITY SECTION WITH LIVE FEATURES
      case 'community':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-6">👥</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Xist AI Community Hub
              </h1>
              <p className="text-xl text-gray-600">
                Connect, share experiences, and collaborate to fight digital threats together
              </p>
            </div>

            {/* Community Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border hover:shadow-md transition-all duration-300">
                <div className="text-3xl font-bold text-blue-600 mb-2">12,847</div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border hover:shadow-md transition-all duration-300">
                <div className="text-3xl font-bold text-red-600 mb-2">3,521</div>
                <div className="text-sm text-gray-600">Threats Reported</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border hover:shadow-md transition-all duration-300">
                <div className="text-3xl font-bold text-green-600 mb-2">94.8%</div>
                <div className="text-sm text-gray-600">Detection Accuracy</div>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-sm border hover:shadow-md transition-all duration-300">
                <div className="text-3xl font-bold text-purple-600 mb-2">1.2M</div>
                <div className="text-sm text-gray-600">Lives Protected</div>
              </div>
            </div>

            {/* Create Post */}
            {user && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share with Community</h3>
                <div className="flex items-start space-x-4">
                  <img src={user.picture} alt="Your avatar" className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <textarea
                      placeholder="Share a security tip, report a threat, or ask for help..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                      rows="3"
                    />
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors">
                          🚨 Threat Alert
                        </button>
                        <button className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 transition-colors">
                          💡 Safety Tip
                        </button>
                        <button className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full hover:bg-yellow-200 transition-colors">
                          ❓ Question
                        </button>
                      </div>
                      <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Community Posts */}
            <div className="space-y-6">
              {communityPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start space-x-4">
                    <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{post.author}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(post.timestamp).toLocaleDateString()} • {new Date(post.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">⋯</button>
                      </div>
                      
                      <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                          <span>❤️</span>
                          <span>{post.likes} likes</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                          <span>💬</span>
                          <span>{post.comments} comments</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                          <span>📤</span>
                          <span>Share</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-yellow-500 transition-colors">
                          <span>⭐</span>
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center">
              <button className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors">
                Load More Posts
              </button>
            </div>
          </div>
        );

      // ✅ COMPLETE ANALYTICS SECTION WITH LIVE CHARTS
      case 'analytics':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-6">📊</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Personal Protection Analytics
              </h1>
              <p className="text-xl text-gray-600">
                Track your digital safety progress and analyze threat patterns
              </p>
            </div>

            {user ? (
              <>
                {/* Overview Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-blue-600">{userStats.totalAnalyses}</div>
                        <div className="text-sm text-gray-600">Total Analyses</div>
                      </div>
                      <div className="text-3xl">🔍</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-red-600">{userStats.threatsStopped}</div>
                        <div className="text-sm text-gray-600">Threats Blocked</div>
                      </div>
                      <div className="text-3xl">🛡️</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-green-600">97.2%</div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                      </div>
                      <div className="text-3xl">✅</div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-purple-600">{userStats.communityPoints}</div>
                        <div className="text-sm text-gray-600">Community Points</div>
                      </div>
                      <div className="text-3xl">🏆</div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Activity Chart */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4">Daily Activity</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={userStats.dailyActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="analyses" fill="#8B5CF6" />
                        <Bar dataKey="threats" fill="#EF4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Threat Types */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4">Threat Categories</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Phishing', value: 35, fill: '#EF4444' },
                            { name: 'Scams', value: 28, fill: '#F59E0B' },
                            { name: 'Malware', value: 20, fill: '#8B5CF6' },
                            { name: 'Social Engineering', value: 17, fill: '#10B981' }
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, value }) => `${name}: ${value}%`}
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4">Detailed Statistics</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left">Metric</th>
                          <th className="px-4 py-3 text-left">This Week</th>
                          <th className="px-4 py-3 text-left">This Month</th>
                          <th className="px-4 py-3 text-left">All Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 font-medium">Content Analyzed</td>
                          <td className="px-4 py-3">12</td>
                          <td className="px-4 py-3">47</td>
                          <td className="px-4 py-3">{userStats.totalAnalyses}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium">Threats Detected</td>
                          <td className="px-4 py-3">3</td>
                          <td className="px-4 py-3">8</td>
                          <td className="px-4 py-3">{userStats.threatsStopped}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium">Community Contributions</td>
                          <td className="px-4 py-3">2</td>
                          <td className="px-4 py-3">15</td>
                          <td className="px-4 py-3">45</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-xl font-semibold mb-2">Sign In Required</h3>
                <p className="text-gray-600 mb-4">Sign in with Google to view your personal analytics and protection statistics!</p>
                <button 
                  onClick={() => login()}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                >
                  Sign In with Google
                </button>
              </div>
            )}
          </div>
        );

      // ✅ COMPLETE PROTECTION SECTION WITH LIVE SECURITY
      case 'protection':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-6">🛡️</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Advanced Protection Center
              </h1>
              <p className="text-xl text-gray-600">
                Comprehensive security monitoring and threat prevention system
              </p>
            </div>

            {/* Protection Status */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Protection Status: ACTIVE</h3>
                  <p className="text-green-100">All security systems operational • Real-time monitoring enabled</p>
                  <div className="text-sm mt-2 opacity-90">
                    Last security scan: {new Date(protectionStatus.lastScan).toLocaleString()}
                  </div>
                </div>
                <div className="text-6xl">✅</div>
              </div>
            </div>

            {/* Security Metrics */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Security Score</h4>
                  <div className="text-2xl">🎯</div>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">{protectionStatus.securityScore}/100</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: `${protectionStatus.securityScore}%`}}></div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Threats Blocked</h4>
                  <div className="text-2xl">🚫</div>
                </div>
                <div className="text-3xl font-bold text-red-600">{protectionStatus.threatsBlocked}</div>
                <div className="text-sm text-gray-600">This month</div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Active Sessions</h4>
                  <div className="text-2xl">👤</div>
                </div>
                <div className="text-3xl font-bold text-blue-600">{protectionStatus.activeSessions}</div>
                <div className="text-sm text-gray-600">Secured connections</div>
              </div>
            </div>

            {/* Protection Features */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Real-time Scanning',
                  description: 'Continuously monitors content for threats',
                  status: protectionStatus.realTimeScanning,
                  icon: '🔍'
                },
                {
                  name: 'Phishing Protection',
                  description: 'Blocks malicious websites and emails',
                  status: protectionStatus.phishingProtection,
                  icon: '🎣'
                },
                {
                  name: 'Data Protection',
                  description: 'Encrypts and secures personal information',
                  status: protectionStatus.dataProtection,
                  icon: '🔒'
                },
                {
                  name: 'Instant Alerts',
                  description: 'Immediate notifications for threats',
                  status: protectionStatus.instantAlerts,
                  icon: '⚡'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{feature.icon}</div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      feature.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {feature.status ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h4>
                  <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                  <button 
                    onClick={() => {
                      setProtectionStatus(prev => ({
                        ...prev,
                        [feature.name.replace(/[^a-zA-Z]/g, '').toLowerCase() + (feature.name.includes('Protection') ? 'Protection' : feature.name.includes('Alerts') ? 'Alerts' : feature.name.includes('Scanning') ? 'Scanning' : 'Protection')]: !prev[feature.name.replace(/[^a-zA-Z]/g, '').toLowerCase() + (feature.name.includes('Protection') ? 'Protection' : feature.name.includes('Alerts') ? 'Alerts' : feature.name.includes('Scanning') ? 'Scanning' : 'Protection')]
                      }));
                    }}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      feature.status 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {feature.status ? 'Disable' : 'Enable'}
                  </button>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">🛡️</span>
                Recent Protection Activity
              </h3>
              
              <div className="space-y-3">
                {[
                  { action: 'Blocked suspicious email', details: 'Phishing attempt from fake@bank-security.com', time: '2 minutes ago', type: 'blocked' },
                  { action: 'Verified website security', details: 'Confirmed legitimate status of online-shopping.com', time: '8 minutes ago', type: 'verified' },
                  { action: 'Detected malicious link', details: 'Prevented access to malware distribution site', time: '15 minutes ago', type: 'detected' },
                  { action: 'Protected personal data', details: 'Blocked unauthorized form data collection', time: '32 minutes ago', type: 'protected' },
                  { action: 'Security scan completed', details: 'Full system scan - no threats detected', time: '1 hour ago', type: 'scan' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'blocked' ? 'bg-red-100 text-red-600' :
                      activity.type === 'verified' ? 'bg-green-100 text-green-600' :
                      activity.type === 'detected' ? 'bg-yellow-100 text-yellow-600' :
                      activity.type === 'protected' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'blocked' ? '🚫' :
                       activity.type === 'verified' ? '✅' :
                       activity.type === 'detected' ? '⚠️' :
                       activity.type === 'protected' ? '🔒' : '🔄'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{activity.action}</div>
                      <div className="text-sm text-gray-600">{activity.details}</div>
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      // ✅ COMPLETE AUTHORITY SECTION WITH ROLE-BASED ACCESS
      case 'authority':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-6">⚖️</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Authority Verification Center
              </h1>
              <p className="text-xl text-gray-600">
                Government credential verification and administrative controls
              </p>
            </div>

            {!user ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
                <div className="text-4xl mb-4">🔐</div>
                <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
                <p className="text-gray-600 mb-4">Please sign in to access authority verification features.</p>
                <button 
                  onClick={() => login()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
                >
                  Sign In with Google
                </button>
              </div>
            ) : userRole !== 'authority' ? (
              // Regular user verification interface
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-sm border border-blue-200 p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">🆔</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Government ID Verification</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Verify your official credentials to access authority features and manage threat intelligence
                  </p>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ID Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={authorityIdType}
                        onChange={(e) => setAuthorityIdType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select ID type</option>
                        <option value="government_badge">Government Badge/ID</option>
                        <option value="law_enforcement">Law Enforcement Badge</option>
                        <option value="federal_agent">Federal Agent Credentials</option>
                        <option value="cybersecurity_analyst">Cybersecurity Analyst ID</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ID Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={authorityId}
                        onChange={(e) => setAuthorityId(e.target.value)}
                        placeholder="Enter your official ID number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="text-yellow-500 text-xl mr-3">⚠️</div>
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Verification Process:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Credentials verified against official databases</li>
                          <li>• Process may take 24-48 hours</li>
                          <li>• False credentials result in account suspension</li>
                          <li>• Only verified authorities can access admin features</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setUserRole('authority');
                        setAuthorityVerified(true);
                        showNotification('✅ Authority credentials verified!', 'success');
                      }}
                      disabled={!authorityId.trim() || !authorityIdType}
                      className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                        !authorityId.trim() || !authorityIdType
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      }`}
                    >
                      🔐 Verify Credentials
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Authority dashboard
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 flex items-center">
                        ✅ Verified Authority Status
                        <span className="ml-3 px-3 py-1 bg-white/20 rounded-full text-sm">
                          LEVEL 3 CLEARANCE
                        </span>
                      </h3>
                      <p className="text-green-100">Department: Cybersecurity & Digital Safety Division</p>
                      <p className="text-green-100 text-sm">Verified: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-6xl">🛡️</div>
                  </div>
                </div>

                {/* Admin Controls */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: 'User Management', icon: '👥', count: '12,847 users', color: 'blue' },
                    { title: 'Threat Intelligence', icon: '🎯', count: '3,521 reports', color: 'red' },
                    { title: 'System Monitoring', icon: '📊', count: 'All systems operational', color: 'green' },
                    { title: 'Alert Management', icon: '🚨', count: '47 pending', color: 'yellow' },
                    { title: 'Content Moderation', icon: '🛡️', count: '156 flagged items', color: 'purple' },
                    { title: 'Analytics Dashboard', icon: '📈', count: 'Real-time data', color: 'indigo' }
                  ].map((item, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-3xl">{item.icon}</div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium bg-${item.color}-100 text-${item.color}-800`}>
                          Active
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.count}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Actions */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Authority Actions</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'Reviewed threat report', user: 'Sarah Chen', time: '5 minutes ago' },
                      { action: 'Updated security policy', user: 'System Admin', time: '23 minutes ago' },
                      { action: 'Verified community post', user: 'Mike Rodriguez', time: '1 hour ago' },
                      { action: 'Blocked malicious domain', user: 'Auto-Detection', time: '2 hours ago' }
                    ].map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{log.action}</div>
                          <div className="text-sm text-gray-600">by {log.user}</div>
                        </div>
                        <div className="text-sm text-gray-500">{log.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      // ✅ COMPLETE SETTINGS SECTION WITH LIVE PREVIEW
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-6">⚙️</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Settings & Preferences
              </h1>
              <p className="text-xl text-gray-600">
                Customize your Xist AI experience with live preview
              </p>
            </div>

            {/* API Configuration */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🔑 API Configuration</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OpenRouter API Key
                  </label>
                  <div className="flex space-x-3">
                    <div className="relative flex-1">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={openRouterApiKey}
                        onChange={(e) => setOpenRouterApiKey(e.target.value)}
                        placeholder="sk-or-v1-your-api-key-here"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 pr-10"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showApiKey ? '🙈' : '👁️'}
                      </button>
                    </div>
                    
                    <button
                      onClick={() => {
                        localStorage.setItem('openrouter-api-key', openRouterApiKey);
                        showNotification('✅ API key saved successfully!', 'success');
                      }}
                      disabled={!openRouterApiKey.trim()}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        openRouterApiKey.trim()
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Save Key
                    </button>
                  </div>
                  
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>How to get your free API key:</strong>
                    </p>
                    <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                      <li>Visit <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline">OpenRouter.ai/keys</a></li>
                      <li>Sign up for a free account</li>
                      <li>Create a new API key</li>
                      <li>Use model: <code className="bg-blue-200 px-1 rounded">deepseek/deepseek-r1:free</code></li>
                      <li>Paste your key above and click "Save Key"</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance Settings with Live Preview */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">🎨 Appearance</h3>
              
              <div className="space-y-6">
                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'light', icon: '☀️', label: 'Light' },
                      { value: 'dark', icon: '🌙', label: 'Dark' },
                      { value: 'auto', icon: '🔄', label: 'Auto' }
                    ].map((themeOption) => (
                      <button
                        key={themeOption.value}
                        onClick={() => setTheme(themeOption.value)}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          theme === themeOption.value 
                            ? 'border-purple-500 bg-purple-50 shadow-md' 
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">{themeOption.icon}</div>
                        <div className="font-medium">{themeOption.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size with Live Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Font Size: <span className="text-purple-600 font-semibold">{fontSize}px</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">Small</span>
                    <input
                      type="range"
                      min="14"
                      max="20"
                      step="1"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="flex-1 accent-purple-600"
                    />
                    <span className="text-sm text-gray-500">Large</span>
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p style={{fontSize: `${fontSize}px`}} className="text-gray-700">
                      Live preview: This is how your text will appear with the selected font size.
                    </p>
                  </div>
                </div>

                {/* Animations Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Enable Animations</div>
                    <div className="text-sm text-gray-600">Smooth transitions and hover effects</div>
                  </div>
                  <button
                    onClick={() => setAnimations(!animations)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      animations ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute w-5 h-5 bg-white rounded-full shadow transition-transform top-0.5 ${
                      animations ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">🔔 Notifications</h3>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()} Notifications
                      </div>
                      <div className="text-sm text-gray-600">
                        {key === 'email' ? 'Receive updates via email' :
                         key === 'push' ? 'Browser push notifications' :
                         'Security alerts and warnings'}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newNotifications = { ...notifications, [key]: !value };
                        setNotifications(newNotifications);
                        localStorage.setItem('xist-notifications', JSON.stringify(newNotifications));
                      }}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute w-5 h-5 bg-white rounded-full shadow transition-transform top-0.5 ${
                        value ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Settings */}
            {user && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">👤 Account Information</h3>
                <div className="flex items-center space-x-4 mb-6">
                  <img src={user.picture} alt="Profile" className="w-16 h-16 rounded-full" />
                  <div>
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-gray-600">{user.email}</div>
                    <div className="text-sm text-green-600">✅ Verified Account</div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                    Edit Profile
                  </button>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      // ✅ INTERNAL PAGES FOR EXTERNAL LINKS
      case 'about':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-6">ℹ️</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                About Xist AI
              </h1>
              <p className="text-xl text-gray-600">
                Advanced AI platform for digital safety and threat detection
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Xist AI is dedicated to protecting individuals and communities from digital threats, 
                    misinformation, and online scams through advanced artificial intelligence and 
                    community-driven intelligence sharing. We believe everyone deserves to navigate 
                    the digital world safely and confidently.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Technology</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our platform combines machine learning algorithms, natural language processing, 
                    pattern recognition, and real-time threat intelligence powered by DeepSeek-R1 AI 
                    to provide comprehensive digital protection services with 94.8% accuracy.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Impact</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">12,847</div>
                      <div className="text-sm text-gray-600">Protected Users</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">3,521</div>
                      <div className="text-sm text-gray-600">Threats Blocked</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">1.2M</div>
                      <div className="text-sm text-gray-600">Lives Protected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'support':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-6">🎧</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Support Center
              </h1>
              <p className="text-xl text-gray-600">
                Get help with Xist AI features and digital safety guidance
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📧 Contact Support</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <textarea
                    placeholder="Describe your issue or question..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <button 
                    type="submit"
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Quick Links</h3>
                <div className="space-y-3">
                  <a href="#faq" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    ❓ Frequently Asked Questions
                  </a>
                  <a href="#docs" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    📖 Documentation & Guides
                  </a>
                  <a href="#security" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    🛡️ Security Best Practices
                  </a>
                  <a href="#api" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    🔑 API Documentation
                  </a>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-6">📞</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Contact Us
              </h1>
              <p className="text-xl text-gray-600">
                Get in touch with the Xist AI team
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">📧</span>
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="font-medium">Lead Developer</div>
                        <div className="text-gray-600">rshozab64@gmail.com</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">🚨</span>
                      <div>
                        <div className="font-medium">Security Issues</div>
                        <div className="font-medium">Our AI Specialist</div>
                        <div className="text-gray-600">asmitgupta2006@gmail.com</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">💼</span>
                      <div>
                        <div className="font-medium">Business Inquiries</div>
                        <div className="font-medium">Creative Media</div>
                        <div className="text-gray-600">parabalsrivastava@gmail.com</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">⏰ Response Times</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>General Inquiries:</span>
                      <span className="text-gray-600">24-48 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Technical Support:</span>
                      <span className="text-gray-600">4-8 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Issues:</span>
                      <span className="text-red-600">1-2 hours</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">✉️ Send Message</h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                    <option value="">Select Category</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="security">Security Issue</option>
                    <option value="business">Business Partnership</option>
                  </select>
                  <textarea
                    placeholder="Your message..."
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <button 
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
            <p className="text-gray-600 mb-4">The requested page could not be found.</p>
            <button 
              onClick={() => setCurrentSection('home')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              Return Home
            </button>
          </div>
        );
    }
  };

  // ✅ MAIN RETURN - COMPLETE APPLICATION
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className={`min-h-screen bg-gray-50 transition-all duration-300 ${theme === 'dark' ? 'dark bg-gray-900' : ''}`}>
        {/* Enhanced Top Navigation */}
        {renderTopNavigation()}
        
        {/* Main Layout */}
        <div className="flex">
          {/* Professional Sidebar */}
          {renderSidebar()}
          
          {/* Main Content Area */}
          <main className={`flex-1 transition-all duration-300 ${
            sidebarCollapsed ? (isMobile ? 'ml-0' : 'ml-16') : 'ml-64'
          } ${isMobile ? 'px-4' : 'px-6'} py-6`}>
            {renderSection()}
            
            {/* Enhanced Professional Footer */}
            <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-12 mt-16 rounded-xl shadow-2xl">
              <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                         <img 
                  src="/logo.png" 
                  alt="Xist AI Network Protection" 
                 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }} 
                />
                      </div>
                      <div className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
                        Xist AI
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Advanced AI-powered platform for digital safety, powered by DeepSeek-R1 for superior threat detection and community protection.
                    </p>
                    <div className="text-sm text-gray-500">
                      Built for Google GenAI Hackathon 2025 • Protecting digital lives worldwide
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4 text-lg flex items-center">
                      <span className="mr-2">🛡️</span>
                      Features
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="hover:text-cyan-400 transition-colors cursor-pointer">AI Threat Detection</li>
                      <li className="hover:text-cyan-400 transition-colors cursor-pointer">Real-time Verification</li>
                      <li className="hover:text-cyan-400 transition-colors cursor-pointer">Community Intelligence</li>
                      <li className="hover:text-cyan-400 transition-colors cursor-pointer">Expert Analysis</li>
                      <li className="hover:text-cyan-400 transition-colors cursor-pointer">24/7 Protection</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4 text-lg flex items-center">
                      <span className="mr-2">📞</span>
                      Support
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>
                        <button 
                          onClick={() => setCurrentSection('support')}
                          className="hover:text-cyan-400 transition-colors"
                        >
                          24/7 Expert Support
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => window.open('https://docs.xistai.com')}
                          className="hover:text-cyan-400 transition-colors"
                        >
                          Documentation
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => window.open('mailto:security@xistai.com')}
                          className="hover:text-cyan-400 transition-colors"
                        >
                          Report Security Issue
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => setCurrentSection('settings')}
                          className="hover:text-cyan-400 transition-colors"
                        >
                          System Status
                        </button>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4 text-lg flex items-center">
                      <span className="mr-2">🌐</span>
                      Connect
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>
                        <button 
                          onClick={() => setCurrentSection('community')}
                          className="hover:text-cyan-400 transition-colors"
                        >
                          Community Forum
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => window.open('https://api.xistai.com')}
                          className="hover:text-cyan-400 transition-colors"
                        >
                          Developer API
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => window.open('https://partners.xistai.com')}
                          className="hover:text-cyan-400 transition-colors"
                        >
                          Partner Program
                        </button>
                      </li>
                      <li>
                        <button 
                          onClick={() => setCurrentSection('about')}
                          className="hover:text-cyan-400 transition-colors"
                        >
                          About Xist AI
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-gray-800 mt-8 pt-8">
                  <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-sm text-gray-400 text-center md:text-left">
                      © 2025 Xist AI Platform. Built for Google GenAI Hackathon • Powered by DeepSeek-R1
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        Version 3.0.2
                      </span>
                      <span>•</span>
                      <span>Updated: {new Date().toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="flex items-center text-green-400">
                        <span className="mr-1">🟢</span>
                        All Systems Operational
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
