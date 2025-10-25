import { useState, useEffect } from 'react';

// Classify prompt type based on content
const classifyPromptType = (prompt) => {
  const promptLower = prompt.toLowerCase();
  
  if (promptLower.includes('code') || promptLower.includes('function') || promptLower.includes('program')) {
    return 'code';
  } else if (promptLower.includes('explain') || promptLower.includes('describe') || promptLower.includes('how')) {
    return 'explanation';
  } else if (promptLower.includes('list') || promptLower.includes('enumerate') || promptLower.includes('show me')) {
    return 'list';
  } else if (promptLower.includes('summarize') || promptLower.includes('brief') || promptLower.includes('short')) {
    return 'summary';
  } else if (promptLower.includes('yes') || promptLower.includes('no') || promptLower.includes('true') || promptLower.includes('false')) {
    return 'boolean';
  } else {
    return 'general';
  }
};

// Estimate token count (simplified approximation)
const estimateTokens = (text) => {
  return Math.ceil(text.split(/\s+/).length * 1.3);
};

// Latency Performance Indicator Component
export const LatencyPerformanceIndicator = ({ 
  timeWindow = 3600000, // 1 hour in milliseconds
  sessionId = null 
}) => {
  const [interactions, setInteractions] = useState([]);
  const [avgLatencyPerToken, setAvgLatencyPerToken] = useState(0);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [latencyDistribution, setLatencyDistribution] = useState({ efficient: 0, moderate: 0, waste: 0 });
  const [recentLatencies, setRecentLatencies] = useState([]);
  const [typeStats, setTypeStats] = useState({});
  const [medianLatencies, setMedianLatencies] = useState({});

  // Calculate latency metrics
  const calculateLatencyMetrics = (interactionList) => {
    if (interactionList.length === 0) return { 
      avgLatencyPerToken: 0, 
      totalInteractions: 0, 
      distribution: { efficient: 0, moderate: 0, waste: 0 }, 
      latencies: [], 
      typeStats: {},
      medianLatencies: {}
    };

    const distribution = { efficient: 0, moderate: 0, waste: 0 };
    const latencies = [];
    const typeStats = {};
    const typeLatencies = {};

    // Group interactions by type for median calculation
    interactionList.forEach(interaction => {
      const type = interaction.promptType;
      if (!typeLatencies[type]) {
        typeLatencies[type] = [];
      }
      typeLatencies[type].push(interaction.latencyPerToken);
    });

    // Calculate medians for each type
    const medianLatencies = {};
    Object.keys(typeLatencies).forEach(type => {
      const latencies = typeLatencies[type].sort((a, b) => a - b);
      const median = latencies[Math.floor(latencies.length / 2)];
      medianLatencies[type] = median;
    });

    // Analyze each interaction
    interactionList.forEach(interaction => {
      const latencyPerToken = interaction.latencyPerToken;
      const type = interaction.promptType;
      const medianForType = medianLatencies[type] || 50; // Default median
      
      // Categorize by efficiency
      if (latencyPerToken <= 50) {
        distribution.efficient++;
      } else if (latencyPerToken <= 100) {
        distribution.moderate++;
      } else if (latencyPerToken > medianForType * 2) {
        distribution.waste++;
      } else {
        distribution.moderate++;
      }
      
      // Track by type
      if (!typeStats[type]) {
        typeStats[type] = { total: 0, sum: 0, count: 0 };
      }
      typeStats[type].total += interaction.latencyMs;
      typeStats[type].sum += latencyPerToken;
      typeStats[type].count++;
      
      latencies.push({
        id: interaction.id,
        prompt: interaction.prompt.substring(0, 50) + '...',
        promptType: type,
        latencyMs: interaction.latencyMs,
        latencyPerToken: latencyPerToken,
        tokens: interaction.tokens,
        timestamp: interaction.timestamp,
        isSlow: latencyPerToken > medianForType * 2
      });
    });

    const avgLatencyPerToken = interactionList.length > 0 
      ? interactionList.reduce((sum, i) => sum + i.latencyPerToken, 0) / interactionList.length 
      : 0;
    
    return { 
      avgLatencyPerToken, 
      totalInteractions: interactionList.length, 
      distribution,
      latencies: latencies.slice(-5), // Keep last 5
      typeStats,
      medianLatencies
    };
  };

  // Add new interaction to tracking
  const addInteraction = (prompt, response, latencyMs) => {
    const tokens = estimateTokens(prompt);
    const latencyPerToken = tokens > 0 ? latencyMs / tokens : latencyMs;
    const promptType = classifyPromptType(prompt);
    
    const newInteraction = {
      id: Date.now(),
      prompt: prompt,
      response: response,
      latencyMs: latencyMs,
      latencyPerToken: latencyPerToken,
      tokens: tokens,
      promptType: promptType,
      timestamp: Date.now(),
      sessionId: sessionId || 'default'
    };

    setInteractions(prev => {
      const updatedInteractions = [...prev, newInteraction];
      const result = calculateLatencyMetrics(updatedInteractions);
      
      setAvgLatencyPerToken(result.avgLatencyPerToken);
      setTotalInteractions(result.totalInteractions);
      setLatencyDistribution(result.distribution);
      setRecentLatencies(result.latencies);
      setTypeStats(result.typeStats);
      setMedianLatencies(result.medianLatencies);
      
      return updatedInteractions;
    });
  };

  // Clean up old interactions outside time window
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      setInteractions(prev => {
        const filtered = prev.filter(interaction => now - interaction.timestamp <= timeWindow);
        if (filtered.length !== prev.length) {
          const result = calculateLatencyMetrics(filtered);
          setAvgLatencyPerToken(result.avgLatencyPerToken);
          setTotalInteractions(result.totalInteractions);
          setLatencyDistribution(result.distribution);
        }
        return filtered;
      });
    };

    const interval = setInterval(cleanup, 60000); // Clean up every minute
    return () => clearInterval(interval);
  }, [timeWindow]);

  // Simulate interactions for demo
  useEffect(() => {
    const demoInteractions = [
      { prompt: "What is the weather?", response: "The weather is sunny", latency: 800 },
      { prompt: "Explain machine learning in detail", response: "Machine learning is...", latency: 2500 },
      { prompt: "List 3 programming languages", response: "1. Python 2. JavaScript 3. Java", latency: 1200 },
      { prompt: "Show me Python code for a function", response: "def hello(): print('Hello')", latency: 1800 },
      { prompt: "Summarize the benefits of AI", response: "AI offers numerous benefits...", latency: 1500 },
      { prompt: "What is 2+2?", response: "4", latency: 300 },
      { prompt: "Describe photosynthesis in detail", response: "Photosynthesis is a complex process...", latency: 3200 },
      { prompt: "Give me a short answer: What is Python?", response: "Python is a programming language", latency: 600 }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < demoInteractions.length) {
        const interaction = demoInteractions[index];
        addInteraction(interaction.prompt, interaction.response, interaction.latency);
        index++;
      }
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const getIndicatorColor = (latencyPerToken) => {
    if (latencyPerToken <= 50) return 'bg-green-500';  // Efficient: ≤ 50 ms/token
    if (latencyPerToken <= 100) return 'bg-yellow-500'; // Moderate: 50-100 ms/token
    return 'bg-red-500'; // Waste: > 100 ms/token
  };

  const getIndicatorLabel = (latencyPerToken) => {
    if (latencyPerToken <= 50) return 'Efficient';
    if (latencyPerToken <= 100) return 'Moderate';
    return 'Waste';
  };

  return (
    <div className="space-y-6">
      {/* Main Latency Performance Indicator */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Latency Performance</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {avgLatencyPerToken.toFixed(1)} ms/token
            </div>
            <div className={`text-sm font-medium ${
              avgLatencyPerToken <= 50 ? 'text-green-400' :
              avgLatencyPerToken <= 100 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {getIndicatorLabel(avgLatencyPerToken)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getIndicatorColor(avgLatencyPerToken)}`}
            style={{ width: `${Math.min((avgLatencyPerToken / 200) * 100, 100)}%` }}
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{totalInteractions}</div>
            <div className="text-xs text-white/60">Total Interactions</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">50 ms</div>
            <div className="text-xs text-white/60">Target per Token</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">1000 ms</div>
            <div className="text-xs text-white/60">Max Total</div>
          </div>
        </div>

        {/* Performance Threshold Legend */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <div className="text-sm font-medium text-white/80 mb-2">Performance Thresholds:</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-white/60">Efficient: ≤ 50 ms/token</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-white/60">Moderate: 50-100 ms/token</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-white/60">Waste: &gt; 100 ms/token</span>
            </div>
          </div>
        </div>
      </div>

      {/* Latency Distribution */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Latency Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{latencyDistribution.efficient}</div>
            <div className="text-sm text-white/60">Efficient Responses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{latencyDistribution.moderate}</div>
            <div className="text-sm text-white/60">Moderate Responses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{latencyDistribution.waste}</div>
            <div className="text-sm text-white/60">Slow Responses</div>
          </div>
        </div>
      </div>

      {/* Type Statistics */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Performance by Prompt Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(typeStats).map(([type, stats]) => {
            const avgLatency = stats.count > 0 ? stats.sum / stats.count : 0;
            const medianLatency = medianLatencies[type] || 50;
            return (
              <div key={type} className="text-center">
                <div className="text-lg font-bold text-white">
                  {avgLatency.toFixed(1)} ms/token
                </div>
                <div className="text-xs text-white/60 capitalize">{type}</div>
                <div className="text-xs text-white/40">Median: {medianLatency.toFixed(1)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Latencies */}
      {recentLatencies.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Performance Issues</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentLatencies.map((latency) => (
              <div key={latency.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-medium ${
                    latency.latencyPerToken <= 50 ? 'text-green-300' :
                    latency.latencyPerToken <= 100 ? 'text-yellow-300' : 'text-red-300'
                  }`}>
                    {latency.latencyPerToken.toFixed(1)} ms/token
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-white/60 bg-blue-500/20 px-2 py-1 rounded">
                      {latency.promptType}
                    </span>
                    <span className="text-xs text-white/60">
                      {latency.latencyMs}ms total
                    </span>
                    {latency.isSlow && (
                      <span className="text-xs text-red-300 bg-red-500/20 px-2 py-1 rounded">
                        Slow
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-white/60 mb-1">Prompt:</div>
                    <div className="text-sm text-white bg-white/10 rounded p-2">
                      {latency.prompt}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-white/60">
                    <span>{latency.tokens} tokens</span>
                    <span>{new Date(latency.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configuration Panel */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
        <div className="grid grid-cols-1 gap-4">
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
                const result = calculateLatencyMetrics(interactions);
                setAvgLatencyPerToken(result.avgLatencyPerToken);
                setTotalInteractions(result.totalInteractions);
                setLatencyDistribution(result.distribution);
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

export default LatencyPerformanceIndicator;
