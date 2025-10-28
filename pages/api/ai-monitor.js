// AI Waste Monitor API
// Handles real-time AI usage analytics and waste detection

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Return current AI monitoring data
    const mockData = {
      timestamp: new Date().toISOString(),
      metrics: {
        totalTokens: Math.floor(Math.random() * 50000) + 10000,
        wastedTokens: Math.floor(Math.random() * 5000) + 500,
        repeatedPrompts: Math.floor(Math.random() * 50) + 10,
        efficiency: Math.floor(Math.random() * 30) + 70,
        costSavings: Math.floor(Math.random() * 500) + 100,
        carbonFootprint: Math.floor(Math.random() * 100) + 20,
        // Executive Summary metrics
        aiQueriesToday: Math.floor(Math.random() * 15000) + 3000,
        energySavedKWh: Math.floor(Math.random() * 400) + 50,
        waterSavedL: Math.floor(Math.random() * 4000) + 500,
        co2PreventedKg: Math.floor(Math.random() * 220) + 40,
        computeScore: Math.floor(Math.random() * 100),
        computeScoreDelta: Math.floor(Math.random() * 20) - 5,
        redundancyRate: (Math.random() * 0.5 + 0.05).toFixed(3), // 5-55% redundancy (focused on 0-35% range)
        similarPrompts: Math.floor(Math.random() * 25) + 5,
        totalPrompts: Math.floor(Math.random() * 100) + 50,
        outputReuseRate: (Math.random() * 0.4 + 0.3).toFixed(3), // 30-70% reuse rate (focused on 40-70% range)
        usedOutputs: Math.floor(Math.random() * 30) + 10,
        totalOutputs: Math.floor(Math.random() * 80) + 40,
        avgRefinementLoops: (Math.random() * 3 + 1).toFixed(1), // 1-4 loops
        completedTopics: Math.floor(Math.random() * 15) + 5,
        totalTopics: Math.floor(Math.random() * 20) + 10,
        avgExcessRatio: (Math.random() * 1.5 + 0.8).toFixed(2), // 0.8-2.3x ratio
        totalOutputs: Math.floor(Math.random() * 50) + 20,
        excessDistribution: {
          efficient: Math.floor(Math.random() * 15) + 5,
          moderate: Math.floor(Math.random() * 10) + 3,
          waste: Math.floor(Math.random() * 8) + 1
        },
        abandonmentRate: (Math.random() * 0.4 + 0.1).toFixed(3), // 10-50% abandonment rate
        abandonedOutputs: Math.floor(Math.random() * 20) + 5,
        totalOutputs: Math.floor(Math.random() * 50) + 30,
        abandonmentDistribution: {
          efficient: Math.floor(Math.random() * 8) + 2,
          moderate: Math.floor(Math.random() * 6) + 1,
          waste: Math.floor(Math.random() * 4) + 0
        },
        avgLatencyPerToken: (Math.random() * 80 + 20).toFixed(1), // 20-100 ms/token
        totalInteractions: Math.floor(Math.random() * 100) + 50,
        latencyDistribution: {
          efficient: Math.floor(Math.random() * 30) + 10,
          moderate: Math.floor(Math.random() * 20) + 5,
          waste: Math.floor(Math.random() * 10) + 2
        },
        overallEfficiencyScore: (Math.random() * 0.4 + 0.4).toFixed(3), // 40-80% efficiency score
        efficiencyLevel: Math.random() > 0.5 ? 'High Efficiency' : Math.random() > 0.3 ? 'Moderate' : 'Wasteful'
      },
      patterns: [
        {
          id: 1,
          name: "Redundant Context",
          frequency: 23,
          wastePercentage: 15,
          suggestion: "Remove repeated context from prompts"
        },
        {
          id: 2,
          name: "Over-detailed Instructions",
          frequency: 18,
          wastePercentage: 12,
          suggestion: "Simplify instructions while maintaining clarity"
        },
        {
          id: 3,
          name: "Duplicate API Calls",
          frequency: 8,
          wastePercentage: 25,
          suggestion: "Implement request caching"
        }
      ],
      recentOptimizations: [
        {
          id: 1,
          type: "Token Reduction",
          description: "Reduced prompt length by 40% while maintaining quality",
          savings: 1200,
          timestamp: new Date(Date.now() - 300000).toISOString()
        },
        {
          id: 2,
          type: "Pattern Detection",
          description: "Identified and eliminated 5 redundant prompt patterns",
          savings: 800,
          timestamp: new Date(Date.now() - 600000).toISOString()
        },
        {
          id: 3,
          type: "Cache Hit",
          description: "Prevented duplicate API call using intelligent caching",
          savings: 500,
          timestamp: new Date(Date.now() - 900000).toISOString()
        }
      ],
      learningInsights: {
        totalPatternsLearned: 47,
        accuracyImprovement: 12.5,
        efficiencyGains: 23.8,
        costReduction: 18.2
      },
      redundancyAnalysis: {
        averageSimilarity: (Math.random() * 0.4 + 0.3).toFixed(3),
        topSimilarPrompts: [
          {
            id: 1,
            prompt1: "What is the weather like today?",
            prompt2: "What's the weather today?",
            similarity: 0.85,
            frequency: 12
          },
          {
            id: 2,
            prompt1: "Can you help me with my homework?",
            prompt2: "Help me with my assignment",
            similarity: 0.78,
            frequency: 8
          },
          {
            id: 3,
            prompt1: "Please explain machine learning",
            prompt2: "Tell me about machine learning",
            similarity: 0.72,
            frequency: 6
          }
        ],
        timeWindowAnalysis: {
          lastHour: (Math.random() * 0.4 + 0.1).toFixed(3), // 10-50% range
          lastDay: (Math.random() * 0.3 + 0.05).toFixed(3),  // 5-35% range  
          lastWeek: (Math.random() * 0.2 + 0.02).toFixed(3) // 2-22% range
        }
      },
      outputReuseAnalysis: {
        averageReuseRate: (Math.random() * 0.3 + 0.4).toFixed(3), // 40-70% range
        topReusedOutputs: [
          {
            id: 1,
            content: "The weather is sunny with 75°F temperature",
            category: "weather",
            reuseCount: 12,
            similarity: 0.95
          },
          {
            id: 2,
            content: "Machine learning is a subset of artificial intelligence",
            category: "education",
            reuseCount: 8,
            similarity: 0.88
          },
          {
            id: 3,
            content: "Python is a popular programming language",
            category: "programming",
            reuseCount: 6,
            similarity: 0.82
          }
        ],
        categoryBreakdown: {
          weather: (Math.random() * 0.2 + 0.4).toFixed(3), // 40-60% range
          education: (Math.random() * 0.3 + 0.5).toFixed(3), // 50-80% range
          programming: (Math.random() * 0.2 + 0.6).toFixed(3), // 60-80% range
          general: (Math.random() * 0.3 + 0.3).toFixed(3) // 30-60% range
        }
      },
      refinementAnalysis: {
        averageLoops: (Math.random() * 3 + 1).toFixed(1), // 1-4 loops
        loopDistribution: {
          efficient: Math.floor(Math.random() * 8) + 2, // 2-10 topics
          moderate: Math.floor(Math.random() * 6) + 1,  // 1-7 topics
          waste: Math.floor(Math.random() * 4) + 0      // 0-4 topics
        },
        topRefinementTopics: [
          {
            id: 1,
            topic: "Machine learning concepts",
            loopCount: 3,
            duration: 450,
            efficiency: "moderate"
          },
          {
            id: 2,
            topic: "Python programming help",
            loopCount: 5,
            duration: 720,
            efficiency: "waste"
          },
          {
            id: 3,
            topic: "Weather information",
            loopCount: 1,
            duration: 120,
            efficiency: "efficient"
          }
        ],
        timeWindowAnalysis: {
          lastHour: (Math.random() * 2 + 1).toFixed(1), // 1-3 loops
          lastDay: (Math.random() * 2.5 + 1.5).toFixed(1), // 1.5-4 loops
          lastWeek: (Math.random() * 3 + 2).toFixed(1) // 2-5 loops
        }
      },
      excessAnalysis: {
        averageRatio: (Math.random() * 1.5 + 0.8).toFixed(2), // 0.8-2.3x ratio
        categoryBreakdown: {
          general: (Math.random() * 1.2 + 0.8).toFixed(2), // 0.8-2.0x
          code: (Math.random() * 1.5 + 1.0).toFixed(2), // 1.0-2.5x
          explanation: (Math.random() * 1.8 + 1.2).toFixed(2), // 1.2-3.0x
          summary: (Math.random() * 0.8 + 0.6).toFixed(2) // 0.6-1.4x
        },
        topExcessOutputs: [
          {
            id: 1,
            prompt: "What is Python?",
            actualTokens: 150,
            expectedTokens: 50,
            ratio: 3.0,
            category: "general"
          },
          {
            id: 2,
            prompt: "Show me a simple function",
            actualTokens: 200,
            expectedTokens: 100,
            ratio: 2.0,
            category: "code"
          },
          {
            id: 3,
            prompt: "Explain machine learning briefly",
            actualTokens: 300,
            expectedTokens: 100,
            ratio: 3.0,
            category: "explanation"
          }
        ],
        timeWindowAnalysis: {
          lastHour: (Math.random() * 1.2 + 0.8).toFixed(2), // 0.8-2.0x
          lastDay: (Math.random() * 1.5 + 1.0).toFixed(2), // 1.0-2.5x
          lastWeek: (Math.random() * 1.8 + 1.2).toFixed(2) // 1.2-3.0x
        }
      },
      abandonmentAnalysis: {
        averageRate: (Math.random() * 0.4 + 0.1).toFixed(3), // 10-50% abandonment rate
        categoryBreakdown: {
          general: (Math.random() * 0.3 + 0.1).toFixed(3), // 10-40%
          programming: (Math.random() * 0.4 + 0.2).toFixed(3), // 20-60%
          education: (Math.random() * 0.3 + 0.15).toFixed(3), // 15-45%
          finance: (Math.random() * 0.5 + 0.3).toFixed(3) // 30-80%
        },
        topAbandonedOutputs: [
          {
            id: 1,
            content: "The weather is sunny with 75°F temperature",
            category: "weather",
            timeSinceOutput: 900000, // 15 minutes
            abandonmentReason: "No interaction"
          },
          {
            id: 2,
            content: "Machine learning is a subset of artificial intelligence",
            category: "education",
            timeSinceOutput: 1800000, // 30 minutes
            abandonmentReason: "Session closed"
          },
          {
            id: 3,
            content: "Python is a popular programming language",
            category: "programming",
            timeSinceOutput: 3600000, // 60 minutes
            abandonmentReason: "No interaction"
          }
        ],
        timeWindowAnalysis: {
          lastHour: (Math.random() * 0.3 + 0.1).toFixed(3), // 10-40%
          lastDay: (Math.random() * 0.4 + 0.2).toFixed(3), // 20-60%
          lastWeek: (Math.random() * 0.5 + 0.3).toFixed(3) // 30-80%
        }
      },
      latencyAnalysis: {
        averageLatencyPerToken: (Math.random() * 80 + 20).toFixed(1), // 20-100 ms/token
        typeBreakdown: {
          general: (Math.random() * 40 + 20).toFixed(1), // 20-60 ms/token
          code: (Math.random() * 60 + 30).toFixed(1), // 30-90 ms/token
          explanation: (Math.random() * 80 + 40).toFixed(1), // 40-120 ms/token
          list: (Math.random() * 30 + 15).toFixed(1), // 15-45 ms/token
          summary: (Math.random() * 25 + 10).toFixed(1) // 10-35 ms/token
        },
        topSlowInteractions: [
          {
            id: 1,
            prompt: "Explain quantum computing in detail",
            promptType: "explanation",
            latencyMs: 3500,
            latencyPerToken: 85.2,
            tokens: 41,
            isSlow: true
          },
          {
            id: 2,
            prompt: "Write a complex Python function with error handling",
            promptType: "code",
            latencyMs: 2800,
            latencyPerToken: 120.0,
            tokens: 23,
            isSlow: true
          },
          {
            id: 3,
            prompt: "Describe machine learning algorithms",
            promptType: "explanation",
            latencyMs: 4200,
            latencyPerToken: 95.5,
            tokens: 44,
            isSlow: true
          }
        ],
        medianLatencies: {
          general: 25.5,
          code: 45.2,
          explanation: 65.8,
          list: 18.3,
          summary: 12.1
        },
        timeWindowAnalysis: {
          lastHour: (Math.random() * 40 + 20).toFixed(1), // 20-60 ms/token
          lastDay: (Math.random() * 50 + 30).toFixed(1), // 30-80 ms/token
          lastWeek: (Math.random() * 60 + 40).toFixed(1) // 40-100 ms/token
        }
      },
      efficiencyAnalysis: {
        overallScore: (Math.random() * 0.4 + 0.4).toFixed(3), // 40-80% efficiency score
        scoreBreakdown: {
          redundancy: (Math.random() * 0.3 + 0.1).toFixed(3), // 10-40%
          reuse: (Math.random() * 0.3 + 0.1).toFixed(3), // 10-40%
          refinement: (Math.random() * 0.2 + 0.1).toFixed(3), // 10-30%
          excess: (Math.random() * 0.2 + 0.1).toFixed(3) // 10-30%
        },
        efficiencyTrend: [
          { timestamp: Date.now() - 3600000, score: 0.65, level: 'Moderate' },
          { timestamp: Date.now() - 1800000, score: 0.72, level: 'Moderate' },
          { timestamp: Date.now() - 900000, score: 0.78, level: 'High Efficiency' },
          { timestamp: Date.now() - 300000, score: 0.75, level: 'High Efficiency' },
          { timestamp: Date.now(), score: 0.73, level: 'Moderate' }
        ],
        categoryPerformance: {
          redundancy: (Math.random() * 0.3 + 0.1).toFixed(3),
          reuse: (Math.random() * 0.3 + 0.1).toFixed(3),
          refinement: (Math.random() * 0.2 + 0.1).toFixed(3),
          excess: (Math.random() * 0.2 + 0.1).toFixed(3)
        },
        recommendations: [
          {
            category: 'Redundancy',
            priority: 'High',
            suggestion: 'Reduce similar prompts by 15%',
            impact: 'Could improve efficiency by 5-8%'
          },
          {
            category: 'Reuse',
            priority: 'Medium',
            suggestion: 'Increase output reuse by 10%',
            impact: 'Could improve efficiency by 3-5%'
          },
          {
            category: 'Refinement',
            priority: 'Low',
            suggestion: 'Optimize prompt clarity',
            impact: 'Could improve efficiency by 2-3%'
          }
        ]
      }
    };

    res.status(200).json(mockData);
  } else if (req.method === 'POST') {
    // Handle new AI interaction data
    const { prompt, tokens, responseTime, model } = req.body;
    
    // Simulate AI waste analysis
    const wasteScore = analyzeWaste(prompt, tokens, responseTime);
    const optimization = generateOptimization(prompt, wasteScore);
    
    const response = {
      wasteScore,
      optimization,
      timestamp: new Date().toISOString(),
      recommendations: generateRecommendations(wasteScore)
    };

    res.status(200).json(response);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// AI Waste Analysis Functions
function analyzeWaste(prompt, tokens, responseTime) {
  let score = 0;
  
  // Check for redundant patterns
  if (prompt.includes('please') && prompt.includes('kindly')) score += 10;
  if (prompt.includes('I would like') && prompt.includes('I want')) score += 15;
  if (prompt.length > 1000 && tokens > 200) score += 20;
  
  // Check for inefficient token usage
  if (tokens > 500 && responseTime < 1000) score += 25;
  if (tokens / prompt.length > 2) score += 30;
  
  return Math.min(score, 100);
}

function generateOptimization(prompt, wasteScore) {
  const optimizations = [];
  
  if (wasteScore > 50) {
    optimizations.push({
      type: "High Waste Detected",
      suggestion: "Consider shortening your prompt and removing redundant phrases",
      potentialSavings: Math.floor(wasteScore * 2)
    });
  }
  
  if (prompt.length > 500) {
    optimizations.push({
      type: "Prompt Length",
      suggestion: "Break down complex requests into smaller, focused prompts",
      potentialSavings: Math.floor(prompt.length / 10)
    });
  }
  
  return optimizations;
}

function generateRecommendations(wasteScore) {
  const recommendations = [];
  
  if (wasteScore > 70) {
    recommendations.push("Use more specific, concise language");
    recommendations.push("Avoid redundant phrases and filler words");
    recommendations.push("Consider using structured prompts");
  } else if (wasteScore > 40) {
    recommendations.push("Review prompt structure for efficiency");
    recommendations.push("Consider using templates for common requests");
  } else {
    recommendations.push("Good efficiency! Consider advanced optimization techniques");
  }
  
  return recommendations;
}
