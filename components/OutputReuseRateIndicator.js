import { useState, useEffect } from 'react';

// Output similarity calculation using Jaccard similarity
const calculateOutputSimilarity = (output1, output2) => {
  const normalize = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  
  const words1 = new Set(normalize(output1));
  const words2 = new Set(normalize(output2));
  
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

// Output Reuse Rate Indicator Component
export const OutputReuseRateIndicator = ({ 
  similarityThreshold = 0.8, 
  timeWindow = 3600000, // 1 hour in milliseconds
  sessionId = null 
}) => {
  const [outputs, setOutputs] = useState([]);
  const [reuseRate, setReuseRate] = useState(0);
  const [usedOutputs, setUsedOutputs] = useState(0);
  const [totalOutputs, setTotalOutputs] = useState(0);
  const [recentReuses, setRecentReuses] = useState([]);
  const [outputCategories, setOutputCategories] = useState({});

  // Calculate reuse rate
  const calculateReuseRate = (outputList) => {
    if (outputList.length < 2) return { rate: 0, usedCount: 0, reuses: [] };

    let usedCount = 0;
    const reuses = [];

    for (let i = 1; i < outputList.length; i++) {
      const currentOutput = outputList[i];
      let isReused = false;
      let maxSimilarity = 0;
      let mostSimilarOutput = null;

      // Check against all previous outputs in the time window
      for (let j = 0; j < i; j++) {
        const previousOutput = outputList[j];
        const timeDiff = currentOutput.timestamp - previousOutput.timestamp;
        
        // Only consider outputs within the time window
        if (timeDiff <= timeWindow) {
          const similarity = calculateOutputSimilarity(currentOutput.content, previousOutput.content);
          
          if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            mostSimilarOutput = previousOutput;
          }
          
          if (similarity >= similarityThreshold) {
            isReused = true;
          }
        }
      }

      if (isReused) {
        usedCount++;
        reuses.push({
          id: `${currentOutput.id}-${mostSimilarOutput?.id}`,
          currentOutput: currentOutput.content,
          reusedOutput: mostSimilarOutput?.content,
          similarity: maxSimilarity,
          timestamp: currentOutput.timestamp,
          category: currentOutput.category
        });
      }
    }

    const rate = usedCount / (outputList.length - 1);
    return { rate, usedCount, reuses };
  };

  // Add new output to tracking
  const addOutput = (outputContent, category = 'general') => {
    const newOutput = {
      id: Date.now(),
      content: outputContent,
      category: category,
      timestamp: Date.now(),
      sessionId: sessionId || 'default',
      isReused: false
    };

    setOutputs(prev => {
      const updatedOutputs = [...prev, newOutput];
      const result = calculateReuseRate(updatedOutputs);
      
      setReuseRate(result.rate);
      setUsedOutputs(result.usedCount);
      setTotalOutputs(updatedOutputs.length);
      setRecentReuses(result.reuses.slice(-5)); // Keep last 5 reuses
      
      // Update category statistics
      const categories = {};
      updatedOutputs.forEach(output => {
        categories[output.category] = (categories[output.category] || 0) + 1;
      });
      setOutputCategories(categories);
      
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
          const result = calculateReuseRate(filtered);
          setReuseRate(result.rate);
          setUsedOutputs(result.usedCount);
          setTotalOutputs(filtered.length);
        }
        return filtered;
      });
    };

    const interval = setInterval(cleanup, 60000); // Clean up every minute
    return () => clearInterval(interval);
  }, [timeWindow]);

  // Simulate output generation and reuse for demo
  useEffect(() => {
    const demoOutputs = [
      { content: "The weather is sunny with 75°F temperature", category: "weather" },
      { content: "Machine learning is a subset of artificial intelligence", category: "education" },
      { content: "The weather is sunny with 75°F temperature", category: "weather" }, // Reuse
      { content: "Python is a popular programming language", category: "programming" },
      { content: "Machine learning is a subset of artificial intelligence", category: "education" }, // Reuse
      { content: "The weather is sunny with 75°F temperature", category: "weather" }, // Reuse
      { content: "React is a JavaScript library for building UIs", category: "programming" },
      { content: "Machine learning is a subset of artificial intelligence", category: "education" }, // Reuse
      { content: "The weather is sunny with 75°F temperature", category: "weather" }, // Reuse
      { content: "Next.js is a React framework for production", category: "programming" }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < demoOutputs.length) {
        addOutput(demoOutputs[index].content, demoOutputs[index].category);
        index++;
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getIndicatorColor = (rate) => {
    if (rate < 0.4) return 'bg-red-500';    // Waste: < 40%
    if (rate < 0.6) return 'bg-yellow-500'; // Moderate: 40-60%
    return 'bg-green-500'; // Efficient: ≥ 60%
  };

  const getIndicatorLabel = (rate) => {
    if (rate < 0.4) return 'Waste';
    if (rate < 0.6) return 'Moderate';
    return 'Efficient';
  };

  return (
    <div className="space-y-6">
      {/* Main Output Reuse Rate Indicator */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Output Reuse Rate (Utility)</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {(reuseRate * 100).toFixed(1)}%
            </div>
            <div className={`text-sm font-medium ${
              reuseRate < 0.4 ? 'text-red-400' :
              reuseRate < 0.6 ? 'text-yellow-400' : 'text-green-400'
            }`}>
              {getIndicatorLabel(reuseRate)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getIndicatorColor(reuseRate)}`}
            style={{ width: `${Math.min(reuseRate * 100, 100)}%` }}
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{usedOutputs}</div>
            <div className="text-xs text-white/60">Used Outputs</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{totalOutputs}</div>
            <div className="text-xs text-white/60">Total Outputs</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{similarityThreshold * 100}%</div>
            <div className="text-xs text-white/60">Similarity Threshold</div>
          </div>
        </div>

        {/* Utility Threshold Legend */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <div className="text-sm font-medium text-white/80 mb-2">Utility Thresholds:</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-white/60">Waste: &lt; 40%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-white/60">Moderate: 40-60%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-white/60">Efficient: ≥ 60%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Output Categories */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Output Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(outputCategories).map(([category, count]) => (
            <div key={category} className="text-center">
              <div className="text-lg font-bold text-white">{count}</div>
              <div className="text-xs text-white/60 capitalize">{category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reuses */}
      {recentReuses.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Output Reuses</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentReuses.map((reuse, index) => (
              <div key={reuse.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-green-300">
                    {(reuse.similarity * 100).toFixed(1)}% similar
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-white/60 bg-blue-500/20 px-2 py-1 rounded">
                      {reuse.category}
                    </span>
                    <span className="text-xs text-white/60">
                      {new Date(reuse.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-white/60 mb-1">Current Output:</div>
                    <div className="text-sm text-white bg-white/10 rounded p-2">
                      {reuse.currentOutput}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">Reused from:</div>
                    <div className="text-sm text-white/80 bg-white/5 rounded p-2">
                      {reuse.reusedOutput}
                    </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Similarity Threshold: {(similarityThreshold * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={similarityThreshold}
              onChange={(e) => {
                const newThreshold = parseFloat(e.target.value);
                // Update threshold and recalculate
                const result = calculateReuseRate(outputs);
                setReuseRate(result.rate);
                setUsedOutputs(result.usedCount);
              }}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>10%</span>
              <span>100%</span>
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
                const result = calculateReuseRate(outputs);
                setReuseRate(result.rate);
                setUsedOutputs(result.usedCount);
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

export default OutputReuseRateIndicator;
