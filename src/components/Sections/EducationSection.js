const { useState, useEffect } = React;

// Education Section with Interactive Learning
const EducationSection = () => {
  const { educationProgress, setEducationProgress } = useSettings();
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [lessonProgress, setLessonProgress] = useState(0);

  const lessons = [
    {
      id: 'phishing-101',
      title: 'Phishing Detection Basics',
      description: 'Learn to identify phishing attempts and protect your data',
      category: 'phishing',
      difficulty: 'beginner',
      duration: '10 minutes',
      points: 100,
      content: `
**What is Phishing?**

Phishing is a cybercrime where attackers impersonate legitimate organizations to steal sensitive information like passwords, credit card numbers, or personal data.

**Common Signs of Phishing:**
1. **Urgent language** - "Act now or your account will be closed!"
2. **Generic greetings** - "Dear customer" instead of your name
3. **Suspicious links** - URLs that don't match the claimed sender
4. **Poor grammar** - Professional companies rarely have typos
5. **Unexpected attachments** - Files you didn't request

**Protection Tips:**
- Always verify sender identity independently
- Check URLs by hovering over links
- Use two-factor authentication
- Keep software updated
- Report suspicious emails
      `,
      quiz: [
        {
          question: "What is the main goal of phishing attacks?",
          options: [
            "To crash your computer",
            "To steal personal information", 
            "To sell you products",
            "To fix computer problems"
          ],
          correct: 1
        },
        {
          question: "Which is a red flag in emails?",
          options: [
            "Personalized greeting",
            "Official company logo",
            "Urgent language demanding immediate action",
            "Professional formatting"
          ],
          correct: 2
        }
      ]
    },
    {
      id: 'voice-scams',
      title: 'Voice Scam Recognition',
      description: 'Identify and handle fraudulent phone calls',
      category: 'voiceScams',
      difficulty: 'intermediate',
      duration: '15 minutes',
      points: 150,
      content: `
**Voice Scams Overview**

Voice scams involve fraudsters calling you pretending to be from legitimate organizations to extract money or personal information.

**Common Voice Scam Types:**
1. **Government Impersonation** - "This is the tax department"
2. **Tech Support** - "Your computer is infected"
3. **Bank Fraud** - "Suspicious activity on your account"
4. **Prize/Lottery** - "You've won a prize!"
5. **Charity Scams** - Fake donation requests

**Red Flags:**
- Pressure to act immediately
- Requests for personal information
- Asking for gift cards or wire transfers
- Threats of legal action
- Poor call quality or background noise

**How to Respond:**
- Never give personal information over unsolicited calls
- Hang up and call the organization directly
- Don't press numbers if instructed
- Report to cybercrime helpline (1930)
      `,
      quiz: [
        {
          question: "What should you do if someone calls claiming to be from your bank?",
          options: [
            "Immediately provide your account details",
            "Hang up and call your bank directly",
            "Give them your PIN to verify",
            "Transfer money as instructed"
          ],
          correct: 1
        }
      ]
    },
    {
      id: 'investment-fraud',
      title: 'Investment Fraud Prevention',
      description: 'Recognize and avoid investment scams',
      category: 'financialFraud',
      difficulty: 'advanced',
      duration: '20 minutes',
      points: 200,
      content: `
**Investment Fraud Types**

Investment scams promise high returns with little or no risk, often targeting people looking to grow their money quickly.

**Common Investment Scams:**
1. **Ponzi Schemes** - Pay early investors with new investor money
2. **Cryptocurrency Scams** - Fake crypto trading platforms
3. **Stock Manipulation** - Pump and dump schemes
4. **Real Estate Scams** - Non-existent property investments
5. **Binary Options** - Fraudulent trading platforms

**Warning Signs:**
- Guaranteed high returns with no risk
- Pressure to invest immediately
- Unlicensed investment advisors
- Complex strategies you don't understand
- Difficulty withdrawing money

**Protection Strategies:**
- Research investment opportunities thoroughly
- Verify advisor credentials with regulatory bodies
- Be wary of "too good to be true" offers
- Diversify investments
- Seek independent advice
      `
    }
  ];

  const badges = [
    { id: 'first-lesson', name: 'First Steps', description: 'Completed your first lesson', icon: '🎓', earned: false },
    { id: 'phishing-expert', name: 'Phishing Expert', description: 'Mastered phishing detection', icon: '🛡️', earned: false },
    { id: 'voice-defender', name: 'Voice Defender', description: 'Expert in voice scam prevention', icon: '📞', earned: false },
    { id: 'streak-master', name: 'Streak Master', description: '7-day learning streak', icon: '🔥', earned: false }
  ];

  const startLesson = (lesson) => {
    setActiveLesson(lesson);
    setLessonProgress(0);
    setCurrentQuiz(null);
  };

  const completeLesson = (lessonId) => {
    setEducationProgress(prev => ({
      ...prev,
      completedLessons: [...prev.completedLessons, lessonId],
      totalPoints: prev.totalPoints + lessons.find(l => l.id === lessonId).points,
      currentStreak: prev.currentStreak + 1
    }));
    setActiveLesson(null);
    alert(`🎉 Lesson completed! You earned ${lessons.find(l => l.id === lessonId).points} points!`);
  };

  const startQuiz = () => {
    if (activeLesson && activeLesson.quiz) {
      setCurrentQuiz({
        questions: activeLesson.quiz,
        currentQuestion: 0,
        score: 0
      });
    }
  };

  const answerQuiz = (selectedOption) => {
    const isCorrect = selectedOption === currentQuiz.questions[currentQuiz.currentQuestion].correct;
    
    if (currentQuiz.currentQuestion + 1 < currentQuiz.questions.length) {
      setCurrentQuiz(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        score: prev.score + (isCorrect ? 1 : 0)
      }));
    } else {
      const finalScore = currentQuiz.score + (isCorrect ? 1 : 0);
      const passed = finalScore >= currentQuiz.questions.length * 0.7;
      
      if (passed) {
        completeLesson(activeLesson.id);
      } else {
        alert('Quiz failed. Please review the lesson and try again.');
        setCurrentQuiz(null);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 h-screen overflow-y-auto scrollable-content">
      {/* Header */}
      <div className="glass-elevated p-8 rounded-2xl border border-green-500/20 animate-fade-in">
        <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
          🎓 Fraud Prevention Academy
        </h2>
        <p className="text-gray-400 text-lg mb-6">
          Learn to protect yourself and others from digital fraud through interactive lessons and real-world scenarios.
        </p>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-400">{educationProgress.completedLessons.length}</div>
            <div className="text-gray-400 text-sm">Lessons Completed</div>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-green-400">{educationProgress.totalPoints}</div>
            <div className="text-gray-400 text-sm">Points Earned</div>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-orange-400">{educationProgress.currentStreak}</div>
            <div className="text-gray-400 text-sm">Day Streak</div>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-purple-400">{educationProgress.badges.length}</div>
            <div className="text-gray-400 text-sm">Badges Earned</div>
          </div>
        </div>
      </div>

      {!activeLesson ? (
        <>
          {/* Available Lessons */}
          <div className="glass-elevated p-6 rounded-xl border border-blue-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">📚 Available Lessons</h3>
            <div className="grid gap-4">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="glass-panel p-6 rounded-xl border border-gray-600/50 hover:border-blue-500/50 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">{lesson.title}</h4>
                      <p className="text-gray-400 text-sm mb-2">{lesson.description}</p>
                      <div className="flex gap-2 text-xs">
                        <span className={`px-2 py-1 rounded ${
                          lesson.difficulty === 'beginner' ? 'bg-green-600/30 text-green-300' :
                          lesson.difficulty === 'intermediate' ? 'bg-yellow-600/30 text-yellow-300' :
                          'bg-red-600/30 text-red-300'
                        }`}>
                          {lesson.difficulty}
                        </span>
                        <span className="bg-blue-600/30 text-blue-300 px-2 py-1 rounded">
                          {lesson.duration}
                        </span>
                        <span className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded">
                          {lesson.points} points
                        </span>
                      </div>
                    </div>
                    {educationProgress.completedLessons.includes(lesson.id) ? (
                      <div className="verified-badge px-3 py-1 rounded text-white">
                        ✓ Completed
                      </div>
                    ) : (
                      <button
                        onClick={() => startLesson(lesson)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all"
                      >
                        Start Lesson
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="glass-elevated p-6 rounded-xl border border-purple-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">🏆 Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge, index) => (
                <div key={badge.id} className={`glass-panel p-4 rounded-xl text-center ${
                  badge.earned ? 'border-yellow-500/50' : 'border-gray-600/50 opacity-50'
                }`}>
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className="text-white font-semibold text-sm">{badge.name}</div>
                  <div className="text-gray-400 text-xs mt-1">{badge.description}</div>
                  {badge.earned && (
                    <div className="text-yellow-400 text-xs mt-2 font-semibold">EARNED</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Active Lesson View */
        <div className="glass-elevated p-8 rounded-2xl border border-blue-500/20">
          {!currentQuiz ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">{activeLesson.title}</h3>
                <button
                  onClick={() => setActiveLesson(null)}
                  className="px-4 py-2 glass-panel border border-gray-600 text-gray-300 rounded-lg hover:border-blue-400"
                >
                  ← Back to Lessons
                </button>
              </div>

              <div className="prose prose-invert max-w-none mb-8">
                <div className="whitespace-pre-line text-gray-300 leading-relaxed">
                  {activeLesson.content}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={startQuiz}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold"
                >
                  Take Quiz ({activeLesson.quiz?.length || 0} questions)
                </button>
              </div>
            </>
          ) : (
            /* Quiz View */
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Quiz: {activeLesson.title}</h3>
                <span className="text-gray-400">
                  Question {currentQuiz.currentQuestion + 1} of {currentQuiz.questions.length}
                </span>
              </div>

              <div className="glass-panel p-6 rounded-xl mb-6">
                <h4 className="text-lg text-white mb-4">
                  {currentQuiz.questions[currentQuiz.currentQuestion].question}
                </h4>
                <div className="space-y-3">
                  {currentQuiz.questions[currentQuiz.currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => answerQuiz(index)}
                      className="w-full p-3 text-left glass-panel border border-blue-400/40 text-gray-100 rounded-lg hover:border-blue-400 hover:bg-blue-500/10 transition-all"
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <div className="text-gray-400 text-sm">
                  Score: {currentQuiz.score}/{currentQuiz.currentQuestion + 1}
                </div>
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
  module.exports = EducationSection;
}
