const { useState } = React;

// Government Authority Login Modal with Enhanced Features
const AuthorityLoginModal = ({ isOpen, onClose, onLogin }) => {
  const [credentials, setCredentials] = useState({
    department: '',
    badgeNumber: '',
    password: '',
    verificationCode: '',
    officerName: '',
    contactNumber: '',
    officialEmail: ''
  });
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState(1); // Multi-step verification (1: credentials, 2: 2FA, 3: final verification)
  const [verificationMethod, setVerificationMethod] = useState('sms'); // sms, email, authenticator
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const departments = [
    'Cyber Crime Cell',
    'Local Police',
    'Economic Offences Wing',
    'CBI (Central Bureau of Investigation)',
    'ED (Enforcement Directorate)',
    'Income Tax Department',
    'Reserve Bank of India (RBI)',
    'SEBI (Securities Exchange Board)',
    'CERT-In (Computer Emergency Response Team)',
    'National Investigation Agency (NIA)',
    'Delhi Police',
    'Mumbai Police',
    'Karnataka Police',
    'Tamil Nadu Police',
    'Ministry of Electronics & IT',
    'Department of Telecommunications',
    'Financial Intelligence Unit',
    'Directorate of Revenue Intelligence'
  ];

  const resetForm = () => {
    setCredentials({
      department: '',
      badgeNumber: '',
      password: '',
      verificationCode: '',
      officerName: '',
      contactNumber: '',
      officialEmail: ''
    });
    setStep(1);
    setAttempts(0);
    setIsLocked(false);
    setIsVerifying(false);
  };

  const validateStep1 = () => {
    return credentials.badgeNumber && 
           credentials.department && 
           credentials.officerName && 
           credentials.password && 
           credentials.contactNumber &&
           credentials.officialEmail;
  };

  const handleVerification = async () => {
    if (isLocked) {
      alert('Account temporarily locked due to multiple failed attempts. Please try again in 15 minutes.');
      return;
    }

    setIsVerifying(true);

    // Step 1: Initial credentials verification
    if (step === 1) {
      setTimeout(() => {
        if (credentials.badgeNumber && 
            credentials.department && 
            credentials.password === 'admin123' && 
            credentials.officerName &&
            credentials.contactNumber &&
            credentials.officialEmail.includes('@gov.in')) {
          setStep(2);
        } else {
          setAttempts(prev => prev + 1);
          if (attempts >= 2) {
            setIsLocked(true);
            alert('Too many failed attempts. Account locked for security.');
          } else {
            alert('Invalid credentials. For demo: password is "admin123" and email must be @gov.in domain');
          }
        }
        setIsVerifying(false);
      }, 2000);
    } 
    // Step 2: Two-factor authentication
    else if (step === 2) {
      setTimeout(() => {
        if (credentials.verificationCode === '123456') {
          setStep(3);
        } else {
          setAttempts(prev => prev + 1);
          alert('Invalid verification code. Use: 123456 for demo');
        }
        setIsVerifying(false);
      }, 1500);
    }
    // Step 3: Final verification and login
    else if (step === 3) {
      setTimeout(() => {
        const authorityData = {
          role: 'authority',
          department: credentials.department,
          badgeNumber: credentials.badgeNumber,
          officerName: credentials.officerName,
          contactNumber: credentials.contactNumber,
          officialEmail: credentials.officialEmail,
          verified: true,
          verificationLevel: 'FULL',
          verificationTime: new Date().toISOString(),
          sessionId: 'AUTH-' + Date.now(),
          permissions: [
            'publish_alerts',
            'verify_reports', 
            'access_analytics',
            'manage_community',
            'view_classified',
            'emergency_broadcast',
            'data_export',
            'user_management'
          ],
          securityClearance: 'LEVEL_2',
          jurisdiction: determineJurisdiction(credentials.department),
          lastLogin: new Date().toISOString()
        };
        
        onLogin(authorityData);
        onClose();
        resetForm();
        setIsVerifying(false);
      }, 1500);
    }
  };

  const determineJurisdiction = (department) => {
    const jurisdictions = {
      'Cyber Crime Cell': ['National', 'Cyber Crimes'],
      'CBI (Central Bureau of Investigation)': ['National', 'Major Crimes'],
      'Delhi Police': ['Delhi NCR'],
      'Mumbai Police': ['Mumbai', 'Maharashtra'],
      'Income Tax Department': ['National', 'Financial Crimes']
    };
    return jurisdictions[department] || ['Regional'];
  };

  const sendVerificationCode = (method) => {
    setVerificationMethod(method);
    // Simulate sending verification code
    console.log(`Verification code sent via ${method}`);
    alert(`Verification code sent via ${method}. Use 123456 for demo.`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-backdrop">
      <div className="glass-elevated p-8 rounded-2xl border border-red-500/30 max-w-lg w-full animate-fade-in modal-content">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-bounce-gentle">
            <span className="text-white text-3xl">🏛️</span>
          </div>
          <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Government Authority Access
          </h2>
          <p className="text-gray-400">Secure multi-factor authentication for law enforcement officers</p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2">
              {[1, 2, 3].map((stepNum) => (
                <div 
                  key={stepNum}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    step >= stepNum ? 'bg-red-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-400 ml-3">
              Step {step} of 3
            </div>
          </div>
        </div>

        {/* Step 1: Credentials */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white text-center mb-4">
              🔐 Officer Credentials Verification
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Full Name (as per official records)"
                value={credentials.officerName}
                onChange={(e) => setCredentials(prev => ({ ...prev, officerName: e.target.value }))}
                className="w-full p-3 glass-panel border border-red-400/40 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-red-400 enhanced-input"
              />
              
              <select
                value={credentials.department}
                onChange={(e) => setCredentials(prev => ({ ...prev, department: e.target.value }))}
                className="w-full p-3 glass-panel border border-red-400/40 rounded-lg text-gray-100 focus:outline-none focus:border-red-400"
              >
                <option value="">Select Department/Agency</option>
                {departments.map(dept => (
                  <option key={dept} value={dept} className="bg-surface text-gray-100">
                    {dept}
                  </option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="Badge/Service Number"
                value={credentials.badgeNumber}
                onChange={(e) => setCredentials(prev => ({ ...prev, badgeNumber: e.target.value }))}
                className="w-full p-3 glass-panel border border-red-400/40 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-red-400 enhanced-input"
              />
              
              <input
                type="email"
                placeholder="Official Email (@gov.in domain required)"
                value={credentials.officialEmail}
                onChange={(e) => setCredentials(prev => ({ ...prev, officialEmail: e.target.value }))}
                className="w-full p-3 glass-panel border border-red-400/40 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-red-400 enhanced-input"
              />
              
              <input
                type="tel"
                placeholder="Official Contact Number"
                value={credentials.contactNumber}
                onChange={(e) => setCredentials(prev => ({ ...prev, contactNumber: e.target.value }))}
                className="w-full p-3 glass-panel border border-red-400/40 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-red-400 enhanced-input"
              />
              
              <input
                type="password"
                placeholder="Secure Password (demo: admin123)"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full p-3 glass-panel border border-red-400/40 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-red-400 enhanced-input"
              />
            </div>

            {attempts > 0 && (
              <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3">
                <p className="text-yellow-300 text-sm">
                  ⚠️ Warning: {3 - attempts} attempts remaining before account lock
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Two-Factor Authentication */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-green-400 text-5xl mb-4">✓</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Initial Verification Complete
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Please complete two-factor authentication to proceed
              </p>
            </div>

            {/* Verification Method Selection */}
            <div className="space-y-3 mb-4">
              <p className="text-gray-300 text-sm">Choose verification method:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => sendVerificationCode('sms')}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    verificationMethod === 'sms' 
                      ? 'border-green-400 bg-green-900/30 text-green-300'
                      : 'glass-panel border-gray-600 text-gray-300 hover:border-green-400'
                  }`}
                >
                  <div className="text-lg mb-1">📱</div>
                  <div className="text-xs">SMS</div>
                </button>
                <button
                  onClick={() => sendVerificationCode('email')}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    verificationMethod === 'email' 
                      ? 'border-green-400 bg-green-900/30 text-green-300'
                      : 'glass-panel border-gray-600 text-gray-300 hover:border-green-400'
                  }`}
                >
                  <div className="text-lg mb-1">📧</div>
                  <div className="text-xs">Email</div>
                </button>
                <button
                  onClick={() => sendVerificationCode('authenticator')}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    verificationMethod === 'authenticator' 
                      ? 'border-green-400 bg-green-900/30 text-green-300'
                      : 'glass-panel border-gray-600 text-gray-300 hover:border-green-400'
                  }`}
                >
                  <div className="text-lg mb-1">🔐</div>
                  <div className="text-xs">App</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">6-Digit Verification Code</label>
              <input
                type="text"
                value={credentials.verificationCode}
                onChange={(e) => setCredentials(prev => ({ ...prev, verificationCode: e.target.value }))}
                placeholder="Enter verification code (demo: 123456)"
                maxLength="6"
                className="w-full p-4 glass-panel border border-green-400/40 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-green-400 text-center text-2xl font-mono tracking-widest"
              />
            </div>
          </div>
        )}

        {/* Step 3: Final Verification */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="text-blue-400 text-6xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Security Verification Complete
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Finalizing secure access to government authority portal...
            </p>
            <div className="glass-panel p-4 rounded-lg">
              <div className="text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Officer:</span>
                  <span className="text-white font-medium">{credentials.officerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Department:</span>
                  <span className="text-white font-medium">{credentials.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Badge:</span>
                  <span className="text-white font-medium">{credentials.badgeNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Clearance:</span>
                  <span className="text-green-400 font-medium">LEVEL 2 - AUTHORIZED</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Demo Instructions */}
        <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4 mt-6">
          <p className="text-yellow-300 text-sm">
            <strong>🔧 Demo Environment Instructions:</strong>
          </p>
          <ul className="text-yellow-300 text-xs mt-2 space-y-1">
            <li>• Use password: <code className="bg-yellow-800/30 px-1 rounded">admin123</code></li>
            <li>• Email must end with: <code className="bg-yellow-800/30 px-1 rounded">@gov.in</code></li>
            <li>• Verification code: <code className="bg-yellow-800/30 px-1 rounded">123456</code></li>
            <li>• All fields are required for demonstration</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 glass-panel border border-gray-500/50 text-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            disabled={isVerifying}
          >
            Cancel
          </button>
          <button
            onClick={handleVerification}
            disabled={isVerifying || isLocked || (step === 1 && !validateStep1()) || (step === 2 && !credentials.verificationCode)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isVerifying ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </div>
            ) : (
              <>
                {step === 1 && '🔐 Verify Credentials'}
                {step === 2 && '✅ Verify Code'} 
                {step === 3 && '🏛️ Complete Login'}
              </>
            )}
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-3 glass-panel rounded-lg border border-blue-400/30">
          <p className="text-blue-300 text-xs text-center">
            🔒 This system uses advanced encryption and multi-factor authentication to ensure secure access to government resources
          </p>
        </div>
      </div>
    </div>
  );
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthorityLoginModal;
}
