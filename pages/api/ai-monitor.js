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
        carbonFootprint: Math.floor(Math.random() * 100) + 20
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
