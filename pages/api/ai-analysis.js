import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, analysisType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (analysisType) {
      case 'redundancy':
  systemPrompt = `You are an AI efficiency analyst. Respond with a single valid JSON object only — do not include any explanatory text.
  Analyze the given prompt for redundancy patterns. 
  Look for repeated concepts, similar phrasing, or unnecessary repetition within the prompt.
        Return a JSON object with:
        - redundancy_score: 0-1 (0 = no redundancy, 1 = highly redundant)
        - redundant_phrases: array of repeated phrases
        - suggestions: array of suggestions to reduce redundancy
        - complexity_score: 0-1 (0 = simple, 1 = complex)
        - optimized_prompt: a concise rewritten prompt optimized for clarity and token-efficiency (string)`;
        userPrompt = `Analyze this prompt for redundancy: "${prompt}"`;
        break;

      case 'complexity':
  systemPrompt = `You are an AI efficiency analyst. Respond with a single valid JSON object only — do not include any explanatory text.
  Analyze the given prompt for complexity.
  Consider factors like: number of concepts, technical depth, required reasoning steps.
        Return a JSON object with:
        - complexity_score: 0-1 (0 = simple, 1 = very complex)
        - concepts_count: number of distinct concepts
        - reasoning_steps: estimated reasoning steps required
        - suggestions: array of suggestions to simplify
        - optimized_prompt: a concise rewritten prompt optimized for clarity and token-efficiency (string)`;
        userPrompt = `Analyze the complexity of this prompt: "${prompt}"`;
        break;

      case 'clarity':
  systemPrompt = `You are an AI efficiency analyst. Respond with a single valid JSON object only — do not include any explanatory text.
  Analyze the given prompt for clarity and specificity.
  Look for ambiguous terms, unclear instructions, or vague requirements.
        Return a JSON object with:
        - clarity_score: 0-1 (0 = unclear, 1 = very clear)
        - ambiguous_terms: array of unclear terms
        - missing_context: array of missing context
        - suggestions: array of suggestions to improve clarity
        - optimized_prompt: a concise rewritten prompt optimized for clarity and token-efficiency (string)`;
        userPrompt = `Analyze the clarity of this prompt: "${prompt}"`;
        break;

      case 'efficiency':
  systemPrompt = `You are an AI efficiency analyst. Respond with a single valid JSON object only — do not include any explanatory text.
  Provide a comprehensive efficiency analysis.
  Consider redundancy, complexity, clarity, and potential for reuse.
        Return a JSON object with:
        - overall_efficiency: 0-1 (0 = inefficient, 1 = very efficient)
        - redundancy_issues: array of redundancy problems
        - complexity_issues: array of complexity problems
        - clarity_issues: array of clarity problems
        - optimization_suggestions: array of specific improvements
        - estimated_tokens: estimated token count for response
        - optimized_prompt: a concise rewritten prompt optimized for clarity and token-efficiency (string)`;
        userPrompt = `Provide efficiency analysis for this prompt: "${prompt}"`;
        break;

      default:
  systemPrompt = `You are an AI efficiency analyst. Respond with a single valid JSON object only — do not include any explanatory text.
  Analyze the given prompt for various efficiency metrics.
  Return a JSON object with:
        - redundancy_score: 0-1
        - complexity_score: 0-1
        - clarity_score: 0-1
        - overall_efficiency: 0-1
        - suggestions: array of improvement suggestions
        - optimized_prompt: a concise rewritten prompt optimized for clarity and token-efficiency (string)`;
        userPrompt = `Analyze this prompt for efficiency: "${prompt}"`;
    }

    const completion = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const analysis = completion.choices[0].message.content;
    
    try {
      const parsedAnalysis = JSON.parse(analysis);
      res.status(200).json({
        success: true,
        analysis: parsedAnalysis,
        model: "llama-3.1-8b-instant",
        usage: completion.usage
      });
    } catch (parseError) {
      // If JSON parsing fails, return the raw analysis
      res.status(200).json({
        success: true,
        analysis: { raw_analysis: analysis },
        model: "llama-3.1-8b-instant",
        usage: completion.usage
      });
    }

  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze prompt',
      details: error.message 
    });
  }
}




