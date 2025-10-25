import { useState, useEffect } from 'react';

// Overall Efficiency Score Indicator Component
export const OverallEfficiencyScoreIndicator = ({ 
  timeWindow = 3600000, // 1 hour in milliseconds
  sessionId = null 
}) => {
  const [efficiencyScore, setEfficiencyScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState({});
  const [efficiencyLevel, setEfficiencyLevel] = useState('Wasteful');
  const [trendData, setTrendData] = useState([]);
  const [recentScores, setRecentScores] = useState([]);
  const [categoryScores, setCategoryScores] = useState({});

  // Normalize refinement loops to 0-1 scale
  const normalizeRefinementLoops = (loops) => {
    // Assuming max reasonable loops is 10, normalize to 0-1
    return Math.min(loops / 10, 1);
  };

  // Normalize excess ratio to 0-1 scale
  const normalizeExcessRatio = (ratio) => {
    // Assuming max reasonable ratio is 3.0, normalize to 0-1
    return Math.min(ratio / 3.0, 1);
  };

  // Calculate overall efficiency score
  const calculateEfficiencyScore = (metrics) => {
    const {
      redundancyRate = 0,
      reuseRate = 0,
      refinementLoops = 0,
      excessRatio = 1.0
    } = metrics;

    // Normalize metrics
    const normalizedRefinement = normalizeRefinementLoops(refinementLoops);
    const normalizedExcess = normalizeExcessRatio(excessRatio);

    // Calculate weighted composite score
    const score = 
      0.30 * (1 - redundancyRate) +           // 30% weight: inverse of redundancy
      0.30 * reuseRate +                      // 30% weight: reuse rate
      0.20 * (1 - normalizedRefinement) +    // 20% weight: inverse of refinement loops
      0.20 * (1 - normalizedExcess);         // 20% weight: inverse of excess ratio

    return {
      overallScore: Math.max(0, Math.min(1, score)),
      breakdown: {
        redundancy: 0.30 * (1 - redundancyRate),
        reuse: 0.30 * reuseRate,
        refinement: 0.20 * (1 - normalizedRefinement),
        excess: 0.20 * (1 - normalizedExcess)
      },
      normalized: {
        refinement: normalizedRefinement,
        excess: normalizedExcess
      }
    };
  };

  // Determine efficiency level
  const getEfficiencyLevel = (score) => {
    if (score >= 0.75) return 'High Efficiency';
    if (score >= 0.50) return 'Moderate';
    return 'Wasteful';
  };

  // Get efficiency color
  const getEfficiencyColor = (score) => {
    if (score >= 0.75) return 'text-green-400';
    if (score >= 0.50) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Get efficiency background color
  const getEfficiencyBgColor = (score) => {
    if (score >= 0.75) return 'bg-green-500';
    if (score >= 0.50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Fetch and calculate efficiency data
  useEffect(() => {
    const fetchEfficiencyData = async () => {
      try {
        const response = await fetch('/api/ai-monitor');
        const data = await response.json();
        
        if (data && data.metrics) {
          const metrics = {
            redundancyRate: parseFloat(data.metrics.redundancyRate) || 0,
            reuseRate: parseFloat(data.metrics.outputReuseRate) || 0,
            refinementLoops: parseFloat(data.metrics.avgRefinementLoops) || 0,
            excessRatio: parseFloat(data.metrics.avgExcessRatio) || 1.0
          };

          const result = calculateEfficiencyScore(metrics);
          setEfficiencyScore(result.overallScore);
          setScoreBreakdown(result.breakdown);
          setEfficiencyLevel(getEfficiencyLevel(result.overallScore));

          // Generate trend data (simulated)
          const now = Date.now();
          const trendPoints = [];
          for (let i = 6; i >= 0; i--) {
            const timestamp = now - (i * 600000); // 10 minutes apart
            const randomVariation = (Math.random() - 0.5) * 0.1;
            const trendScore = Math.max(0, Math.min(1, result.overallScore + randomVariation));
            trendPoints.push({
              timestamp,
              score: trendScore,
              level: getEfficiencyLevel(trendScore)
            });
          }
          setTrendData(trendPoints);

          // Generate recent scores
          const recentPoints = trendPoints.slice(-3);
          setRecentScores(recentPoints);

          // Generate category scores
          const categories = {
            'Redundancy': result.breakdown.redundancy,
            'Reuse': result.breakdown.reuse,
            'Refinement': result.breakdown.refinement,
            'Excess': result.breakdown.excess
          };
          setCategoryScores(categories);
        }
      } catch (error) {
        console.error('Failed to fetch efficiency data:', error);
      }
    };

    fetchEfficiencyData();
    const interval = setInterval(fetchEfficiencyData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Main Efficiency Score Indicator */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Overall Efficiency Score</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {(efficiencyScore * 100).toFixed(1)}%
            </div>
            <div className={`text-sm font-medium ${getEfficiencyColor(efficiencyScore)}`}>
              {efficiencyLevel}
            </div>
          </div>
        </div>

        {/* Circular Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-700"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={getEfficiencyColor(efficiencyScore)}
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${efficiencyScore * 100}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {(efficiencyScore * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-white/60">Efficiency</div>
              </div>
            </div>
          </div>
        </div>

        {/* Efficiency Level Legend */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <div className="text-sm font-medium text-white/80 mb-2">Efficiency Levels:</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-white/60">High: ≥ 75%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-white/60">Moderate: 50-74%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-white/60">Wasteful: &lt; 50%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Score Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(scoreBreakdown).map(([category, score]) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-white/80 capitalize">
                  {category} ({category === 'redundancy' ? '30%' : category === 'reuse' ? '30%' : '20%'} weight)
                </span>
                <span className="text-sm font-bold text-white">
                  {(score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getEfficiencyBgColor(score)}`}
                  style={{ width: `${score * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Efficiency Trend</h3>
        <div className="space-y-3">
          {trendData.map((point, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm text-white/60">
                {new Date(point.timestamp).toLocaleTimeString()}
              </span>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getEfficiencyColor(point.score)}`}>
                  {(point.score * 100).toFixed(1)}%
                </span>
                <span className="text-xs text-white/60">
                  {point.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Category Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryScores).map(([category, score]) => (
            <div key={category} className="text-center">
              <div className={`text-2xl font-bold ${getEfficiencyColor(score)}`}>
                {(score * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-white/60 capitalize">{category}</div>
              <div className="text-xs text-white/40">
                {category === 'Redundancy' ? '30% weight' : 
                 category === 'Reuse' ? '30% weight' : '20% weight'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Scores */}
      {recentScores.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Efficiency Scores</h3>
          <div className="space-y-3">
            {recentScores.map((score, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/60">
                    {new Date(score.timestamp).toLocaleTimeString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getEfficiencyColor(score.score)}`}>
                      {(score.score * 100).toFixed(1)}%
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      score.score >= 0.75 ? 'bg-green-500/20 text-green-300' :
                      score.score >= 0.50 ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {score.level}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formula Display */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Efficiency Score Formula</h3>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-sm text-white/80 font-mono">
            <div className="mb-2">efficiency_score =</div>
            <div className="ml-4 space-y-1">
              <div>0.30 × (1 - redundancy_rate) +</div>
              <div>0.30 × reuse_rate +</div>
              <div>0.20 × (1 - normalized_refinement_loops) +</div>
              <div>0.20 × (1 - normalized_excess_ratio)</div>
            </div>
            <div className="mt-3 text-xs text-white/60">
              * Normalization: refinement_loops/10, excess_ratio/3.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallEfficiencyScoreIndicator;
