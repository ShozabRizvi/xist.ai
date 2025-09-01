const { createContext, useContext, useState, useEffect } = React;

// Storage constants
const API_KEY_STORAGE = 'openrouter_api_key';
const SETTINGS_STORAGE = 'fact_checker_settings';

const SettingsContext = createContext();

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('VANTA_settings');
    return saved ? JSON.parse(saved) : {
      apiKey: localStorage.getItem('VANTA_api_key') || '',
      user: {
        name: '',
        email: '',
        role: 'citizen', // citizen, authority, admin
        department: '',
        badgeNumber: '',
        verified: false,
        avatar: '',
        officerName: '',
        verificationLevel: 'NONE',
        permissions: [],
        preferences: {
          language: 'en',
          timezone: 'Asia/Kolkata',
          notifications: true,
          emailUpdates: false,
          smsAlerts: false
        }
      },
      appearance: {
        theme: 'dark',
        accentColor: 'blue',
        fontSize: 'medium',
        compactMode: false,
        animations: true,
        highContrast: false,
        reducedMotion: false,
        customTheme: null,
        sidebarCollapsed: false
      },
      notifications: {
        threatAlerts: true,
        communityUpdates: true,
        educationReminders: true,
        soundEnabled: true,
        authorityUpdates: true,
        emailNotifications: false,
        pushNotifications: true,
        frequency: 'immediate', // immediate, hourly, daily, weekly
        quietHours: { enabled: false, start: '22:00', end: '08:00' },
        categories: {
          critical: true,
          high: true,
          medium: true,
          low: false,
          educational: true
        }
      },
      privacy: {
        dataSharing: false,
        anonymousReporting: true,
        localProcessing: true,
        encryptReports: true,
        autoReportThreats: false,
        shareWithAuthorities: true,
        publicProfile: false,
        trackingConsent: false,
        analyticsConsent: false,
        marketingConsent: false,
        dataRetentionDays: 90
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        voiceSpeed: 1.0,
        reduceMotion: false,
        screenReader: false,
        keyboardNavigation: true,
        colorBlindSupport: false,
        fontSize: 16,
        voiceType: 'system',
        audioDescriptions: false,
        simpleLanguage: false,
        readingAssistance: false,
        language: 'en',
        stickyKeys: false,
        clickDelay: 0
      },
      ai: {
        model: 'deepseek/deepseek-r1:free',
        backupModel: 'anthropic/claude-3-haiku',
        multiSource: true,
        confidence: 0.8,
        maxTokens: 3000,
        temperature: 0.3,
        learningMode: true,
        contextMemory: true,
        voiceEnabled: false,
        responseStyle: 'detailed', // brief, detailed, technical
        multiSourceVerification: true,
        behavioralAnalysis: true,
        emotionalAnalysis: true,
        linguisticAnalysis: true,
        imageAnalysis: true,
        audioAnalysis: true,
        contextualAnalysis: true,
        networkAnalysis: true,
        processingPriority: 'balanced', // speed, balanced, accuracy, comprehensive
        autoAnalysis: false,
        continuousLearning: true,
        userFeedbackLearning: true,
        confidenceThreshold: 0.8
      },
      advanced: {
        developerMode: false,
        apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
        timeout: 30000,
        retryAttempts: 3,
        cacheResponses: true,
        debugMode: false,
        experimentalFeatures: false,
        betaAccess: false,
        performanceMode: 'balanced', // performance, balanced, battery
        memoryLimit: '1GB',
        maxConcurrentRequests: 3
      }
    };
  });

  const [analytics, setAnalytics] = useState(() => {
    const saved = localStorage.getItem('VANTA_analytics');
    return saved ? JSON.parse(saved) : {
      threatsBlocked: 1247,
      scamsDetected: 89,
      communityReports: 156,
      educationScore: 85,
      riskLevel: 'LOW',
      lastScan: new Date().toISOString(),
      authorityAlerts: 12,
      verifiedReports: 45,
      totalVerifications: 2847,
      accuracyRate: 94.2,
      responseTime: 1.2,
      userEngagement: 78,
      knowledgeBase: 15432,
      activeCommunityMembers: 8934,
      monthlyGrowth: 23.5,
      systemUptime: 99.8,
      dailyScans: 45,
      weeklyScans: 312,
      monthlyScans: 1247,
      falsePositives: 12,
      falseNegatives: 8,
      communityAccuracy: 91.5,
      averageResponseTime: 2.1,
      peakUsageHour: 14,
      totalUsers: 15678,
      activeUsers: 8934,
      newUsersThisMonth: 1234
    };
  });

  // Enhanced Community Reports with more details
  const [communityReports, setCommunityReports] = useState(() => {
    const saved = localStorage.getItem('VANTA_community_reports');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        type: 'phishing',
        title: 'Fake SBI Bank Email Scam',
        description: 'Received email claiming account suspension, asking for card details and OTP. URL looks suspicious with .tk domain.',
        phoneNumber: '+91-9876543210',
        email: 'fake@sbi-secure.tk',
        website: 'https://sbi-secure.tk/verify',
        amount: '50000',
        location: 'Delhi',
        urgency: 'HIGH',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        verified: false,
        reporter: 'Community Member',
        reporterRole: 'citizen',
        evidence: null,
        status: 'under_review',
        tags: ['banking', 'phishing', 'email'],
        upvotes: 23,
        downvotes: 1,
        views: 156,
        authorityResponse: null,
        riskScore: 8.5,
        confidence: 0.92,
        similarReports: 45,
        affectedUsers: 89,
        geolocation: { lat: 28.6139, lng: 77.2090 },
        deviceInfo: 'Android Chrome',
        ipAddress: '103.x.x.x',
        reportedVia: 'web'
      },
      {
        id: '2',
        type: 'voice',
        title: 'Fake Cyber Police Call Scam',
        description: 'Caller claimed to be from cyber police, said my number was used for illegal activities. Demanded immediate payment to avoid arrest.',
        phoneNumber: '+91-8765432109',
        amount: '25000',
        location: 'Mumbai',
        urgency: 'HIGH',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        verified: true,
        reporter: 'Verified User',
        reporterRole: 'citizen',
        status: 'verified',
        tags: ['voice', 'police', 'impersonation'],
        upvotes: 45,
        downvotes: 0,
        views: 289,
        authorityResponse: 'Confirmed scam pattern. Number blocked by telecom authorities.',
        riskScore: 9.2,
        confidence: 0.95,
        similarReports: 67,
        affectedUsers: 134,
        callDuration: '8:45',
        voiceAnalysis: 'Suspicious patterns detected',
        reportedVia: 'mobile_app'
      }
    ];
  });

  // Enhanced Authority Alerts
  const [authorityAlerts, setAuthorityAlerts] = useState(() => {
    const saved = localStorage.getItem('VANTA_authority_alerts');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Critical UPI Scam Alert - Immediate Action Required',
        content: 'New sophisticated UPI scam involving fake payment requests is targeting citizens across major cities. Scammers are creating fake merchant QR codes and requesting payments for non-existent services. Citizens are advised to verify merchant details before making any UPI payments.',
        authority: 'Cyber Crime Cell, Delhi Police',
        badgeNumber: 'CC001',
        officerName: 'Inspector Rajesh Kumar',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        urgency: 'CRITICAL',
        category: 'financial',
        targetRegions: ['Delhi', 'Mumbai', 'Bangalore'],
        verified: true,
        views: 15234,
        shares: 892,
        actionItems: [
          'Verify merchant name and contact before payment',
          'Check UPI transaction history regularly',
          'Report suspicious QR codes to authorities'
        ],
        attachments: [],
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        affectedDemographics: ['18-35', '36-50'],
        estimatedImpact: 'HIGH',
        preventionTips: [
          'Always verify merchant details',
          'Check transaction history',
          'Report suspicious activity'
        ],
        relatedAlerts: [],
        status: 'active'
      },
      {
        id: '2',
        title: 'Fake Government Scheme Warning',
        content: 'Fraudsters are creating fake government websites and social media pages claiming to offer new subsidy schemes. These fake schemes ask for personal documents and advance payments.',
        authority: 'Mumbai Police Cyber Division',
        badgeNumber: 'MP234',
        officerName: 'DCP Priya Sharma',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        urgency: 'HIGH',
        category: 'government',
        targetRegions: ['Mumbai', 'Pune'],
        verified: true,
        views: 8945,
        shares: 456,
        actionItems: [
          'Verify schemes only through official .gov.in websites',
          'Never pay advance fees for government schemes',
          'Report fake schemes to cybercrime portal'
        ],
        status: 'active'
      }
    ];
  });

  // Chat History Management
  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem('VANTA_chat_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Education Progress
  const [educationProgress, setEducationProgress] = useState(() => {
    const saved = localStorage.getItem('VANTA_education_progress');
    return saved ? JSON.parse(saved) : {
      completedLessons: [],
      currentStreak: 0,
      totalPoints: 0,
      badges: [],
      lastActivity: null,
      skillLevels: {
        phishing: 0,
        socialEngineering: 0,
        voiceScams: 0,
        financialFraud: 0,
        identityTheft: 0,
        investmentFraud: 0,
        romanceScams: 0,
        techSupport: 0
      },
      courseProgress: {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
        expert: 0
      },
      certifications: [],
      learningPath: 'beginner',
      weeklyGoal: 3,
      monthlyGoal: 12
    };
  });

  // Protection Status
  const [protectionStatus, setProtectionStatus] = useState(() => {
    const saved = localStorage.getItem('VANTA_protection_status');
    return saved ? JSON.parse(saved) : {
      isActive: true,
      blockedNumbers: [],
      filteredMessages: [],
      protectionLogs: [],
      lastUpdate: new Date().toISOString(),
      threatLevel: 'LOW',
      scanResults: {
        callsBlocked: 47,
        smsFiltered: 123,
        emailsScanned: 89,
        sitesBlocked: 12,
        malwareBlocked: 5,
        phishingBlocked: 34
      },
      realTimeProtection: true,
      autoUpdate: true,
      cloudSync: true,
      deviceProtection: {
        antivirus: true,
        firewall: true,
        webProtection: true,
        emailProtection: true
      }
    };
  });

  // Persist all data with error handling
  useEffect(() => {
    try {
      localStorage.setItem('VANTA_settings', JSON.stringify(settings));
      if (settings.apiKey) {
        localStorage.setItem('VANTA_api_key', settings.apiKey);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('VANTA_analytics', JSON.stringify(analytics));
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }, [analytics]);

  useEffect(() => {
    try {
      localStorage.setItem('VANTA_community_reports', JSON.stringify(communityReports));
    } catch (error) {
      console.error('Failed to save community reports:', error);
    }
  }, [communityReports]);

  useEffect(() => {
    try {
      localStorage.setItem('VANTA_authority_alerts', JSON.stringify(authorityAlerts));
    } catch (error) {
      console.error('Failed to save authority alerts:', error);
    }
  }, [authorityAlerts]);

  useEffect(() => {
    try {
      localStorage.setItem('VANTA_chat_history', JSON.stringify(chatHistory));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, [chatHistory]);

  // Add theme application function to SettingsContext.js
const applyTheme = (settings) => {
  const root = document.documentElement;
  
  // Apply theme colors
  const themeColors = {
    dark: {
      '--bg-primary': '#0f172a',
      '--bg-secondary': '#1e293b',
      '--text-primary': '#ffffff',
      '--text-secondary': '#9ca3af'
    },
    light: {
      '--bg-primary': '#ffffff', 
      '--bg-secondary': '#f8fafc',
      '--text-primary': '#1f2937',
      '--text-secondary': '#6b7280'
    }
  };
  
  const colors = themeColors[settings.appearance.theme];
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Apply font family
  const fontFamilies = {
    inter: 'Inter, system-ui, sans-serif',
    roboto: 'Roboto, system-ui, sans-serif',
    poppins: 'Poppins, system-ui, sans-serif'
  };
  
  root.style.setProperty('--font-primary', fontFamilies[settings.appearance.fontFamily] || fontFamilies.inter);
  
  // Apply font size
  const fontSizes = {
    small: '14px',
    medium: '16px', 
    large: '18px'
  };
  
  root.style.setProperty('--font-size-base', fontSizes[settings.appearance.fontSize] || fontSizes.medium);
  
  // Apply accent color
  const accentColors = {
    blue: '#3b82f6',
    purple: '#8b5cf6',
    green: '#10b981',
    red: '#ef4444',
    cyan: '#06b6d4'
  };
  
  root.style.setProperty('--accent-color', accentColors[settings.appearance.accentColor] || accentColors.blue);
};

// Update SettingsProvider to apply theme on changes
const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(/* existing code */);
  
  // Apply theme whenever settings change
  useEffect(() => {
    applyTheme(settings);
  }, [settings.appearance]);
  
  // Apply theme on initial load
  useEffect(() => {
    applyTheme(settings);
  }, []);
  
  // Rest of existing code...
};

  useEffect(() => {
    try {
      localStorage.setItem('VANTA_education_progress', JSON.stringify(educationProgress));
    } catch (error) {
      console.error('Failed to save education progress:', error);
    }
  }, [educationProgress]);

  useEffect(() => {
    try {
      localStorage.setItem('VANTA_protection_status', JSON.stringify(protectionStatus));
    } catch (error) {
      console.error('Failed to save protection status:', error);
    }
  }, [protectionStatus]);

  return (
    <SettingsContext.Provider value={{
      settings,
      setSettings,
      analytics,
      setAnalytics,
      communityReports,
      setCommunityReports,
      authorityAlerts,
      setAuthorityAlerts,
      chatHistory,
      setChatHistory,
      educationProgress,
      setEducationProgress,
      protectionStatus,
      setProtectionStatus
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SettingsProvider, useSettings, API_KEY_STORAGE, SETTINGS_STORAGE };
}
