import { useState, useEffect } from 'react';

// Topic similarity calculation using Jaccard similarity
const calculateTopicSimilarity = (text1, text2) => {
  const normalize = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  
  const words1 = new Set(normalize(text1));
  const words2 = new Set(normalize(text2));
  
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

// Refinement Loops Indicator Component
export const RefinementLoopsIndicator = ({ 
  topicSimilarityThreshold = 0.6, 
  timeWindow = 3600000, // 1 hour in milliseconds
  sessionId = null 
}) => {
  const [interactions, setInteractions] = useState([]);
  const [topics, setTopics] = useState({});
  const [avgRefinementLoops, setAvgRefinementLoops] = useState(0);
  const [totalTopics, setTotalTopics] = useState(0);
  const [completedTopics, setCompletedTopics] = useState(0);
  const [recentRefinements, setRecentRefinements] = useState([]);
  const [loopDistribution, setLoopDistribution] = useState({});

  // Calculate refinement loops for each topic
  const calculateRefinementLoops = (interactionList) => {
    if (interactionList.length < 2) return { avgLoops: 0, totalTopics: 0, completedTopics: 0, refinements: [], distribution: {} };

    const topicGroups = {};
    const refinements = [];
    let totalLoops = 0;
    let completedTopicCount = 0;
    const distribution = { efficient: 0, moderate: 0, waste: 0 };

    // Group interactions by topic
    interactionList.forEach((interaction, index) => {
      let assignedTopic = null;
      
      // Find similar topic or create new one
      for (const [topicId, topic] of Object.entries(topicGroups)) {
        if (calculateTopicSimilarity(interaction.prompt, topic.lastPrompt) >= topicSimilarityThreshold) {
          assignedTopic = topicId;
          break;
        }
      }

      if (!assignedTopic) {
        // Create new topic
        const newTopicId = `topic_${Date.now()}_${index}`;
        topicGroups[newTopicId] = {
          id: newTopicId,
          interactions: [interaction],
          lastPrompt: interaction.prompt,
          startTime: interaction.timestamp,
          isCompleted: false
        };
        assignedTopic = newTopicId;
      } else {
        // Add to existing topic
        topicGroups[assignedTopic].interactions.push(interaction);
        topicGroups[assignedTopic].lastPrompt = interaction.prompt;
      }
    });

    // Calculate loops for each topic
    Object.values(topicGroups).forEach(topic => {
      const loopCount = topic.interactions.length - 1; // Subtract 1 for initial prompt
      totalLoops += loopCount;
      
      if (topic.interactions.length > 1) {
        completedTopicCount++;
        
        // Categorize by efficiency
        if (loopCount <= 2) {
          distribution.efficient++;
        } else if (loopCount <= 4) {
          distribution.moderate++;
        } else {
          distribution.waste++;
        }

        refinements.push({
          id: topic.id,
          topic: topic.interactions[0].prompt.substring(0, 50) + '...',
          loopCount: loopCount,
          interactions: topic.interactions.length,
          startTime: topic.startTime,
          endTime: topic.interactions[topic.interactions.length - 1].timestamp,
          isCompleted: true
        });
      }
    });

    const avgLoops = completedTopicCount > 0 ? totalLoops / completedTopicCount : 0;
    
    return { 
      avgLoops, 
      totalTopics: Object.keys(topicGroups).length, 
      completedTopics: completedTopicCount,
      refinements: refinements.slice(-5), // Keep last 5 refinements
      distribution
    };
  };

  // Add new interaction to tracking
  const addInteraction = (prompt, response = null, isAccepted = false) => {
    const newInteraction = {
      id: Date.now(),
      prompt: prompt,
      response: response,
      isAccepted: isAccepted,
      timestamp: Date.now(),
      sessionId: sessionId || 'default'
    };

    setInteractions(prev => {
      const updatedInteractions = [...prev, newInteraction];
      const result = calculateRefinementLoops(updatedInteractions);
      
      setAvgRefinementLoops(result.avgLoops);
      setTotalTopics(result.totalTopics);
      setCompletedTopics(result.completedTopics);
      setRecentRefinements(result.refinements);
      setLoopDistribution(result.distribution);
      
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
          const result = calculateRefinementLoops(filtered);
          setAvgRefinementLoops(result.avgLoops);
          setTotalTopics(result.totalTopics);
          setCompletedTopics(result.completedTopics);
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
      { prompt: "Explain machine learning", response: "ML is a subset of AI...", isAccepted: false },
      { prompt: "Can you explain machine learning in more detail?", response: "Machine learning is...", isAccepted: false },
      { prompt: "Give me a simple example of machine learning", response: "Here's a simple example...", isAccepted: true },
      { prompt: "What is the weather today?", response: "The weather is sunny...", isAccepted: true },
      { prompt: "How does Python work?", response: "Python is a programming language...", isAccepted: false },
      { prompt: "Can you explain Python programming better?", response: "Python is a high-level language...", isAccepted: false },
      { prompt: "Show me Python syntax examples", response: "Here are Python examples...", isAccepted: false },
      { prompt: "Give me basic Python code", response: "Here's basic Python code...", isAccepted: false },
      { prompt: "I need Python for data science", response: "Python for data science...", isAccepted: true },
      { prompt: "What's the capital of France?", response: "The capital of France is Paris", isAccepted: true }
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < demoInteractions.length) {
        const interaction = demoInteractions[index];
        addInteraction(interaction.prompt, interaction.response, interaction.isAccepted);
        index++;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getIndicatorColor = (loops) => {
    if (loops <= 2) return 'bg-green-500';  // Efficient: ≤ 2 loops
    if (loops <= 4) return 'bg-yellow-500'; // Moderate: 3-4 loops
    return 'bg-red-500'; // Waste: > 4 loops
  };

  const getIndicatorLabel = (loops) => {
    if (loops <= 2) return 'Efficient';
    if (loops <= 4) return 'Moderate';
    return 'Waste';
  };

  return (
    <div className="space-y-6">
      {/* Main Refinement Loops Indicator */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Average Refinement Loops</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {avgRefinementLoops.toFixed(1)}
            </div>
            <div className={`text-sm font-medium ${
              avgRefinementLoops <= 2 ? 'text-green-400' :
              avgRefinementLoops <= 4 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {getIndicatorLabel(avgRefinementLoops)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${getIndicatorColor(avgRefinementLoops)}`}
            style={{ width: `${Math.min((avgRefinementLoops / 6) * 100, 100)}%` }}
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{completedTopics}</div>
            <div className="text-xs text-white/60">Completed Topics</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{totalTopics}</div>
            <div className="text-xs text-white/60">Total Topics</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{topicSimilarityThreshold * 100}%</div>
            <div className="text-xs text-white/60">Topic Threshold</div>
          </div>
        </div>

        {/* Efficiency Threshold Legend */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <div className="text-sm font-medium text-white/80 mb-2">Efficiency Thresholds:</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-white/60">Efficient: ≤ 2</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-white/60">Moderate: 3-4</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-white/60">Waste: &gt; 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loop Distribution */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Loop Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{loopDistribution.efficient || 0}</div>
            <div className="text-sm text-white/60">Efficient Topics</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{loopDistribution.moderate || 0}</div>
            <div className="text-sm text-white/60">Moderate Topics</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{loopDistribution.waste || 0}</div>
            <div className="text-sm text-white/60">Waste Topics</div>
          </div>
        </div>
      </div>

      {/* Recent Refinements */}
      {recentRefinements.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Refinement Loops</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentRefinements.map((refinement) => (
              <div key={refinement.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-medium ${
                    refinement.loopCount <= 2 ? 'text-green-300' :
                    refinement.loopCount <= 4 ? 'text-yellow-300' : 'text-red-300'
                  }`}>
                    {refinement.loopCount} loops
                  </span>
                  <span className="text-xs text-white/60">
                    {new Date(refinement.endTime).toLocaleTimeString()}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs text-white/60 mb-1">Topic:</div>
                    <div className="text-sm text-white bg-white/10 rounded p-2">
                      {refinement.topic}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-white/60">
                    <span>{refinement.interactions} interactions</span>
                    <span>{Math.round((refinement.endTime - refinement.startTime) / 1000)}s duration</span>
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
              Topic Similarity Threshold: {(topicSimilarityThreshold * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={topicSimilarityThreshold}
              onChange={(e) => {
                const newThreshold = parseFloat(e.target.value);
                // Update threshold and recalculate
                const result = calculateRefinementLoops(interactions);
                setAvgRefinementLoops(result.avgLoops);
                setCompletedTopics(result.completedTopics);
                setTotalTopics(result.totalTopics);
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
                const result = calculateRefinementLoops(interactions);
                setAvgRefinementLoops(result.avgLoops);
                setCompletedTopics(result.completedTopics);
                setTotalTopics(result.totalTopics);
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

export default RefinementLoopsIndicator;
