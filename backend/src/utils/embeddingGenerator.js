const OpenAI = require('openai');
const { OPENAI_API_KEY, OPENAI_EMBEDDING_MODEL } = require('../config/env');

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

/**
 * Generate embedding for text using OpenAI
 */
async function generateEmbedding(text) {
  try {
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid text input for embedding');
    }

    const response = await openai.embeddings.create({
      model: OPENAI_EMBEDDING_MODEL,
      input: text.trim(),
    });

    return response.data[0].embedding;

  } catch (error) {
    console.error('❌ Embedding Generation Error:', error.message);
    throw new Error(`Failed to generate embedding: ${error.message}`);
  }
}

/**
 * Generate embeddings for multiple texts (batch)
 */
async function generateEmbeddingsBatch(texts) {
  try {
    if (!Array.isArray(texts) || texts.length === 0) {
      throw new Error('Invalid texts array for batch embedding');
    }

    // OpenAI supports batch up to 2048 texts
    const batchSize = 100;
    const embeddings = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      
      const response = await openai.embeddings.create({
        model: OPENAI_EMBEDDING_MODEL,
        input: batch.map(t => t.trim()),
      });

      embeddings.push(...response.data.map(d => d.embedding));
      
      console.log(`Generated embeddings for batch ${i / batchSize + 1}/${Math.ceil(texts.length / batchSize)}`);
    }

    return embeddings;

  } catch (error) {
    console.error('❌ Batch Embedding Error:', error.message);
    throw new Error(`Failed to generate batch embeddings: ${error.message}`);
  }
}

/**
 * Prepare text for embedding (cleaning and formatting)
 */
function prepareTextForEmbedding(data, type) {
  let text = '';

  switch (type) {
    case 'spiritual_site':
      text = `${data.name} in ${data.state}. ${data.quick_version} ${data.description || ''} ${data.mythological_significance || ''} Best season: ${data.best_season || 'N/A'}`;
      break;

    case 'trek':
      text = `${data.name} trek in ${data.state}. Difficulty: ${data.difficulty}. ${data.quick_version} ${data.description || ''} Best season: ${data.best_season || 'N/A'}`;
      break;

    case 'cuisine':
      text = `${data.dish_name} from ${data.state}. ${data.quick_version} ${data.description || ''} Best season: ${data.when_to_try || 'Year-round'}`;
      break;

    case 'festival':
      text = `${data.name} festival. ${data.quick_version} ${data.description || ''} ${data.mythological_background || ''} Celebrated in: ${data.states_celebrated?.join(', ') || 'Various locations'}`;
      break;

    case 'emergency':
      text = `Emergency: ${data.category}. ${data.quick_version} ${data.description || ''} Prevention: ${data.prevention_tips || 'N/A'}`;
      break;

    case 'eco_tip':
      text = `Eco tip: ${data.context}. ${data.quick_version} ${data.tip} ${data.explanation || ''}`;
      break;

    case 'wellness':
      text = `${data.name} - ${data.routine_type}. ${data.quick_version} Target mood: ${data.target_mood || 'N/A'} Duration: ${data.duration_minutes || 'N/A'} minutes`;
      break;

    case 'homestay':
      text = `${data.name} homestay in ${data.state}. ${data.quick_version} ${data.description || ''} Price: ${data.price_range || 'N/A'}`;
      break;

    case 'shloka':
      text = `Shloka: ${data.transliteration || data.sanskrit}. ${data.meaning_english} Usage: ${data.use_context || 'N/A'}`;
      break;

    case 'persona':
      text = `Persona: ${data.name}. ${data.quick_version} ${data.description || ''}`;
      break;

    case 'crowd_pattern':
      text = `Crowd patterns for ${data.name} in ${data.state}. ${data.quick_version} Peak months: ${data.peak_months?.join(', ') || 'N/A'}`;
      break;

    default:
      text = JSON.stringify(data);
  }

  return text.substring(0, 8000); // Truncate if too long
}

module.exports = {
  generateEmbedding,
  generateEmbeddingsBatch,
  prepareTextForEmbedding,
};
