import { useState, useEffect } from 'react';

// Estimate expected output tokens based on prompt instructions
const estimateExpectedTokens = (prompt, responseType = 'general') => {
  const promptLower = prompt.toLowerCase();
  
  // Base token estimation rules
  let baseTokens = 50; // Default base
  
  // Adjust based on prompt instructions
  if (promptLower.includes('brief') || promptLower.includes('short') || promptLower.includes('summarize')) {
    baseTokens = 20;
  } else if (promptLower.includes('detailed') || promptLower.includes('explain') || promptLower.includes('describe')) {
    baseTokens = 200;
  } else if (promptLower.includes('list') || promptLower.includes('enumerate')) {
    baseTokens = 100;
  } else if (promptLower.includes('code') || promptLower.includes('example') || promptLower.includes('show me')) {
    baseTokens = 150;
  } else if (promptLower.includes('yes') || promptLower.includes('no') || promptLower.includes('true') || promptLower.includes('false')) {
    baseTokens = 5;
  }
  
  // Adjust based on response type
  switch (responseType) {
    case 'code':
      return baseTokens * 1.5;
    case 'explanation':
      return baseTokens * 1.2;
    case 'list':
      return baseTokens * 0.8;
    case 'summary':
      return baseTokens * 0.6;
    default:
      return baseTokens;
  }
};

// Count tokens in text (simplified approximation)
const countTokens = (text) => {
  return Math.ceil(text.split(/\s+/).length * 1.3); // Rough approximation
};

