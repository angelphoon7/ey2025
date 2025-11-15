import { useState } from 'react';

const RealTimeAnalysis = () => {
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState('efficiency');
  const [analysisHistory, setAnalysisHistory] = useState([]);

  const analyzePrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          analysisType: analysisType
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setAnalysis(result.analysis);
        
        // Add to history
        const newEntry = {
          id: Date.now(),
          prompt: prompt.trim(),
          analysis: result.analysis,
          type: analysisType,
          timestamp: new Date().toISOString(),
          model: result.model,
          usage: result.usage
        };
        
        setAnalysisHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10
      } else {
        console.error('Analysis failed:', result.error);
      }
    } catch (error) {
      console.error('Failed to analyze prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestedPrompt = (suggested) => {
    if (!suggested) return;
    setPrompt(suggested);
  };

  const copyToClipboard = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-green-400';
    if (score >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Real-Time AI Analysis</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Analysis Type
            </label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="efficiency">Overall Efficiency</option>
              <option value="redundancy">Redundancy Analysis</option>
              <option value="complexity">Complexity Analysis</option>
              <option value="clarity">Clarity Analysis</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Prompt to Analyze
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here for real-time analysis..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              rows={4}
            />
          </div>

          <button
            onClick={analyzePrompt}
            disabled={loading || !prompt.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze Prompt'}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Analysis Results</h3>
          
          <div className="space-y-4">
            {/* Score Display */}
            {analysis.overall_efficiency !== undefined && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(analysis.overall_efficiency)}`}>
                    {(analysis.overall_efficiency * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-white/60">Overall Efficiency</div>
                  <div className="text-xs text-white/40">{getScoreLabel(analysis.overall_efficiency)}</div>
                </div>
                
                {analysis.redundancy_score !== undefined && (
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(1 - analysis.redundancy_score)}`}>
                      {((1 - analysis.redundancy_score) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-white/60">Redundancy</div>
                    <div className="text-xs text-white/40">{getScoreLabel(1 - analysis.redundancy_score)}</div>
                  </div>
                )}
                
                {analysis.complexity_score !== undefined && (
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(1 - analysis.complexity_score)}`}>
                      {((1 - analysis.complexity_score) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-white/60">Simplicity</div>
                    <div className="text-xs text-white/40">{getScoreLabel(1 - analysis.complexity_score)}</div>
                  </div>
                )}
                
                {analysis.clarity_score !== undefined && (
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.clarity_score)}`}>
                      {(analysis.clarity_score * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-white/60">Clarity</div>
                    <div className="text-xs text-white/40">{getScoreLabel(analysis.clarity_score)}</div>
                  </div>
                )}
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-white mb-3">Optimization Suggestions</h4>
                <div className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3">
                      <div className="text-sm text-white">{suggestion}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Efficient Prompt */}
            {analysis.optimized_prompt && (
              <div className="mt-4">
                <h4 className="text-md font-semibold text-white mb-2">Suggested Efficient Prompt</h4>

                <div className="bg-white/5 rounded-lg p-3 mb-3">
                  <div className="text-sm text-white whitespace-pre-wrap">{analysis.optimized_prompt}</div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => applySuggestedPrompt(analysis.optimized_prompt)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg"
                  >
                    Use Suggested Prompt
                  </button>

                  <button
                    onClick={() => copyToClipboard(analysis.optimized_prompt)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* Issues */}
            {(analysis.redundant_phrases || analysis.ambiguous_terms || analysis.complexity_issues) && (
              <div>
                <h4 className="text-md font-semibold text-white mb-3">Identified Issues</h4>
                <div className="space-y-3">
                  {analysis.redundant_phrases && analysis.redundant_phrases.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-red-300 mb-1">Redundant Phrases:</div>
                      <div className="text-sm text-white/80">
                        {analysis.redundant_phrases.join(', ')}
                      </div>
                    </div>
                  )}
                  
                  {analysis.ambiguous_terms && analysis.ambiguous_terms.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-yellow-300 mb-1">Ambiguous Terms:</div>
                      <div className="text-sm text-white/80">
                        {analysis.ambiguous_terms.join(', ')}
                      </div>
                    </div>
                  )}
                  
                  {analysis.complexity_issues && analysis.complexity_issues.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-orange-300 mb-1">Complexity Issues:</div>
                      <div className="text-sm text-white/80">
                        {analysis.complexity_issues.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Raw Analysis (if JSON parsing failed) */}
            {analysis.raw_analysis && (
              <div>
                <h4 className="text-md font-semibold text-white mb-3">Analysis Details</h4>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-white whitespace-pre-wrap">
                    {analysis.raw_analysis}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Analyses</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analysisHistory.map((entry) => (
              <div key={entry.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-white">
                    {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)} Analysis
                  </span>
                  <span className="text-xs text-white/60">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-white/80 mb-2">
                  &quot;{entry.prompt.substring(0, 100)}{entry.prompt.length > 100 ? '...' : ''}&quot;
                </div>
                {entry.analysis.overall_efficiency !== undefined && (
                  <div className="flex items-center space-x-4 text-xs">
                    <span className={`font-medium ${getScoreColor(entry.analysis.overall_efficiency)}`}>
                      {(entry.analysis.overall_efficiency * 100).toFixed(1)}% efficiency
                    </span>
                    <span className="text-white/60">
                      {entry.usage?.total_tokens || 0} tokens
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeAnalysis;




