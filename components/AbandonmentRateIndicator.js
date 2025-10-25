import { useState, useEffect } from 'react';

// Abandonment Rate Indicator Component
export const AbandonmentRateIndicator = ({ 
  abandonmentTimeout = 300000, // 5 minutes in milliseconds
  timeWindow = 3600000, // 1 hour in milliseconds
  sessionId = null 
}) => {
  const [outputs, setOutputs] = useState([]);
  const [abandonmentRate, setAbandonmentRate] = useState(0);
  const [abandonedOutputs, setAbandonedOutputs] = useState(0);
  const [totalOutputs, setTotalOutputs] = useState(0);
  const [recentAbandonments, setRecentAbandonments] = useState([]);
  const [abandonmentDistribution, setAbandonmentDistribution] = useState({ efficient: 0, moderate: 0, waste: 0 });
  const [categoryStats, setCategoryStats] = useState({});

  // Calculate abandonment rate
  const calculateAbandonmentRate = (outputList) => {
    if (outputList.length === 0) return { rate: 0, abandonedCount: 0, distribution: { efficient: 0, moderate: 0, waste: 0 }, abandonments: [], stats: {} };

    const now = Date.now();
    let abandonedCount = 0;
    const distribution = { efficient: 0, moderate: 0, waste: 0 };
    const abandonments = [];
    const stats = {};

    outputList.forEach(output => {
      const timeSinceOutput = now - output.timestamp;
      const isAbandoned = !output.hasInteracted && timeSinceOutput > abandonmentTimeout;
      
      if (isAbandoned) {
        abandonedCount++;
        
        // Categorize by efficiency based on time to abandonment
        if (timeSinceOutput < 600000) { // Less than 10 minutes
          distribution.efficient++;
        } else if (timeSinceOutput < 1800000) { // Less than 30 minutes
          distribution.moderate++;
        } else {
          distribution.waste++;
        }
        
        // Track by category
        const category = output.category || 'general';
        if (!stats[category]) {
          stats[category] = { total: 0, abandoned: 0 };
        }
        stats[category].total++;
        stats[category].abandoned++;
        
        abandonments.push({
          id: output.id,
          content: output.content.substring(0, 50) + '...',
          category: output.category,
          timeSinceOutput: timeSinceOutput,
          timestamp: output.timestamp
        });
      } else {
        // Track non-abandoned outputs by category
        const category = output.category || 'general';
        if (!stats[category]) {
          stats[category] = { total: 0, abandoned: 0 };
        }
        stats[category].total++;
      }
    });

    const rate = outputList.length > 0 ? abandonedCount / outputList.length : 0;
    
    return { 
      rate, 
      abandonedCount, 
      distribution,
      abandonments: abandonments.slice(-5), // Keep last 5
      stats
    };
  };

  // Add new output to tracking
  const addOutput = (content, category = 'general') => {
    const newOutput = {
      id: Date.now(),
      content: content,
      category: category,
      timestamp: Date.now(),
      hasInteracted: false,
      sessionId: sessionId || 'default'
    };

    setOutputs(prev => {
      const updatedOutputs = [...prev, newOutput];
      const result = calculateAbandonmentRate(updatedOutputs);
      
      setAbandonmentRate(result.rate);
      setAbandonedOutputs(result.abandonedCount);
      setTotalOutputs(updatedOutputs.length);
      setAbandonmentDistribution(result.distribution);
      setRecentAbandonments(result.abandonments);
      setCategoryStats(result.stats);
      
      return updatedOutputs;
    });
  };

  // Mark output as interacted
  const markAsInteracted = (outputId) => {
    setOutputs(prev => {
      const updatedOutputs = prev.map(output => 
        output.id === outputId 
          ? { ...output, hasInteracted: true }
          : output
      );
      const result = calculateAbandonmentRate(updatedOutputs);
      
      setAbandonmentRate(result.rate);
      setAbandonedOutputs(result.abandonedCount);
      setAbandonmentDistribution(result.distribution);
      setRecentAbandonments(result.abandonments);
      setCategoryStats(result.stats);
      
      return updatedOutputs;
    });
  };

  // Clean up old outputs outside time window
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      setOutputs(prev => {
        const filtered = prev.filter(output => now - output.timestamp <= timeWindow);
        if (filtered.length !== prev.length) {
          const result = calculateAbandonmentRate(filtered);
          setAbandonmentRate(result.rate);
          setAbandonedOutputs(result.abandonedCount);
          setTotalOutputs(filtered.length);
        }
        return filtered;
      });
    };

    const interval = setInterval(cleanup, 60000); // Clean up every minute
    return () => clearInterval(interval);
  }, [timeWindow, abandonmentTimeout]);

  // Simulate outputs and interactions for demo
  useEffect(() => {
    const demoOutputs = [
      { content: "The weather is sunny with 75°F temperature", category: "weather" },
      { content: "Machine learning is a subset of artificial intelligence", category: "education" },
      { content: "Python is a popular programming language", category: "programming" },
      { content: "Here's a simple Python function: def hello(): print('Hello')", category: "programming" },
      { content: "The capital of France is Paris", category: "general" },
      { content: "React is a JavaScript library for building UIs", category: "programming" },
      { content: "Photosynthesis converts light energy to chemical energy", category: "education" },
      { content: "The stock market is volatile today", category: "finance" }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < demoOutputs.length) {
        const output = demoOutputs[index];
        addOutput(output.content, output.category);
        
        // Simulate some interactions (mark some as interacted)
        if (Math.random() > 0.3) { // 70% chance of interaction
          setTimeout(() => {
            markAsInteracted(Date.now() - 1000); // Mark the most recent output
          }, Math.random() * 2000 + 1000); // Random delay 1-3 seconds
        }
        
        index++;
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getIndicatorColor = (rate) => {
    if (rate < 0.2) return 'bg-green-500';  // Efficient: < 20%
    if (rate < 0.4) return 'bg-yellow-500'; // Moderate: 20-40%
    return 'bg-red-500'; // Waste: > 40%
  };

  const getIndicatorLabel = (rate) => {
    if (rate < 0.2) return 'Efficient';
    if (rate < 0.4) return 'Moderate';
    return 'Waste';
  };

  return (
    <div className="space-y-6">
      {/* Main Abandonment Rate Indicator */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Output Abandonment Rate</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {(abandonmentRate * 100).toFixed(1)}%
            </div>
            <div className={`text-sm font-medium ${
              abandonmentRate < 0.2 ? 'text-green-400' :
              abandonmentRate < 0.4 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {getIndicatorLabel(abandonmentRate)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getIndicatorColor(abandonmentRate)}`}
            style={{ width: `${Math.min(abandonmentRate * 100, 100)}%` }}
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{abandonedOutputs}</div>
            <div className="text-xs text-white/60">Abandoned Outputs</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{totalOutputs}</div>
            <div className="text-xs text-white/60">Total Outputs</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{Math.round(abandonmentTimeout / 60000)}m</div>
            <div className="text-xs text-white/60">Timeout</div>
          </div>
        </div>

        {/* Efficiency Threshold Legend */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <div className="text-sm font-medium text-white/80 mb-2">Efficiency Thresholds:</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-white/60">Efficient: &lt; 20%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-white/60">Moderate: 20-40%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-white/60">Waste: &gt; 40%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Abandonment Distribution */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Abandonment Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{abandonmentDistribution.efficient}</div>
            <div className="text-sm text-white/60">Efficient (&lt; 10m)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{abandonmentDistribution.moderate}</div>
            <div className="text-sm text-white/60">Moderate (10-30m)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{abandonmentDistribution.waste}</div>
            <div className="text-sm text-white/60">Waste (&gt; 30m)</div>
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Category Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryStats).map(([category, stats]) => {
            const abandonmentRate = stats.total > 0 ? (stats.abandoned / stats.total) * 100 : 0;
            return (
              <div key={category} className="text-center">
                <div className="text-lg font-bold text-white">
                  {abandonmentRate.toFixed(1)}%
                </div>
                <div className="text-xs text-white/60 capitalize">{category}</div>
                <div className="text-xs text-white/40">{stats.abandoned}/{stats.total}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Abandonments */}
      {recentAbandonments.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Abandoned Outputs</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentAbandonments.map((abandonment) => (
              <div key={abandonment.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-red-300">
                    Abandoned {Math.round(abandonment.timeSinceOutput / 60000)}m ago
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-white/60 bg-blue-500/20 px-2 py-1 rounded">
                      {abandonment.category}
                    </span>
                    <span className="text-xs text-white/60">
                      {new Date(abandonment.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-white bg-white/10 rounded p-2">
                  {abandonment.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configuration Panel */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Abandonment Timeout: {Math.round(abandonmentTimeout / 60000)} minutes
            </label>
            <input
              type="range"
              min="60000"
              max="1800000"
              step="60000"
              value={abandonmentTimeout}
              onChange={(e) => {
                const newTimeout = parseInt(e.target.value);
                // Update timeout and recalculate
                const result = calculateAbandonmentRate(outputs);
                setAbandonmentRate(result.rate);
                setAbandonedOutputs(result.abandonedCount);
                setAbandonmentDistribution(result.distribution);
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>1 min</span>
              <span>30 min</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Time Window: {Math.round(timeWindow / 60000)} minutes
            </label>
            <input
              type="range"
              min="60000"
              max="3600000"
              step="60000"
              value={timeWindow}
              onChange={(e) => {
                const newWindow = parseInt(e.target.value);
                // Update time window and recalculate
                const result = calculateAbandonmentRate(outputs);
                setAbandonmentRate(result.rate);
                setAbandonedOutputs(result.abandonedCount);
                setAbandonmentDistribution(result.distribution);
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>1 min</span>
              <span>60 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbandonmentRateIndicator;
