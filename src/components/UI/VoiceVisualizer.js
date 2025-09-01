const { useState, useEffect, useRef } = React;

// Voice Visualizer Component with Enhanced Animation
const VoiceVisualizer = ({ isActive, sensitivity = 1, barCount = 5, color = '#3b82f6' }) => {
  const [bars, setBars] = useState(Array(barCount).fill(0));
  const animationRef = useRef();
  const lastUpdateRef = useRef(0);

  // Generate realistic voice patterns
  const generateVoicePattern = () => {
    return Array(barCount).fill(0).map((_, index) => {
      if (!isActive) return 4; // Minimal height when inactive
      
      // Create wave-like pattern with randomness
      const baseHeight = 8 + Math.sin((Date.now() / 200) + (index * 0.5)) * 6;
      const randomVariation = Math.random() * 8 * sensitivity;
      const centerBias = Math.abs(index - (barCount / 2)) < (barCount / 4) ? 4 : 0;
      
      return Math.max(4, Math.min(20, baseHeight + randomVariation + centerBias));
    });
  };

  // Animation loop
  useEffect(() => {
    const animate = (timestamp) => {
      if (timestamp - lastUpdateRef.current > 50) { // Update every 50ms
        setBars(generateVoicePattern());
        lastUpdateRef.current = timestamp;
      }
      
      if (isActive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isActive) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setBars(Array(barCount).fill(4));
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, barCount, sensitivity]);

  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {bars.map((height, index) => (
        <div
          key={index}
          className="voice-bar transition-all duration-75 ease-out"
          style={{
            height: `${height}px`,
            background: isActive 
              ? `linear-gradient(to top, ${color}, ${color}88)` 
              : '#6b7280',
            width: '3px',
            borderRadius: '2px',
            opacity: isActive ? 1 : 0.5
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Voice Input Component
const VoiceInput = ({ onResult, onError, isListening, language = 'en-US' }) => {
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = language;
      
      speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        onResult({ transcript, confidence });
      };
      
      speechRecognition.onerror = (event) => {
        onError(event.error);
      };
      
      setRecognition(speechRecognition);
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, [language, onResult, onError]);

  useEffect(() => {
    if (recognition) {
      if (isListening) {
        recognition.start();
      } else {
        recognition.stop();
      }
    }
  }, [isListening, recognition]);

  if (!isSupported) {
    return (
      <div className="text-gray-400 text-xs">
        Voice input not supported in this browser
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <VoiceVisualizer isActive={isListening} />
      <span className="text-xs text-gray-400">
        {isListening ? 'Listening...' : 'Ready'}
      </span>
    </div>
  );
};

// Voice Output/Text-to-Speech Component
const VoiceOutput = ({ text, voice = null, rate = 1.0, pitch = 1.0, onStart, onEnd, onError }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = () => {
    if (!text) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    if (voice) {
      const selectedVoice = voices.find(v => v.name === voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      onStart?.();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      onEnd?.();
    };

    utterance.onerror = (event) => {
      setIsPlaying(false);
      onError?.(event.error);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isPlaying ? stop : speak}
        className="p-2 rounded-lg glass-panel border border-purple-400/40 text-purple-300 hover:border-purple-400 transition-colors"
        title={isPlaying ? 'Stop speaking' : 'Read aloud'}
      >
        {isPlaying ? '⏹️' : '🔊'}
      </button>
      {isPlaying && <VoiceVisualizer isActive={true} color="#8b5cf6" />}
    </div>
  );
};

// Export components for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VoiceVisualizer, VoiceInput, VoiceOutput };
}
