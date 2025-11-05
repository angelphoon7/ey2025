import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Prepare conversation history with system message
    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI assistant specialized in AI sustainability and efficiency. You help users understand:
- AI efficiency metrics and how to improve them
- Sustainable AI usage practices
- Carbon footprint and environmental impact
- Resource optimization techniques
- Best practices for reducing AI waste

Be concise, friendly, and knowledgeable. Focus on practical advice for improving AI sustainability.`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const aiResponse = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      response: aiResponse,
      usage: completion.usage
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Return a friendly error message
    if (error instanceof OpenAI.APIError) {
      return res.status(error.status || 500).json({
        error: error.message || 'An error occurred with the AI service'
      });
    }

    res.status(500).json({
      error: 'Failed to get AI response. Please try again.'
    });
  }
}