// Output Excess Ratio Indicator Component
export const OutputExcessRatioIndicator = ({ 
  timeWindow = 3600000, // 1 hour in milliseconds
  sessionId = null 
}) => {
  const [outputs, setOutputs] = useState([]);
  const [avgExcessRatio, setAvgExcessRatio] = useState(1.0);
  const [totalOutputs, setTotalOutputs] = useState(0);
  const [excessDistribution, setExcessDistribution] = useState({ efficient: 0, moderate: 0, waste: 0 });
  const [recentExcesses, setRecentExcesses] = useState([]);
  const [categoryStats, setCategoryStats] = useState({});

  // Calculate excess ratio for outputs
  const calculateExcessRatio = (outputList) => {
    if (outputList.length === 0) return { avgRatio: 1.0, totalOutputs: 0, distribution: { efficient: 0, moderate: 0, waste: 0 }, excesses: [], stats: {} };

    let totalRatio = 0;
    let validOutputs = 0;
    const distribution = { efficient: 0, moderate: 0, waste: 0 };
    const excesses = [];
    const stats = {};

    outputList.forEach(output => {
      const actualTokens = output.actualTokens;
      const expectedTokens = output.expectedTokens;
      
      if (expectedTokens > 0) {
        const ratio = actualTokens / expectedTokens;
        totalRatio += ratio;
        validOutputs++;
        
        // Categorize by efficiency
        if (ratio >= 0.8 && ratio <= 1.5) {
          distribution.efficient++;
        } else if (ratio > 1.5 && ratio <= 2.0) {
          distribution.moderate++;
        } else if (ratio > 2.0) {
          distribution.waste++;
        }
        
        // Track by category
        const category = output.category || 'general';
        if (!stats[category]) {
          stats[category] = { total: 0, sum: 0, count: 0 };
        }
        stats[category].total += actualTokens;
        stats[category].sum += ratio;
        stats[category].count++;
        
        excesses.push({
          id: output.id,
          prompt: output.prompt.substring(0, 50) + '...',
          actualTokens,
          expectedTokens,
          ratio,
          category: output.category,
          timestamp: output.timestamp
        });
      }
    });

    const avgRatio = validOutputs > 0 ? totalRatio / validOutputs : 1.0;
    
    return { 
      avgRatio, 
      totalOutputs: outputList.length, 
      distribution,
      excesses: excesses.slice(-5), // Keep last 5
      stats
    };
  };

  // Add new output to tracking
  const addOutput = (prompt, actualOutput, category = 'general', responseType = 'general') => {
    const actualTokens = countTokens(actualOutput);
    const expectedTokens = estimateExpectedTokens(prompt, responseType);
    
    const newOutput = {
      id: Date.now(),
      prompt: prompt,
      actualOutput: actualOutput,
      actualTokens: actualTokens,
      expectedTokens: expectedTokens,
      category: category,
      responseType: responseType,
      timestamp: Date.now(),
      sessionId: sessionId || 'default'
    };

    setOutputs(prev => {
      const updatedOutputs = [...prev, newOutput];
      const result = calculateExcessRatio(updatedOutputs);
      
      setAvgExcessRatio(result.avgRatio);
      setTotalOutputs(result.totalOutputs);
      setExcessDistribution(result.distribution);
      setRecentExcesses(result.excesses);
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
          const result = calculateExcessRatio(filtered);
          setAvgExcessRatio(result.avgRatio);
          setTotalOutputs(result.totalOutputs);
          setExcessDistribution(result.distribution);
        }
        return filtered;
      });
    };

    const interval = setInterval(cleanup, 60000); // Clean up every minute
    return () => clearInterval(interval);
  }, [timeWindow]);

  // Simulate outputs for demo
  useEffect(() => {
    const demoOutputs = [
      { prompt: "What is the weather?", output: "The weather is sunny with 75°F temperature.", category: "weather", type: "general" },
      { prompt: "Explain machine learning briefly", output: "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.", category: "education", type: "explanation" },
      { prompt: "List 3 programming languages", output: "1. Python\n2. JavaScript\n3. Java", category: "programming", type: "list" },
      { prompt: "Show me Python code for a simple function", output: "def hello_world():\n    print('Hello, World!')\n\n# This is a simple Python function that prints a greeting message.", category: "programming", type: "code" },
      { prompt: "Summarize the benefits of AI", output: "AI offers numerous benefits including automation of repetitive tasks, improved decision-making through data analysis, enhanced customer service with chatbots, and increased efficiency in various industries.", category: "general", type: "summary" },
      { prompt: "What is 2+2?", output: "The answer is 4.", category: "math", type: "general" },
      { prompt: "Describe the process of photosynthesis in detail", output: "Photosynthesis is a complex biochemical process that occurs in plants, algae, and some bacteria. It involves the conversion of light energy into chemical energy, specifically glucose. The process occurs in two main stages: the light-dependent reactions and the light-independent reactions (Calvin cycle). In the light-dependent reactions, chlorophyll absorbs light energy, which is used to split water molecules, releasing oxygen as a byproduct and generating ATP and NADPH. The light-independent reactions use the ATP and NADPH to convert carbon dioxide from the atmosphere into glucose through a series of enzyme-catalyzed reactions. This process is crucial for life on Earth as it produces oxygen and forms the base of most food chains.", category: "education", type: "explanation" },
      { prompt: "Give me a short answer: What is Python?", output: "Python is a high-level programming language known for its simplicity and readability.", category: "programming", type: "general" }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < demoOutputs.length) {
        const output = demoOutputs[index];
        addOutput(output.prompt, output.output, output.category, output.type);
        index++;
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const getIndicatorColor = (ratio) => {
    if (ratio >= 0.8 && ratio <= 1.5) return 'bg-green-500';  // Efficient: 0.8-1.5
    if (ratio > 1.5 && ratio <= 2.0) return 'bg-yellow-500'; // Moderate: 1.5-2.0
    return 'bg-red-500'; // Waste: > 2.0
  };

  const getIndicatorLabel = (ratio) => {
    if (ratio >= 0.8 && ratio <= 1.5) return 'Efficient';
    if (ratio > 1.5 && ratio <= 2.0) return 'Moderate';
    return 'Waste';
  };

  return (
    <div className="space-y-6">
      {/* Main Output Excess Ratio Indicator */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Output Excess Ratio</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {avgExcessRatio.toFixed(2)}x
            </div>
            <div className={`text-sm font-medium ${
              avgExcessRatio >= 0.8 && avgExcessRatio <= 1.5 ? 'text-green-400' :
              avgExcessRatio > 1.5 && avgExcessRatio <= 2.0 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {getIndicatorLabel(avgExcessRatio)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getIndicatorColor(avgExcessRatio)}`}
            style={{ width: `${Math.min((avgExcessRatio / 3) * 100, 100)}%` }}
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{totalOutputs}</div>
            <div className="text-xs text-white/60">Total Outputs</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {excessDistribution.efficient + excessDistribution.moderate + excessDistribution.waste}
            </div>
            <div className="text-xs text-white/60">Analyzed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">1.0x</div>
            <div className="text-xs text-white/60">Ideal Ratio</div>
          </div>
        </div>

        {/* Efficiency Threshold Legend */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <div className="text-sm font-medium text-white/80 mb-2">Efficiency Thresholds:</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-white/60">Efficient: 0.8-1.5x</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-white/60">Moderate: 1.5-2.0x</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-white/60">Waste: &gt; 2.0x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Excess Distribution */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Excess Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{excessDistribution.efficient}</div>
            <div className="text-sm text-white/60">Efficient Outputs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{excessDistribution.moderate}</div>
            <div className="text-sm text-white/60">Moderate Outputs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{excessDistribution.waste}</div>
            <div className="text-sm text-white/60">Waste Outputs</div>
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Category Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div key={category} className="text-center">
              <div className="text-lg font-bold text-white">
                {(stats.sum / stats.count).toFixed(2)}x
              </div>
              <div className="text-xs text-white/60 capitalize">{category}</div>
              <div className="text-xs text-white/40">{stats.count} outputs</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Excesses */}
      {recentExcesses.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Output Excesses</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentExcesses.map((excess) => (
              <div key={excess.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-medium ${
                    excess.ratio >= 0.8 && excess.ratio <= 1.5 ? 'text-green-300' :
                    excess.ratio > 1.5 && excess.ratio <= 2.0 ? 'text-yellow-300' : 'text-red-300'
                  }`}>
                    {excess.ratio.toFixed(2)}x excess
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-white/60 bg-blue-500/20 px-2 py-1 rounded">
                      {excess.category}
                    </span>
                    <span className="text-xs text-white/60">
                      {new Date(excess.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-white/60 mb-1">Prompt:</div>
                    <div className="text-sm text-white bg-white/10 rounded p-2">
                      {excess.prompt}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-white/60">
                    <span>Actual: {excess.actualTokens} tokens</span>
                    <span>Expected: {excess.expectedTokens} tokens</span>
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
                const result = calculateExcessRatio(outputs);
                setAvgExcessRatio(result.avgRatio);
                setTotalOutputs(result.totalOutputs);
                setExcessDistribution(result.distribution);
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

export default OutputExcessRatioIndicator;
