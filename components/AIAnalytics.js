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
    purple: 'bg-purple-500/20 border-purple-500/30'
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
