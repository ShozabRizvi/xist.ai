const { createContext, useContext, useState, useEffect } = React;

const UserSettingsContext = createContext(null);

const UserSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('platform_user_settings');
    return saved ? JSON.parse(saved) : {
      spamFilters: { 
        jobs: true, 
        advertisements: false, 
        promotions: false, 
        internships: true, 
        banking: true,
        lottery: true,
        romance: true,
        investment: true,
        government: true
      },
      callSettings: { 
        recordingEnabled: false, 
        spamBlocking: true, 
        screeningEnabled: false,
        autoReject: true,
        whitelistMode: false,
        callAnalysis: true
      },
      communitySettings: { 
        notifications: true, 
        shareReports: false,
        publicProfile: false,
        autoShare: true,
        verifiedOnly: false
      },
      aiSettings: { 
        multiSourceVerification: true, 
        voiceAnalysis: true, 
        behaviorTracking: true, 
        predictiveAlerts: true, 
        edgeProcessing: true,
        confidenceThreshold: 0.8,
        autoAnalysis: true,
        deepLearning: true
      },
      languageSettings: { 
        primary: 'en', 
        secondary: 'hi', 
        autoDetect: true,
        voiceLanguage: 'en',
        textToSpeech: true
      },
      privacySettings: { 
        dataSharing: false, 
        anonymousReporting: true, 
        localProcessing: true,
        encryptData: true,
        deleteAfterDays: 30,
        shareWithAuthorities: true
      },
      isAdmin: false,
      isPremium: false,
      subscriptionType: 'free'
    };
  });

  const [userAnalytics, setUserAnalytics] = useState(() => {
    const saved = localStorage.getItem('user_analytics');
    return saved ? JSON.parse(saved) : {
      threatLevel: 'LOW',
      riskScore: Math.floor(Math.random() * 5),
      behaviorPattern: [],
      communityContributions: Math.floor(Math.random() * 10),
      fraudsDetected: Math.floor(Math.random() * 25),
      educationProgress: Math.floor(Math.random() * 100),
      streakDays: Math.floor(Math.random() * 30),
      pointsEarned: Math.floor(Math.random() * 1000),
      badgesUnlocked: Math.floor(Math.random() * 15),
      accuracyRate: 85 + Math.floor(Math.random() * 15),
      totalScans: Math.floor(Math.random() * 200),
      threatsBlocked: Math.floor(Math.random() * 50),
      communityRank: Math.floor(Math.random() * 1000) + 1
    };
  });

  const [userPreferences, setUserPreferences] = useState(() => {
    const saved = localStorage.getItem('user_preferences');
    return saved ? JSON.parse(saved) : {
      theme: 'dark',
      accentColor: 'blue',
      fontSize: 'medium',
      animations: true,
      soundEffects: true,
      hapticFeedback: true,
      autoSave: true,
      smartNotifications: true,
      learningMode: true,
      expertMode: false
    };
  });

  // Persist settings
  useEffect(() => {
    localStorage.setItem('platform_user_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('user_analytics', JSON.stringify(userAnalytics));
  }, [userAnalytics]);

  useEffect(() => {
    localStorage.setItem('user_preferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Helper functions
  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: value }
    }));
  };

  const updateAnalytics = (key, value) => {
    setUserAnalytics(prev => ({ ...prev, [key]: value }));
  };

  const updatePreferences = (key, value) => {
    setUserPreferences(prev => ({ ...prev, [key]: value }));
  };

  const incrementCounter = (key) => {
    setUserAnalytics(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  };

  const addBehaviorPattern = (pattern) => {
    setUserAnalytics(prev => ({
      ...prev,
      behaviorPattern: [...prev.behaviorPattern.slice(-9), pattern]
    }));
  };

  const resetAnalytics = () => {
    setUserAnalytics({
      threatLevel: 'LOW',
      riskScore: 0,
      behaviorPattern: [],
      communityContributions: 0,
      fraudsDetected: 0,
      educationProgress: 0,
      streakDays: 0,
      pointsEarned: 0,
      badgesUnlocked: 0,
      accuracyRate: 0,
      totalScans: 0,
      threatsBlocked: 0,
      communityRank: 9999
    });
  };

  const exportUserData = () => {
    return {
      settings,
      userAnalytics,
      userPreferences,
      exportDate: new Date().toISOString(),
      version: '2.1.0'
    };
  };

  const importUserData = (data) => {
    if (data.settings) setSettings(data.settings);
    if (data.userAnalytics) setUserAnalytics(data.userAnalytics);
    if (data.userPreferences) setUserPreferences(data.userPreferences);
  };

  return (
    <UserSettingsContext.Provider value={{
      settings,
      setSettings,
      userAnalytics,
      setUserAnalytics,
      userPreferences,
      setUserPreferences,
      updateSetting,
      updateAnalytics,
      updatePreferences,
      incrementCounter,
      addBehaviorPattern,
      resetAnalytics,
      exportUserData,
      importUserData
    }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UserSettingsProvider, useUserSettings };
}
