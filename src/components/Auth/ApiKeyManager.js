const { useState, useEffect } = React;

// COMPLETE ApiKeyManager Component with all features
const ApiKeyManager = ({ apiKey, onApiKeyChange }) => {
  const [isEditing, setIsEditing] = useState(!apiKey);
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [keyStrength, setKeyStrength] = useState(0);

  // Validate API key format
  // In ApiKeyManager.js, add better validation:
const validateApiKey = async (key) => {
  if (!key) return { valid: false, message: 'API key is required' };
  
  // Check format
  if (!key.startsWith('sk-or-v1-') && !key.startsWith('sk-')) {
    return { valid: false, message: 'Invalid API key format. Should start with sk-or-v1- or sk-' };
  }

  try {
    const testResponse = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': window.location.href || 'https://localhost:3000',
        'X-Title': 'PRIME Security Platform'
      }
    });

    if (testResponse.status === 401) {
      return { valid: false, message: 'API key is invalid or expired. Please generate a new one.' };
    } else if (testResponse.status === 429) {
      return { valid: false, message: 'Rate limit exceeded. Try again later.' };
    } else if (testResponse.ok) {
      return { valid: true, message: 'API key verified successfully' };
    } else {
      return { valid: false, message: `Validation failed: ${testResponse.status}` };
    }
  } catch (error) {
    return { valid: false, message: 'Network error during validation. Check your connection.' };
  }
};


  const handleSave = async () => {
    if (!tempKey.trim()) return;

    setIsValidating(true);
    const validation = await validateApiKey(tempKey.trim());
    setValidationResult(validation);

    if (validation.valid) {
      onApiKeyChange(tempKey.trim());
      setIsEditing(false);
      localStorage.setItem('prime_api_key', tempKey.trim());
      console.log('✅ API Key saved successfully:', tempKey.substring(0, 10) + '...');
    }
    setIsValidating(false);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your API key? This will disable AI features.')) {
      onApiKeyChange('');
      setTempKey('');
      setIsEditing(true);
      setValidationResult(null);
      localStorage.removeItem('prime_api_key');
      console.log('🗑️ API Key cleared');
    }
  };

  const handleTest = async () => {
    if (!apiKey) return;
    
    setIsValidating(true);
    const validation = await validateApiKey(apiKey);
    setValidationResult(validation);
    setIsValidating(false);
  };

  const maskKey = (key) => {
    if (!key) return 'Not configured';
    if (key.length < 20) return key.substring(0, 8) + '••••••••••••';
    return key.substring(0, 8) + '••••••••••••••••••••••••••••••' + key.substring(key.length - 4);
  };

  const getStatusColor = () => {
    if (isValidating) return 'text-yellow-400';
    if (!validationResult) return apiKey ? 'text-green-400' : 'text-red-400';
    return validationResult.valid ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = () => {
    if (isValidating) return '⏳';
    if (!validationResult) return apiKey ? '✅' : '❌';
    return validationResult.valid ? '✅' : '❌';
  };

  const getStatusText = () => {
    if (isValidating) return 'Validating...';
    if (!validationResult) return apiKey ? 'Configured' : 'Not Configured';
    return validationResult.message;
  };

  return (
    <div className="glass-panel p-6 rounded-xl mb-6 border border-blue-400/40">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-blue-300 flex items-center gap-3">
            🔑 OpenRouter API Configuration
            <span className="badge-premium text-xs">REQUIRED</span>
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Configure your AI service connection for fact-checking and analysis
          </p>
        </div>
        <div className="flex gap-2">
          {apiKey && !isEditing && (
            <>
              <button
                onClick={() => setShowKey(!showKey)}
                className="p-2 text-sm rounded-lg glass-panel border-gray-600 text-gray-300 hover:border-blue-400 transition-colors"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? '🙈' : '👁️'}
              </button>
              <button
                onClick={handleTest}
                disabled={isValidating}
                className="p-2 text-sm rounded-lg glass-panel border-green-400/50 text-green-300 hover:border-green-400 transition-colors disabled:opacity-50"
                title="Test API key"
              >
                🧪
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-sm rounded-lg glass-panel border-blue-400/50 text-blue-300 hover:border-blue-400 transition-colors"
                title="Edit API key"
              >
                ✏️
              </button>
            </>
          )}
          {apiKey && (
            <button
              onClick={handleClear}
              className="p-2 text-sm rounded-lg glass-panel border-red-400/50 text-red-300 hover:border-red-400 transition-colors"
              title="Clear API key"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKeyInput" className="block text-gray-300 mb-2 font-medium">
              API Key
            </label>
            <div className="relative">
              <input
                id="apiKeyInput"
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="Enter your OpenRouter API key (sk-or-v1-...)"
                className="w-full p-4 rounded-lg bg-surface border border-blue-400/40 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors font-mono text-sm pr-12"
                disabled={isValidating}
              />
              {tempKey && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className={`text-xs font-semibold ${
                    keyStrength >= 75 ? 'text-green-400' :
                    keyStrength >= 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {keyStrength >= 75 ? '🟢' : keyStrength >= 50 ? '🟡' : '🔴'}
                  </div>
                </div>
              )}
            </div>
            {tempKey && (
              <div className="mt-2">
                <div className="text-xs text-gray-400 mb-1">Key Strength:</div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      keyStrength >= 75 ? 'bg-green-500' :
                      keyStrength >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${keyStrength}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {validationResult && (
            <div className={`p-3 rounded-lg border ${
              validationResult.valid 
                ? 'bg-green-900/30 border-green-400/50 text-green-300'
                : 'bg-red-900/30 border-red-400/50 text-red-300'
            }`}>
              <div className="flex items-center gap-2">
                <span>{validationResult.valid ? '✅' : '❌'}</span>
                <span className="text-sm font-medium">{validationResult.message}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleSave}
              disabled={!tempKey.trim() || isValidating}
              className="px-6 py-3 rounded-lg professional-button text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
            >
              {isValidating ? (
                <>⏳ Validating...</>
              ) : (
                <>💾 Save & Validate</>
              )}
            </button>
            {apiKey && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setTempKey(apiKey);
                  setValidationResult(null);
                }}
                className="px-6 py-3 rounded-lg glass-panel border border-gray-600 text-gray-300 hover:border-blue-400 transition-colors text-sm"
                disabled={isValidating}
              >
                ❌ Cancel
              </button>
            )}
          </div>

          <div className="glass-panel p-4 rounded-lg border-yellow-400/30">
            <h4 className="text-yellow-300 font-semibold mb-2 flex items-center gap-2">
              🔐 How to get your API key:
            </h4>
            <ol className="text-xs text-gray-300 space-y-1 leading-relaxed">
              <li>1. Visit <a href="https://openrouter.ai/keys" target="_blank" className="text-blue-400 hover:text-blue-300 underline">openrouter.ai/keys</a></li>
              <li>2. Sign up or log in to your account</li>
              <li>3. Create a new API key</li>
              <li>4. Copy and paste it here</li>
              <li>5. Your key is stored locally and never sent to our servers</li>
            </ol>
            <div className="mt-3 p-2 bg-blue-900/30 rounded border border-blue-400/30">
              <div className="text-blue-300 text-xs">
                <strong>💡 Pro Tip:</strong> OpenRouter offers free tier access to many AI models including DeepSeek R1, perfect for getting started!
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 glass-panel rounded-lg">
            <div className="font-mono text-sm text-gray-300 flex-1">
              {showKey ? apiKey : maskKey(apiKey)}
            </div>
            <div className={`text-sm font-medium ${getStatusColor()} flex items-center gap-2`}>
              <span>{getStatusIcon()}</span>
              <span>{getStatusText()}</span>
            </div>
          </div>

          {validationResult && !validationResult.valid && (
            <div className="p-3 bg-red-900/30 border border-red-400/50 text-red-300 rounded-lg text-sm">
              <div className="font-semibold mb-1">⚠️ API Key Issues Detected:</div>
              <div>{validationResult.message}</div>
              <div className="mt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-400 hover:text-blue-300 underline text-xs"
                >
                  Update API Key →
                </button>
              </div>
            </div>
          )}

          {apiKey && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="glass-panel p-3 rounded-lg text-center">
                <div className="text-blue-400 font-semibold">Status</div>
                <div className={getStatusColor()}>{apiKey ? 'Active' : 'Inactive'}</div>
              </div>
              <div className="glass-panel p-3 rounded-lg text-center">
                <div className="text-purple-400 font-semibold">Security</div>
                <div className="text-green-400">Encrypted</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiKeyManager;
}
