import OpenAI from 'openai';

if (!process.env.GROQ_API_KEY) {
  console.warn('Warning: GROQ_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export default async function handler(req, res) {
  console.log('Chat API called:', req.method, req.url);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set');
      return res.status(500).json({ 
        error: 'GROQ_API_KEY is not configured. Please set it in your .env.local file.' 
      });
    }

    const { message, conversationHistory = [] } = req.body;
    console.log('Received message:', message ? 'present' : 'missing');

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Prepare conversation history with system message
    const messages = [
      {
        role: 'system',
        content: `You are a helpful and knowledgeable AI assistant. Provide accurate, relevant, and useful responses to user questions. 

When discussing AI-related topics, you can share insights about:
- AI efficiency metrics and optimization
- Sustainable AI usage practices
- Best practices for AI development

However, you should answer all questions helpfully, not just AI-related ones. Be conversational, clear, and provide practical information. If you don't know something, say so honestly.`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    // Call Groq API
    console.log('Calling Groq API with model: llama-3.1-8b-instant');
    try {
      const completion = await openai.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        temperature: 0.7,
        max_tokens: 512,
      });

      const aiResponse = completion.choices[0].message.content;
      console.log('Groq API response received');

      res.status(200).json({
        success: true,
        response: aiResponse,
        usage: completion.usage
      });
    } catch (apiError) {
      console.error('Groq API call error:', apiError);
      throw apiError; // Re-throw to be caught by outer catch
    }

  } catch (error) {
    console.error('Chat API error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      type: error.constructor.name,
      stack: error.stack
    });
    
    // Return a friendly error message
    if (error instanceof OpenAI.APIError) {
      return res.status(error.status || 500).json({
        error: error.message || 'An error occurred with the AI service',
        status: error.status
      });
    }

    // Handle 404 specifically
    if (error.status === 404 || error.message?.includes('404')) {
      return res.status(404).json({
        error: 'Groq API returned 404. Possible causes: invalid API key or wrong model name.',
        details: error.message,
        suggestion: 'Check your GROQ_API_KEY in .env.local and verify the model name is correct.'
      });
    }

    res.status(500).json({
      error: 'Failed to get AI response. Please try again.',
      details: error.message
    });
  }
}

