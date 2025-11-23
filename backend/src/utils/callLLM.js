const OpenAI = require('openai');
const { OPENAI_API_KEY, OPENAI_MODEL } = require('../config/env');

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

/**
 * Call OpenAI with persona context and retrieved knowledge
 */
async function callLLM({ 
  userQuery, 
  personaContext, 
  retrievedContext, 
  language = 'en',
  conversationHistory = []
}) {
  try {
    const systemPrompt = buildSystemPrompt(personaContext, retrievedContext, language);
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-5), // Last 5 messages for context
      { role: 'user', content: userQuery }
    ];

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1500,
      top_p: 0.9,
    });

    return {
      answer: response.choices[0].message.content,
      usage: response.usage,
      model: response.model,
    };

  } catch (error) {
    console.error('❌ LLM Call Error:', error.message);
    throw new Error(`LLM call failed: ${error.message}`);
  }
}

/**
 * Build system prompt with persona and context
 */
function buildSystemPrompt(personaContext, retrievedContext, language) {
  const langInstruction = language === 'hi' 
    ? 'Respond primarily in Hindi (Devanagari script) but include English for proper nouns and technical terms.'
    : 'Respond in English.';

  let prompt = `${personaContext.system_prompt}\n\n`;
  prompt += `${langInstruction}\n\n`;
  prompt += `IMPORTANT GUIDELINES:\n`;
  prompt += `- Use the retrieved context below to provide accurate, specific information\n`;
  prompt += `- If information is from context, cite sources using [source_id]\n`;
  prompt += `- If unsure or no relevant context, admit it honestly\n`;
  prompt += `- Provide actionable advice with specific details (costs, timings, locations)\n`;
  prompt += `- Highlight "avoid_common_mistake" tips when relevant\n`;
  prompt += `- Be conversational and helpful, matching the persona's tone\n\n`;
  
  if (retrievedContext && retrievedContext.length > 0) {
    prompt += `RETRIEVED KNOWLEDGE CONTEXT:\n`;
    retrievedContext.forEach((doc, idx) => {
      prompt += `\n[${doc.id}] ${doc.category || doc.type}:\n`;
      prompt += `${JSON.stringify(doc.content, null, 2)}\n`;
    });
  } else {
    prompt += `No specific context retrieved. Use your general knowledge about India travel.\n`;
  }

  return prompt;
}

/**
 * Generate structured response for specific queries
 */
async function generateStructuredResponse({ query, data, format }) {
  try {
    const systemPrompt = `You are a data formatter. Convert the provided data into the requested format.
Format: ${format}
Return ONLY valid JSON, no markdown, no explanations.`;

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Query: ${query}\n\nData: ${JSON.stringify(data)}` }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content);

  } catch (error) {
    console.error('❌ Structured Response Error:', error.message);
    throw error;
  }
}

module.exports = {
  callLLM,
  generateStructuredResponse,
};
