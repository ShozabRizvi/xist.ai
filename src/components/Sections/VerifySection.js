const { useState, useRef } = React;

// Enhanced Verify Section with Full Answer Generation
const VerifySection = () => {
  const { settings, setChatHistory, chatHistory } = useSettings();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const fileInputRef = useRef(null);
  const streamingMessageId = useRef(null);

  // Enhanced message management
  const addMessage = (role, content, analysis = null, metadata = null) => {
    const message = {
      id: Date.now().toString() + Math.random(),
      role,
      content,
      analysis,
      metadata,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    setChatHistory(prev => [...prev.slice(-20), message]);
    return message.id;
  };

  const updateMessage = (messageId, newContent) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, content: newContent } : msg
    ));
  };

  // Enhanced AI response with full answer generation
  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    console.log('🚀 sendMessage called, checking API key...');
    if (!settings.apiKey || settings.apiKey.trim() === '') {
      alert('Please enter your OpenRouter API key in Settings first!');
      console.error('❌ API key is missing or empty');
      return;
    }

    console.log('✅ API key found, proceeding with request');

    const userMessage = inputValue.trim();
    
    // Enhanced behavioral analysis
    const analysis = AIServices.analyzeBehavior(userMessage);
    const threatReport = AIServices.generateThreatReport(analysis, userMessage);
    
    addMessage('user', userMessage, analysis, { threatReport });
    setInputValue('');
    setIsLoading(true);

    const assistantId = addMessage('assistant', '');

    try {
      setIsStreaming(true);
      streamingMessageId.current = assistantId;

      console.log('🌐 Making API call to OpenRouter...');
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.href,
          'X-Title': 'AI Security Platform'
        },
        body: JSON.stringify({
          model: settings.ai.model,
          messages: [
            {
              role: 'system',
              content: `You are a professional fraud detection AI. Today's date is ${getCurrentDate()}.

🔍 ENHANCED SCAM DETECTION:

LOTTERY SCAMS - Detect these patterns:
- "Congratulations winner", "You've won", "Prize money"
- "Claim now", "Processing fee", "Tax payment required"  
- "Lucky draw", "Random selection", "Official notification"

PHISHING ATTACKS - Look for:
- Urgent account suspension messages
- Requests for personal information
- Suspicious links and domains
- Impersonation of legitimate organizations

VOICE SCAMS - Identify:
- Government/police impersonation
- Tech support scams
- Emergency money requests
- Authority figure threats

ANALYSIS FORMAT:
1. **Scam Type**: [LOTTERY/PHISHING/VOICE/ROMANCE/INVESTMENT/etc.]
2. **Risk Level**: [CRITICAL/HIGH/MEDIUM/LOW]  
3. **Red Flags**: List specific suspicious elements
4. **Why Suspicious**: Explain manipulation techniques used
5. **Immediate Actions**: What user should do right now
6. **Prevention Tips**: How to avoid similar scams
7. **Reporting**: Where to report (include Cyber Crime helpline: 1930)

Provide comprehensive, educational analysis with actionable advice.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          stream: true,
          temperature: 0.3,
          max_tokens: 3000
        })
      });

      // In VerifySection.js, update the error handling:
if (!response.ok) {
  if (response.status === 401) {
    throw new Error('API key is invalid or expired. Please check your OpenRouter API key in Settings.');
  } else if (response.status === 429) {
    throw new Error('Rate limit exceeded. Please wait a moment and try again.');
  } else {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
}


      console.log('✅ API call successful, processing streaming response...');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]' || data === '') continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;

              if (delta) {
                fullContent += delta;
                updateMessage(assistantId, fullContent);
              }
            } catch (e) {
              console.log('Skipping invalid JSON:', data);
            }
          }
        }
      }

      console.log('🎉 Analysis complete!');

    } catch (error) {
      console.error('❌ AI request failed:', error);
      setIsStreaming(false);
      updateMessage(assistantId, `❌ **Analysis Failed**

Error: ${error.message}

Please check your API key and try again. If the problem persists:

1. Verify your OpenRouter API key in Settings
2. Check your internet connection  
3. Try again in a few moments

**Fallback Analysis:**

Based on behavioral pattern analysis:
- **Risk Level**: ${analysis.riskLevel}
- **Risk Score**: ${analysis.riskScore}/25
- **Detected Patterns**: ${analysis.patterns.length} categories found

**Recommendations:**
${analysis.recommendations.join('\n')}`);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      streamingMessageId.current = null;
    }
  };

  // File upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setUploadedFile(file);
    }
  };

  // Text-to-speech functionality
  const handleSpeak = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = settings.accessibility?.voiceSpeed || 1.0;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Voice input handler
  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsVoiceInput(true);
      recognition.onend = () => setIsVoiceInput(false);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        alert('Voice recognition failed. Please try again.');
        setIsVoiceInput(false);
      };

      recognition.start();
    } else {
      alert('Voice recognition is not supported in this browser.');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-blue-500/20 glass-panel">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🤖 AI Verification Engine
            </h2>
            <p className="text-gray-400 mt-1">Multi-source fact-checking with comprehensive answer generation</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 glass-panel rounded-lg">
              <div className={`w-2 h-2 rounded-full ${settings.apiKey ? 'bg-green-400' : 'bg-red-400'} animate-pulse-gentle`}></div>
              <span className="text-xs text-gray-400">
                {settings.apiKey ? 'AI Ready' : 'API Key Required'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 glass-panel rounded-lg">
              <span className="text-xs text-gray-400">Model:</span>
              <span className="text-xs text-blue-400 font-mono">{settings.ai.model.split('/')[1]}</span>
            </div>
          </div>
        </div>

        {/* Enhanced quick actions */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => setInputValue('Is this email legitimate: "Your account will be suspended unless you verify immediately"')}
            className="px-3 py-1 glass-panel border border-blue-400/40 text-blue-300 rounded text-xs hover:border-blue-400"
          >
            📧 Check Email
          </button>
          <button
            onClick={() => setInputValue('Analyze this call: "This is cyber police, your number is involved in illegal activities"')}
            className="px-3 py-1 glass-panel border border-red-400/40 text-red-300 rounded text-xs hover:border-red-400"
          >
            📞 Verify Call
          </button>
          <button
            onClick={() => setInputValue('Is this investment offer real: "Guaranteed 30% returns in 60 days with government backing"')}
            className="px-3 py-1 glass-panel border border-yellow-400/40 text-yellow-300 rounded text-xs hover:border-yellow-400"
          >
            💰 Check Investment
          </button>
          <button
            onClick={() => setInputValue('Verify news: "Scientists discover cure for all cancers in breakthrough study"')}
            className="px-3 py-1 glass-panel border border-green-400/40 text-green-300 rounded text-xs hover:border-green-400"
          >
            📰 Fact Check
          </button>
        </div>
      </div>

      {/* Enhanced Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollable-content">
        {messages.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center py-16 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center animate-bounce-gentle">
              <span className="text-white text-4xl">🔍</span>
            </div>
            <h3 className="text-3xl font-display font-bold mb-4 text-white">
              Advanced AI Fact Verification
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              Submit any claim, message, email, call transcript, or content for comprehensive analysis.
              Our AI provides detailed explanations, fact-checking, risk assessment, and educational insights.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
              <div className="glass-panel p-4 rounded-xl text-center">
                <div className="text-2xl mb-2">🤖</div>
                <div className="text-blue-400 font-semibold text-sm">Multi-AI</div>
                <div className="text-gray-400 text-xs">Analysis</div>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center">
                <div className="text-2xl mb-2">📚</div>
                <div className="text-purple-400 font-semibold text-sm">Source</div>
                <div className="text-gray-400 text-xs">Verification</div>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center">
                <div className="text-2xl mb-2">🧠</div>
                <div className="text-cyan-400 font-semibold text-sm">Pattern</div>
                <div className="text-gray-400 text-xs">Detection</div>
              </div>
              <div className="glass-panel p-4 rounded-xl text-center">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-green-400 font-semibold text-sm">Threat</div>
                <div className="text-gray-400 text-xs">Intelligence</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              💡 Pro Tip: Use voice input, upload images, or type your questions for instant AI-powered analysis
            </div>
          </div>
        ) : (
          messages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              isStreaming={isStreaming && message.role === 'assistant'}
              onSpeak={handleSpeak}
              isSpeaking={isSpeaking}
            />
          ))
        )}

        {isLoading && (
          <div className="flex justify-center">
            <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
              <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full"></div>
              <span className="text-blue-400">AI analyzing your query...</span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Input Area */}
      <div className="p-6 border-t border-blue-500/20 glass-panel">
        {/* File upload preview */}
        {uploadedFile && (
          <div className="mb-4 p-3 glass-panel rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-blue-400">📎</span>
              <span className="text-gray-300 text-sm">{uploadedFile.name}</span>
              <span className="text-gray-400 text-xs">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
            </div>
            <button
              onClick={() => setUploadedFile(null)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              ❌
            </button>
          </div>
        )}

        <form onSubmit={sendMessage} className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder={settings.apiKey
              ? "Ask me anything: verify claims, check emails, analyze calls, fact-check news, or get fraud prevention advice..."
              : "Please configure your API key in Settings to start using the AI verification engine..."
            }
            rows={4}
            disabled={isLoading || !settings.apiKey}
            className={`w-full p-4 pr-32 rounded-xl glass-panel border text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all duration-300 resize-none enhanced-input ${
              !settings.apiKey ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          
          <div className="absolute right-2 top-2 flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || !settings.apiKey}
                className="p-3 rounded-lg glass-panel border border-cyan-400/40 text-cyan-300 hover:border-cyan-400 transition-colors disabled:opacity-50"
                title="Upload file (images, documents)"
              >
                📎
              </button>
              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={isLoading || !settings.apiKey}
                className={`p-3 rounded-lg glass-panel border border-green-400/40 text-green-300 hover:border-green-400 transition-colors disabled:opacity-50 ${
                  isVoiceInput ? 'animate-pulse-gentle bg-green-500/20' : ''
                }`}
                title="Voice input"
              >
                {isVoiceInput ? '🎙️' : '🎤'}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim() || !settings.apiKey}
              className={`p-3 rounded-lg transition-all duration-300 ${
                isLoading || !settings.apiKey
                  ? 'bg-gray-600/50 border border-gray-500/50 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg'
              }`}
              title="Analyze with AI"
            >
              {isLoading ? '⏳' : '🚀'}
            </button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,application/pdf,.txt,.doc,.docx"
            className="hidden"
          />

          {isStreaming && (
            <div className="absolute bottom-2 right-36 flex items-center gap-2 text-blue-400 text-xs animate-pulse-gentle">
              <VoiceVisualizer isActive={true} />
              <span>AI generating response...</span>
            </div>
          )}
        </form>

        {/* Enhanced shortcuts and tips */}
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>💡 Press Shift+Enter for new line</span>
            <span>🎤 Voice input available</span>
            <span>📎 Upload files for analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <span className="text-blue-400 font-semibold">{settings.ai.model}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VerifySection;
}
