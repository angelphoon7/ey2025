import { useState, useEffect } from 'react';

// Text similarity calculation using Jaccard similarity
const calculateSimilarity = (text1, text2) => {
  const normalize = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  
  const words1 = new Set(normalize(text1));
  const words2 = new Set(normalize(text2));
  
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

// Redundancy Rate Indicator Component
export const RedundancyRateIndicator = ({ 
  similarityThreshold = 0.7, 
  timeWindow = 3600000, // 1 hour in milliseconds
  sessionId = null 
}) => {
  const [prompts, setPrompts] = useState([]);
  const [redundancyRate, setRedundancyRate] = useState(0);
  const [similarPrompts, setSimilarPrompts] = useState(0);
  const [totalPrompts, setTotalPrompts] = useState(0);
  const [recentSimilarities, setRecentSimilarities] = useState([]);

  // Calculate redundancy rate
  const calculateRedundancyRate = (promptList) => {
    if (promptList.length < 2) return { rate: 0, similarCount: 0, similarities: [] };

    let similarCount = 0;
    const similarities = [];

    for (let i = 1; i < promptList.length; i++) {
      const currentPrompt = promptList[i];
      let isSimilar = false;
      let maxSimilarity = 0;
      let mostSimilarPrompt = null;

      // Check against all previous prompts in the time window
      for (let j = 0; j < i; j++) {
        const previousPrompt = promptList[j];
        const timeDiff = currentPrompt.timestamp - previousPrompt.timestamp;
        
        // Only consider prompts within the time window
        if (timeDiff <= timeWindow) {
          const similarity = calculateSimilarity(currentPrompt.text, previousPrompt.text);
          
          if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            mostSimilarPrompt = previousPrompt;
          }
          
          if (similarity >= similarityThreshold) {
            isSimilar = true;
          }
        }
      }

      if (isSimilar) {
        similarCount++;
        similarities.push({
          id: `${currentPrompt.id}-${mostSimilarPrompt?.id}`,
          currentPrompt: currentPrompt.text,
          similarPrompt: mostSimilarPrompt?.text,
          similarity: maxSimilarity,
          timestamp: currentPrompt.timestamp
        });
      }
    }

    const rate = similarCount / (promptList.length - 1);
    return { rate, similarCount, similarities };
  };

  // Add new prompt to tracking
  const addPrompt = (promptText) => {
    const newPrompt = {
      id: Date.now(),
      text: promptText,
      timestamp: Date.now(),
      sessionId: sessionId || 'default'
    };

    setPrompts(prev => {
      const updatedPrompts = [...prev, newPrompt];
      const result = calculateRedundancyRate(updatedPrompts);
      
      setRedundancyRate(result.rate);
      setSimilarPrompts(result.similarCount);
      setTotalPrompts(updatedPrompts.length);
      setRecentSimilarities(result.similarities?.slice(-5) || []); // Keep last 5 similarities
      
      return updatedPrompts;
    });
  };

  // Clean up old prompts outside time window
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      setPrompts(prev => {
        const filtered = prev.filter(prompt => now - prompt.timestamp <= timeWindow);
        if (filtered.length !== prev.length) {
          const result = calculateRedundancyRate(filtered);
          setRedundancyRate(result.rate);
          setSimilarPrompts(result.similarCount);
          setTotalPrompts(filtered.length);
        }
        return filtered;
      });
    };

    const interval = setInterval(cleanup, 60000); // Clean up every minute
    return () => clearInterval(interval);
  }, [timeWindow]);

  // Simulate prompt additions for demo
  useEffect(() => {
    const demoPrompts = [
      "What is the weather like today?",
      "Can you help me with my homework?",
      "What is the weather like today?", // Similar to first
      "Please explain machine learning concepts",
      "Can you help me with my homework?", // Similar to second
      "What's the weather today?", // Similar to first
      "Tell me about artificial intelligence",
      "Help me with my assignment", // Similar to second
      "What's the current weather?", // Similar to first
      "Explain deep learning algorithms"
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < demoPrompts.length) {
        addPrompt(demoPrompts[index]);
        index++;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getIndicatorColor = (rate) => {
    if (rate < 0.2) return 'bg-green-500';  // Efficient: < 20%
    if (rate < 0.35) return 'bg-yellow-500'; // Moderate: 20-35%
    return 'bg-red-500'; // Waste: > 35%
  };

  const getIndicatorLabel = (rate) => {
    if (rate < 0.2) return 'Efficient';
    if (rate < 0.35) return 'Moderate';
    return 'Waste';
  };

  return (
    <div className="space-y-6">
      {/* Main Redundancy Rate Indicator */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Prompt Redundancy Rate</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {(redundancyRate * 100).toFixed(1)}%
            </div>
            <div className={`text-sm font-medium ${
              redundancyRate < 0.2 ? 'text-green-400' :
              redundancyRate < 0.35 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {getIndicatorLabel(redundancyRate)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getIndicatorColor(redundancyRate)}`}
            style={{ width: `${Math.min(redundancyRate * 100, 100)}%` }}
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{similarPrompts}</div>
            <div className="text-xs text-white/60">Similar Prompts</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{totalPrompts}</div>
            <div className="text-xs text-white/60">Total Prompts</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{similarityThreshold * 100}%</div>
            <div className="text-xs text-white/60">Similarity Threshold</div>
          </div>
        </div>

        {/* Threshold Legend */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <div className="text-sm font-medium text-white/80 mb-2">Efficiency Thresholds:</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-white/60">Efficient: &lt; 20%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-white/60">Moderate: 20-35%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-white/60">Waste: &gt; 35%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Similarities */}
      {recentSimilarities.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Similar Prompts</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentSimilarities.map((similarity, index) => (
              <div key={similarity.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-red-300">
                    {(similarity.similarity * 100).toFixed(1)}% similar
                  </span>
                  <span className="text-xs text-white/60">
                    {new Date(similarity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-white/60 mb-1">Current Prompt:</div>
                    <div className="text-sm text-white bg-white/10 rounded p-2">
                      {similarity.currentPrompt}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">Similar to:</div>
                    <div className="text-sm text-white/80 bg-white/5 rounded p-2">
                      {similarity.similarPrompt}
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
                const result = calculateRedundancyRate(prompts);
                setRedundancyRate(result.rate);
                setSimilarPrompts(result.similarCount);
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
                const result = calculateRedundancyRate(prompts);
                setRedundancyRate(result.rate);
                setSimilarPrompts(result.similarCount);
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

export default RedundancyRateIndicator;
