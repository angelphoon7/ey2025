import { useState, useEffect } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import AIAnalytics from '../components/AIAnalytics';
// Removed interfaces: Redundancy, Utility, Refinement, Excess, Abandonment, Latency
// import RedundancyRateIndicator from '../components/RedundancyRateIndicator';
// import OutputReuseRateIndicator from '../components/OutputReuseRateIndicator';
// import RefinementLoopsIndicator from '../components/RefinementLoopsIndicator';
// import OutputExcessRatioIndicator from '../components/OutputExcessRatioIndicator';
// import AbandonmentRateIndicator from '../components/AbandonmentRateIndicator';
// import LatencyPerformanceIndicator from '../components/LatencyPerformanceIndicator';
// import OverallEfficiencyScoreIndicator from '../components/OverallEfficiencyScoreIndicator';
import RealTimeAnalysis from '../components/RealTimeAnalysis';
import AwarenessDashboard from '../components/AwarenessDashboard';
// import SustainabilityTable from '../components/SustainabilityTable';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// AI Waste Monitor Components
const WasteIndicator = ({ level, label, value, max = 100 }) => {
  const percentage = (value / max) * 100;
  const getColor = () => {
    if (percentage < 20) return 'bg-green-500';  // Efficient: < 20%
    if (percentage < 35) return 'bg-yellow-500'; // Moderate: 20-35%
    return 'bg-red-500'; // Waste: > 35%
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-white/80">{label}</span>
        <span className="text-sm font-bold text-white">{value}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

const AITokenTracker = () => {
  const [metrics, setMetrics] = useState({
    totalTokens: 0,
    wastedTokens: 0,
    repeatedPrompts: 0,
    efficiency: 85,
    costSavings: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        totalTokens: prev.totalTokens + Math.floor(Math.random() * 1000),
        wastedTokens: prev.wastedTokens + Math.floor(Math.random() * 50),
        repeatedPrompts: prev.repeatedPrompts + Math.floor(Math.random() * 3),
        efficiency: Math.max(60, prev.efficiency + (Math.random() - 0.5) * 5),
        costSavings: prev.costSavings + Math.floor(Math.random() * 10)
      }));

      // Add new activity
      const activities = [
        "Detected redundant prompt pattern",
        "Optimized token usage by 15%",
        "Identified wasteful API call",
        "Learned new efficiency pattern",
        "Prevented duplicate request"
      ];
      
      setRecentActivity(prev => [
        {
          id: Date.now(),
          message: activities[Math.floor(Math.random() * activities.length)],
          timestamp: new Date(),
          type: Math.random() > 0.5 ? 'optimization' : 'detection'
        },
        ...prev.slice(0, 9)
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <WasteIndicator 
          label="Total Tokens" 
          value={metrics.totalTokens.toLocaleString()} 
          max={100000}
        />
        <WasteIndicator 
          label="Wasted Tokens" 
          value={metrics.wastedTokens.toLocaleString()} 
          max={10000}
        />
        <WasteIndicator 
          label="Efficiency %" 
          value={`${metrics.efficiency.toFixed(1)}%`} 
          max={100}
        />
        <WasteIndicator 
          label="Cost Savings" 
          value={`$${metrics.costSavings}`} 
          max={1000}
        />
      </div>

      {/* Removed embedded Redundancy indicator per request */}

      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Real-time AI Activity</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {recentActivity.map((activity) => (
            <div 
              key={activity.id}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                activity.type === 'optimization' 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-blue-500/20 border border-blue-500/30'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'optimization' ? 'bg-green-400' : 'bg-blue-400'
              }`} />
              <div className="flex-1">
                <p className="text-sm text-white">{activity.message}</p>
                <p className="text-xs text-white/60">
                  {activity.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LearningInsights = () => {
  const [insights, setInsights] = useState([
    {
      title: "Pattern Recognition",
      description: "AI has learned to identify 15 common wasteful prompt patterns",
      confidence: 94,
      impact: "High"
    },
    {
      title: "Token Optimization",
      description: "Automatically suggests shorter, more efficient prompts",
      confidence: 87,
      impact: "Medium"
    },
    {
      title: "Duplicate Detection",
      description: "Prevents repeated API calls with 98% accuracy",
      confidence: 98,
      impact: "High"
    }
  ]);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">AI Learning Insights</h3>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-white">{insight.title}</h4>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                insight.impact === 'High' ? 'bg-red-500/20 text-red-300' :
                insight.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-green-500/20 text-green-300'
              }`}>
                {insight.impact}
              </span>
            </div>
            <p className="text-sm text-white/80 mb-2">{insight.description}</p>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-white/60">Confidence:</span>
              <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-blue-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${insight.confidence}%` }}
                />
              </div>
              <span className="text-xs text-white/60">{insight.confidence}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('monitor');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [impactEstimate, setImpactEstimate] = useState(null);

  const estimateImpact = (text) => {
    const approxTokens = Math.max(1, Math.ceil(text.trim().length / 4));
    // Simple playful equivalence multiplier for demo purposes
    const treesEquivalent = Math.max(1, Math.ceil(approxTokens / 2000));
    const co2KgEquivalent = +(approxTokens * 0.0005).toFixed(3);
    return { tokens: approxTokens, trees: treesEquivalent, co2Kg: co2KgEquivalent };
  };

  const attemptSend = () => {
    if (!inputMessage.trim() || isLoading) return;
    const estimation = estimateImpact(inputMessage);
    setImpactEstimate(estimation);
    setShowConfirm(true);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Prepare conversation history for the API
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          conversationHistory: conversationHistory
        }),
      });

      const data = await response.json();
      
      if (data.success && data.response) {
        const aiMessage = {
          id: Date.now() + 1,
          text: data.response,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white`}
    >
      {/* Header */}
      <header className="border-b border-white/20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-bold">AI Waste Monitor</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('monitor')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'monitor' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Home Dashboard
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'analytics' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'summary' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                Summary
              </button>
              
              {/* Removed tabs: Redundancy, Utility, Refinement, Excess, Abandonment, Latency */}
              {/* Efficiency tab removed per request */}
              
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'monitor' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Home Dashboard</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Real-time monitor with executive summary, live analysis, and key metrics
              </p>
            </div>
            <AITokenTracker />

            {/* Real-Time AI Analysis embedded on Home */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Real-Time AI Analysis</h3>
              <RealTimeAnalysis />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Advanced AI Analytics</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Deep insights into AI usage patterns, waste detection, and optimization opportunities
              </p>
            </div>
            <AIAnalytics />
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Executive Summary</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Weekly awareness, impact equivalents, compute score, think mode stats, achievements and challenge
              </p>
            </div>
            {/* Export PDF button */}
            <div className="flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
              >
                Export PDF
              </button>
            </div>

            {/* Printable area */}
            <div id="summary-report" className="space-y-8">
              <AwarenessDashboard />
            </div>

            {/* Print styles: show only summary-report when printing */}
            <style jsx global>{`
              @media print {
                body * { visibility: hidden; }
                #summary-report, #summary-report * { visibility: visible; }
                #summary-report { position: absolute; left: 0; top: 0; width: 100%; }
              }
            `}</style>
          </div>
        )}


        {/* Removed tab contents: Redundancy, Utility, Refinement, Excess, Abandonment, Latency */}

        {/* Efficiency view removed per request */}

        
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 bg-white/5 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/60 text-sm">
              Powered by SAP BTP • Sustainable AI Future
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Documentation
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                API
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Box */}
      <div className="fixed bottom-4 right-4 z-50">
        {chatOpen ? (
          <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl shadow-2xl border border-white/20 overflow-hidden w-96 h-[500px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-white/10 backdrop-blur-sm p-4 flex items-center justify-between border-b border-white/20">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">AI</span>
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">AI Assistant</div>
                  <div className="text-white/60 text-xs">Online</div>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-transparent to-black/20">
              {messages.length === 0 && (
                <div className="text-center text-white/60 text-sm py-8">
                  👋 Hi! I'm here to help you with AI efficiency tips and sustainability information.
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.isError
                        ? 'bg-red-900/30 text-red-200 border border-red-500/30'
                        : msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/20 bg-white/5 backdrop-blur-sm">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && attemptSend()}
                  placeholder={isLoading ? "AI is thinking..." : "Type a message..."}
                  disabled={isLoading}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 text-sm focus:outline-none focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={attemptSend}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors"
                >
                  {isLoading ? (
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setChatOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-5 shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && impactEstimate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowConfirm(false)} />
          <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-purple-950 via-blue-950 to-indigo-950 border border-white/20 rounded-2xl shadow-2xl p-6">
            <h4 className="text-lg font-semibold text-white mb-2">Proceed with this prompt?</h4>
            <p className="text-white/80 text-sm mb-4">
              Estimated usage: <span className="font-semibold text-white">{impactEstimate.tokens}</span> tokens.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
              <p className="text-sm text-white/90">
                Environmental impact equivalent:{" "}
                <span className="font-semibold text-white">
                  {impactEstimate.trees} trees
                </span>{" "}
                or approximately{" "}
                <span className="font-semibold text-white">{impactEstimate.co2Kg} kg CO₂</span>.
              </p>
              <p className="text-xs text-white/60 mt-2">
                This is a playful estimate, not a precise measurement.
              </p>
            </div>
            <p className="text-sm text-white mb-5">
              “You will kill {impactEstimate.trees} trees with this prompt. Proceed?”
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  const savedMsg = {
                    id: Date.now() + 2,
                    text: `Prompt cancelled. You avoided ~${impactEstimate.tokens} tokens (~${impactEstimate.co2Kg} kg CO₂, ~${impactEstimate.trees} trees equivalent). Consider refining your prompt to be shorter or more specific.`,
                    sender: 'ai',
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, savedMsg]);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
              >
                No, refine
              </button>
              <button
                onClick={async () => {
                  setShowConfirm(false);
                  await sendMessage();
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Yes, send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
