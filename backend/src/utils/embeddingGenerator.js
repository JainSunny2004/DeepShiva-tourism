// src/utils/embeddings.js
// Replaces OpenAI embedding client with OpenRouter (cohere) + mock + retries.
// Keeps prepareTextForEmbedding logic from the original file.

const axios = require('axios');

const {
  // keep compatibility in case other code imports these env names
  OPENAI_EMBEDDING_MODEL,
} = require('../config/env'); // keep existing import pattern if used elsewhere

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_EMBEDDING_MODEL = process.env.OPENROUTER_EMBEDDING_MODEL || 'cohere/embed-multilingual-v3.0';
const OPENROUTER_URL = process.env.OPENROUTER_URL || 'https://openrouter.ai/api/v1/embeddings';

const MOCK = (process.env.MOCK_EMBEDDINGS === 'true');
const EMBEDDING_DIM = parseInt(process.env.EMBEDDING_DIM || '1536', 10);
const BATCH_SIZE = parseInt(process.env.INGEST_BATCH_SIZE || '8', 10);
const RETRIES = parseInt(process.env.INGEST_RETRIES || '5', 10);
const INITIAL_DELAY_MS = 1000;

/**
 * deterministicVector
 * simple deterministic pseudo-random generator for mock embeddings
 */
function deterministicVector(seed, dim = EMBEDDING_DIM) {
  let s = (seed % 2147483647) || 1;
  const arr = new Array(dim);
  for (let i = 0; i < dim; i++) {
    s = (s * 48271) % 2147483647;
    arr[i] = (s / 2147483647) * 2 - 1;
  }
  return arr;
}

/**
 * sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * callOpenRouterEmbeddings
 * Sends a single request to OpenRouter embeddings endpoint.
 * Expects OpenRouter's response to include data.data[].embedding (common shape).
 */
async function callOpenRouterEmbeddings(inputs) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables.');
  }

  const body = {
    model: OPENROUTER_EMBEDDING_MODEL,
    input: inputs,
  };

  const headers = {
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json'
  };

  const resp = await axios.post(OPENROUTER_URL, body, {
    headers,
    timeout: 30000
  });

  // Normalize common possible shapes:
  // 1) { data: [{ embedding: [...] }, ...] } or
  // 2) { data: { data: [{ embedding: [...] }, ...] } } depending on gateway
  if (resp.data) {
    // shape: resp.data.data?.data or resp.data.data
    const top = resp.data.data ?? resp.data;
    // If top is { data: [...] }
    const arr = Array.isArray(top.data) ? top.data : top;
    if (Array.isArray(arr)) {
      return arr.map(item => item.embedding || item.vector || null);
    }
  }

  // fallback: if response shape unexpected, return error with preview
  throw new Error('Unexpected OpenRouter response: ' + JSON.stringify(resp.data).slice(0, 500));
}

/**
 * getEmbeddingsWithRetries
 * Wrapper that retries on transient errors (429, 5xx) with exponential backoff.
 */
async function getEmbeddingsWithRetries(inputs) {
  let attempt = 0;
  let delay = INITIAL_DELAY_MS;
  while (true) {
    try {
      return await callOpenRouterEmbeddings(inputs);
    } catch (err) {
      attempt++;
      const status = err?.response?.status;
      // retry on rate limits or server errors or network glitches
      if (attempt <= RETRIES && (status === 429 || (status >= 500 && status < 600) || !status)) {
        console.warn(`OpenRouter embeddings error (status=${status}). Retry ${attempt}/${RETRIES} after ${delay}ms`);
        await sleep(delay);
        delay *= 2;
        continue;
      }
      // no more retries, rethrow with useful message
      const msg = err?.response?.data ? JSON.stringify(err.response.data).slice(0, 1000) : (err.message || String(err));
      throw new Error(`OpenRouter embedding failed: ${msg}`);
    }
  }
}

/**
 * generateEmbedding(text)
 * Single text embedding (calls batch implementation under the hood)
 */
async function generateEmbedding(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text input for embedding');
  }

  if (MOCK) {
    return deterministicVector(text.length + 1, EMBEDDING_DIM);
  }

  // Use batch API with a single-element array
  const embeddings = await getEmbeddingsWithRetries([text.trim()]);
  if (!embeddings || !embeddings[0]) {
    throw new Error('No embedding returned from OpenRouter');
  }
  return embeddings[0];
}

/**
 * generateEmbeddingsBatch(texts)
 * Accepts array of strings, returns array of embedding vectors in same order.
 * Batches requests with BATCH_SIZE and uses retries.
 */
async function generateEmbeddingsBatch(texts) {
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new Error('Invalid texts array for batch embedding');
  }

  // if mock mode, generate deterministic vectors
  if (MOCK) {
    return texts.map((t, idx) => deterministicVector((t.length || 0) + idx + 1, EMBEDDING_DIM));
  }

  const results = [];
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE).map(t => (t || '').trim());
    try {
      const res = await getEmbeddingsWithRetries(batch);
      if (!Array.isArray(res) || res.length !== batch.length) {
        // if provider returns unexpected shape, still try to push whatever we have
        throw new Error('Embedding response length mismatch or unexpected format.');
      }
      results.push(...res);
      console.log(`Generated embeddings for batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(texts.length / BATCH_SIZE)}`);
    } catch (err) {
      console.error('❌ Batch Embedding Error:', err.message || err);
      throw new Error(`Failed to generate batch embeddings: ${err.message || err}`);
    }
  }

  return results;
}

/**
 * prepareTextForEmbedding(data, type)
 * --- copied from your original file with no logic changes ---
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
