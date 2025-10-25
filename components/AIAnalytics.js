import { useState, useEffect } from 'react';

// Advanced AI Analytics Component
export const AIAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/ai-monitor');
      const data = await response.json();
      setAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Tokens"
          value={analytics.metrics.totalTokens.toLocaleString()}
          trend="+12.5%"
          color="blue"
        />
        <MetricCard
          title="Waste Reduction"
          value={`${analytics.metrics.efficiency}%`}
          trend="+5.2%"
          color="green"
        />
        <MetricCard
          title="Cost Savings"
          value={`$${analytics.metrics.costSavings}`}
          trend="+18.3%"
          color="purple"
        />
        <MetricCard
          title="Redundancy Rate"
          value={`${(analytics.metrics.redundancyRate * 100).toFixed(1)}%`}
          trend="+2.1%"
          color="red"
        />
        <MetricCard
          title="Similar Prompts"
          value={analytics.metrics.similarPrompts}
          trend="-5.2%"
          color="orange"
        />
        <MetricCard
          title="Output Reuse Rate"
          value={`${(analytics.metrics.outputReuseRate * 100).toFixed(1)}%`}
          trend="+8.3%"
          color="green"
        />
        <MetricCard
          title="Used Outputs"
          value={analytics.metrics.usedOutputs}
          trend="+12.1%"
          color="blue"
        />
        <MetricCard
          title="Avg Refinement Loops"
          value={analytics.metrics.avgRefinementLoops}
          trend="-8.2%"
          color="purple"
        />
        <MetricCard
          title="Completed Topics"
          value={analytics.metrics.completedTopics}
          trend="+15.3%"
          color="cyan"
        />
        <MetricCard
          title="Avg Excess Ratio"
          value={`${analytics.metrics.avgExcessRatio}x`}
          trend="-5.2%"
          color="indigo"
        />
        <MetricCard
          title="Efficient Outputs"
          value={analytics.metrics.excessDistribution?.efficient || 0}
          trend="+8.1%"
          color="emerald"
        />
        <MetricCard
          title="Abandonment Rate"
          value={`${(analytics.metrics.abandonmentRate * 100).toFixed(1)}%`}
          trend="-3.2%"
          color="pink"
        />
        <MetricCard
          title="Abandoned Outputs"
          value={analytics.metrics.abandonedOutputs}
          trend="-12.5%"
          color="rose"
        />
        <MetricCard
          title="Avg Latency per Token"
          value={`${analytics.metrics.avgLatencyPerToken} ms`}
          trend="-8.3%"
          color="violet"
        />
        <MetricCard
          title="Total Interactions"
          value={analytics.metrics.totalInteractions}
          trend="+15.2%"
          color="fuchsia"
        />
        <MetricCard
          title="Overall Efficiency"
          value={`${(analytics.metrics.overallEfficiencyScore * 100).toFixed(1)}%`}
          trend="+5.8%"
          color="teal"
        />
        <MetricCard
          title="Efficiency Level"
          value={analytics.metrics.efficiencyLevel}
          trend="+2.1%"
          color="slate"
        />
      </div>

      {/* Waste Patterns */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Waste Patterns Detected</h3>
        <div className="space-y-4">
          {analytics.patterns.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </div>

      {/* Recent Optimizations */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Optimizations</h3>
        <div className="space-y-3">
          {analytics.recentOptimizations.map((opt) => (
            <OptimizationCard key={opt.id} optimization={opt} />
          ))}
        </div>
      </div>

      {/* Redundancy Analysis */}
      {analytics.redundancyAnalysis && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Redundancy Analysis</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {(analytics.redundancyAnalysis.averageSimilarity * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-white/60">Average Similarity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {(analytics.redundancyAnalysis.timeWindowAnalysis.lastHour * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-white/60">Last Hour Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {(analytics.redundancyAnalysis.timeWindowAnalysis.lastDay * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-white/60">Last Day Rate</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-white mb-3">Top Similar Prompt Pairs</h4>
              <div className="space-y-3">
                {analytics.redundancyAnalysis.topSimilarPrompts.map((pair) => (
                  <SimilarPromptPair key={pair.id} pair={pair} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Output Reuse Analysis */}
      {analytics.outputReuseAnalysis && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Output Reuse Analysis</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {(analytics.outputReuseAnalysis.averageReuseRate * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-white/60">Average Reuse Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {analytics.metrics.usedOutputs}
                </div>
                <div className="text-sm text-white/60">Total Used Outputs</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-white mb-3">Top Reused Outputs</h4>
              <div className="space-y-3">
                {analytics.outputReuseAnalysis.topReusedOutputs.map((output) => (
                  <ReusedOutputCard key={output.id} output={output} />
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-white mb-3">Category Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analytics.outputReuseAnalysis.categoryBreakdown).map(([category, rate]) => (
                  <div key={category} className="text-center">
                    <div className="text-lg font-bold text-white">
                      {(rate * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-white/60 capitalize">{category}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refinement Analysis */}
      {analytics.refinementAnalysis && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Refinement Loops Analysis</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {analytics.refinementAnalysis.averageLoops}
                </div>
                <div className="text-sm text-white/60">Average Loops</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {analytics.metrics.completedTopics}
                </div>
                <div className="text-sm text-white/60">Completed Topics</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {analytics.metrics.totalTopics}
                </div>
                <div className="text-sm text-white/60">Total Topics</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-white mb-3">Loop Distribution</h4>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">
                    {analytics.refinementAnalysis.loopDistribution.efficient}
                  </div>
                  <div className="text-xs text-white/60">Efficient (≤2)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">
                    {analytics.refinementAnalysis.loopDistribution.moderate}
                  </div>
                  <div className="text-xs text-white/60">Moderate (3-4)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-400">
                    {analytics.refinementAnalysis.loopDistribution.waste}
                  </div>
                  <div className="text-xs text-white/60">Waste (&gt;4)</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-white mb-3">Top Refinement Topics</h4>
              <div className="space-y-3">
                {analytics.refinementAnalysis.topRefinementTopics.map((topic) => (
                  <RefinementTopicCard key={topic.id} topic={topic} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Excess Analysis */}
      {analytics.excessAnalysis && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Output Excess Analysis</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {analytics.excessAnalysis.averageRatio}x
                </div>
                <div className="text-sm text-white/60">Average Ratio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {analytics.metrics.totalOutputs}
                </div>
                <div className="text-sm text-white/60">Total Outputs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1.0x</div>
                <div className="text-sm text-white/60">Ideal Ratio</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-white mb-3">Category Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {Object.entries(analytics.excessAnalysis.categoryBreakdown).map(([category, ratio]) => (
                  <div key={category} className="text-center">
                    <div className="text-lg font-bold text-white">
                      {ratio}x
                    </div>
                    <div className="text-xs text-white/60 capitalize">{category}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-white mb-3">Top Excess Outputs</h4>
              <div className="space-y-3">
                {analytics.excessAnalysis.topExcessOutputs.map((output) => (
                  <ExcessOutputCard key={output.id} output={output} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Abandonment Analysis */}
      {analytics.abandonmentAnalysis && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Output Abandonment Analysis</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {(analytics.abandonmentAnalysis.averageRate * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-white/60">Average Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {analytics.metrics.abandonedOutputs}
                </div>
                <div className="text-sm text-white/60">Abandoned Outputs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {analytics.metrics.totalOutputs}
                </div>
                <div className="text-sm text-white/60">Total Outputs</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-white mb-3">Category Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {Object.entries(analytics.abandonmentAnalysis.categoryBreakdown).map(([category, rate]) => (
                  <div key={category} className="text-center">
                    <div className="text-lg font-bold text-white">
                      {(rate * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-white/60 capitalize">{category}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-white mb-3">Top Abandoned Outputs</h4>
              <div className="space-y-3">
                {analytics.abandonmentAnalysis.topAbandonedOutputs.map((output) => (
                  <AbandonedOutputCard key={output.id} output={output} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Latency Analysis */}
      {analytics.latencyAnalysis && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Latency Performance Analysis</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {analytics.latencyAnalysis.averageLatencyPerToken} ms/token
                </div>
                <div className="text-sm text-white/60">Average Latency</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {analytics.metrics.totalInteractions}
                </div>
                <div className="text-sm text-white/60">Total Interactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50 ms</div>
                <div className="text-sm text-white/60">Target per Token</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-white mb-3">Performance by Prompt Type</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                {Object.entries(analytics.latencyAnalysis.typeBreakdown).map(([type, latency]) => (
                  <div key={type} className="text-center">
                    <div className="text-lg font-bold text-white">
                      {latency} ms/token
                    </div>
                    <div className="text-xs text-white/60 capitalize">{type}</div>
                    <div className="text-xs text-white/40">
                      Median: {analytics.latencyAnalysis.medianLatencies[type]} ms
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-white mb-3">Top Slow Interactions</h4>
              <div className="space-y-3">
                {analytics.latencyAnalysis.topSlowInteractions.map((interaction) => (
                  <SlowInteractionCard key={interaction.id} interaction={interaction} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Efficiency Analysis */}
      {analytics.efficiencyAnalysis && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Overall Efficiency Analysis</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {(analytics.efficiencyAnalysis.overallScore * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-white/60">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {analytics.metrics.efficiencyLevel}
                </div>
                <div className="text-sm text-white/60">Efficiency Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">75%</div>
                <div className="text-sm text-white/60">High Efficiency Threshold</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-semibold text-white mb-3">Score Breakdown</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {Object.entries(analytics.efficiencyAnalysis.scoreBreakdown).map(([category, score]) => (
                  <div key={category} className="text-center">
                    <div className="text-lg font-bold text-white">
                      {(score * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-white/60 capitalize">{category}</div>
                    <div className="text-xs text-white/40">
                      {category === 'redundancy' || category === 'reuse' ? '30% weight' : '20% weight'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-white mb-3">Efficiency Recommendations</h4>
              <div className="space-y-3">
                {analytics.efficiencyAnalysis.recommendations.map((rec, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-white">
                        {rec.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.priority === 'High' ? 'bg-red-500/20 text-red-300' :
                        rec.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {rec.priority} Priority
                      </span>
                    </div>
                    <div className="text-sm text-white/80 mb-2">{rec.suggestion}</div>
                    <div className="text-xs text-white/60">{rec.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learning Progress */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">AI Learning Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <LearningMetric
            label="Patterns Learned"
            value={analytics.learningInsights.totalPatternsLearned}
            max={100}
          />
          <LearningMetric
            label="Accuracy Improvement"
            value={`${analytics.learningInsights.accuracyImprovement}%`}
            max={50}
          />
          <LearningMetric
            label="Efficiency Gains"
            value={`${analytics.learningInsights.efficiencyGains}%`}
            max={50}
          />
          <LearningMetric
            label="Cost Reduction"
            value={`${analytics.learningInsights.costReduction}%`}
            max={50}
          />
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, trend, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 border-blue-500/30',
    green: 'bg-green-500/20 border-green-500/30',
    purple: 'bg-purple-500/20 border-purple-500/30',
    red: 'bg-red-500/20 border-red-500/30',
    orange: 'bg-orange-500/20 border-orange-500/30',
    cyan: 'bg-cyan-500/20 border-cyan-500/30',
    indigo: 'bg-indigo-500/20 border-indigo-500/30',
    emerald: 'bg-emerald-500/20 border-emerald-500/30',
    pink: 'bg-pink-500/20 border-pink-500/30',
    rose: 'bg-rose-500/20 border-rose-500/30',
    violet: 'bg-violet-500/20 border-violet-500/30',
    fuchsia: 'bg-fuchsia-500/20 border-fuchsia-500/30',
    teal: 'bg-teal-500/20 border-teal-500/30',
    slate: 'bg-slate-500/20 border-slate-500/30'
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4 border`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-white/80">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <span className="text-sm text-green-400 font-medium">{trend}</span>
      </div>
    </div>
  );
};

const PatternCard = ({ pattern }) => {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-white">{pattern.name}</h4>
        <span className="text-sm text-red-300 font-medium">
          {pattern.wastePercentage}% waste
        </span>
      </div>
      <p className="text-sm text-white/80 mb-2">{pattern.suggestion}</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-white/60">Frequency: {pattern.frequency} times</span>
        <div className="w-24 bg-gray-700 rounded-full h-1.5">
          <div 
            className="bg-red-400 h-1.5 rounded-full"
            style={{ width: `${pattern.wastePercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const OptimizationCard = ({ optimization }) => {
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-white">{optimization.type}</h4>
          <p className="text-sm text-white/80">{optimization.description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-green-400">${optimization.savings}</p>
          <p className="text-xs text-white/60">
            {new Date(optimization.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

const SimilarPromptPair = ({ pair }) => {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-medium text-red-300">
          {(pair.similarity * 100).toFixed(1)}% similar
        </span>
        <span className="text-xs text-white/60">
          {pair.frequency} occurrences
        </span>
      </div>
      <div className="space-y-2">
        <div>
          <div className="text-xs text-white/60 mb-1">Prompt 1:</div>
          <div className="text-sm text-white bg-white/10 rounded p-2">
            {pair.prompt1}
          </div>
        </div>
        <div>
          <div className="text-xs text-white/60 mb-1">Prompt 2:</div>
          <div className="text-sm text-white/80 bg-white/5 rounded p-2">
            {pair.prompt2}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReusedOutputCard = ({ output }) => {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <span className="text-sm font-medium text-green-300">
          {output.reuseCount} reuses
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-white/60 bg-blue-500/20 px-2 py-1 rounded">
            {output.category}
          </span>
          <span className="text-xs text-white/60">
            {(output.similarity * 100).toFixed(1)}% similar
          </span>
        </div>
      </div>
      <div className="text-sm text-white bg-white/10 rounded p-2">
        {output.content}
      </div>
    </div>
  );
};

const RefinementTopicCard = ({ topic }) => {
  const getEfficiencyColor = (efficiency) => {
    switch (efficiency) {
      case 'efficient': return 'text-green-300';
      case 'moderate': return 'text-yellow-300';
      case 'waste': return 'text-red-300';
      default: return 'text-white/60';
    }
  };

  const getEfficiencyLabel = (efficiency) => {
    switch (efficiency) {
      case 'efficient': return 'Efficient';
      case 'moderate': return 'Moderate';
      case 'waste': return 'Waste';
      default: return 'Unknown';
    }
  };

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-sm font-medium ${getEfficiencyColor(topic.efficiency)}`}>
          {topic.loopCount} loops
        </span>
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded ${
            topic.efficiency === 'efficient' ? 'bg-green-500/20 text-green-300' :
            topic.efficiency === 'moderate' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-red-500/20 text-red-300'
          }`}>
            {getEfficiencyLabel(topic.efficiency)}
          </span>
          <span className="text-xs text-white/60">
            {Math.round(topic.duration / 60)}m duration
          </span>
        </div>
      </div>
      <div className="text-sm text-white bg-white/10 rounded p-2">
        {topic.topic}
      </div>
    </div>
  );
};

const ExcessOutputCard = ({ output }) => {
  const getExcessColor = (ratio) => {
    if (ratio >= 0.8 && ratio <= 1.5) return 'text-green-300';
    if (ratio > 1.5 && ratio <= 2.0) return 'text-yellow-300';
    return 'text-red-300';
  };

  const getExcessLabel = (ratio) => {
    if (ratio >= 0.8 && ratio <= 1.5) return 'Efficient';
    if (ratio > 1.5 && ratio <= 2.0) return 'Moderate';
    return 'Waste';
  };

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-sm font-medium ${getExcessColor(output.ratio)}`}>
          {output.ratio}x excess
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-white/60 bg-blue-500/20 px-2 py-1 rounded">
            {output.category}
          </span>
          <span className="text-xs text-white/60">
            {output.actualTokens} tokens
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div>
          <div className="text-xs text-white/60 mb-1">Prompt:</div>
          <div className="text-sm text-white bg-white/10 rounded p-2">
            {output.prompt}
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-white/60">
          <span>Actual: {output.actualTokens} tokens</span>
          <span>Expected: {output.expectedTokens} tokens</span>
        </div>
      </div>
    </div>
  );
};

const AbandonedOutputCard = ({ output }) => {
  const getAbandonmentColor = (timeSince) => {
    if (timeSince < 600000) return 'text-green-300'; // Less than 10 minutes
    if (timeSince < 1800000) return 'text-yellow-300'; // Less than 30 minutes
    return 'text-red-300'; // More than 30 minutes
  };

  const getAbandonmentLabel = (timeSince) => {
    if (timeSince < 600000) return 'Recent';
    if (timeSince < 1800000) return 'Moderate';
    return 'Old';
  };

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-sm font-medium ${getAbandonmentColor(output.timeSinceOutput)}`}>
          {Math.round(output.timeSinceOutput / 60000)}m ago
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-white/60 bg-blue-500/20 px-2 py-1 rounded">
            {output.category}
          </span>
          <span className="text-xs text-white/60">
            {output.abandonmentReason}
          </span>
        </div>
      </div>
      <div className="text-sm text-white bg-white/10 rounded p-2">
        {output.content}
      </div>
    </div>
  );
};

const SlowInteractionCard = ({ interaction }) => {
  const getLatencyColor = (latencyPerToken) => {
    if (latencyPerToken <= 50) return 'text-green-300';
    if (latencyPerToken <= 100) return 'text-yellow-300';
    return 'text-red-300';
  };

  const getLatencyLabel = (latencyPerToken) => {
    if (latencyPerToken <= 50) return 'Fast';
    if (latencyPerToken <= 100) return 'Moderate';
    return 'Slow';
  };

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <span className={`text-sm font-medium ${getLatencyColor(interaction.latencyPerToken)}`}>
          {interaction.latencyPerToken} ms/token
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-white/60 bg-blue-500/20 px-2 py-1 rounded">
            {interaction.promptType}
          </span>
          <span className="text-xs text-white/60">
            {interaction.latencyMs}ms total
          </span>
          {interaction.isSlow && (
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
            {interaction.prompt}
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-white/60">
          <span>{interaction.tokens} tokens</span>
          <span>{getLatencyLabel(interaction.latencyPerToken)}</span>
        </div>
      </div>
    </div>
  );
};

const LearningMetric = ({ label, value, max }) => {
  const percentage = typeof value === 'string' ? 
    parseFloat(value.replace('%', '')) : 
    (value / max) * 100;

  return (
    <div className="text-center">
      <p className="text-sm text-white/80 mb-2">{label}</p>
      <div className="relative">
        <div className="w-16 h-16 mx-auto">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-700"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-blue-400"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${percentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white">{value}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;
