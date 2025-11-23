// test.js
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_EMBEDDING_MODEL || 'cohere/embed-multilingual-v3.0';
const OPENROUTER_URL = process.env.OPENROUTER_URL || 'https://openrouter.ai/api/v1/embeddings';
const MOCK = (process.env.MOCK_EMBEDDINGS === 'true');
const EMBEDDING_DIM = parseInt(process.env.EMBEDDING_DIM || '1536', 10);

function deterministicVector(seed, dim = EMBEDDING_DIM) {
  let s = (seed % 2147483647) || 1;
  const arr = new Array(dim);
  for (let i = 0; i < dim; i++) {
    s = (s * 48271) % 2147483647;
    arr[i] = (s / 2147483647) * 2 - 1;
  }
  return arr;
}

async function testOpenRouterEmbedding(texts = ['hello world', 'namaste yatra']) {
  console.log('--- OpenRouter Embedding Test ---');
  if (MOCK) {
    console.log('MOCK_EMBEDDINGS is true — generating deterministic vectors locally.');
    const vecs = texts.map((t, i) => deterministicVector((t.length || 0) + i + 1));
    console.log(`Generated ${vecs.length} mock vectors. dim=${vecs[0].length}`);
    return { success: true, vectors: vecs };
  }

  if (!OPENROUTER_API_KEY) {
    console.error('OPENROUTER_API_KEY not set in .env — skipping OpenRouter test.');
    return { success: false, error: 'missing_key' };
  }

  try {
    const body = {
      model: OPENROUTER_MODEL,
      input: texts
    };
    const headers = {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    };

    const resp = await axios.post(OPENROUTER_URL, body, { headers, timeout: 30000 });
    // Normalize response shapes:
    // common shapes:
    // 1) { data: [{ embedding: [...] }, ...] }
    // 2) { data: { data: [{ embedding: [...] }, ...] } }
    let candidates = [];
    if (resp.data) {
      if (Array.isArray(resp.data)) {
        candidates = resp.data;
      } else if (Array.isArray(resp.data.data)) {
        candidates = resp.data.data;
      } else if (resp.data.data && Array.isArray(resp.data.data.data)) {
        candidates = resp.data.data.data;
      } else if (resp.data.data && Array.isArray(resp.data.data)) {
        candidates = resp.data.data;
      } else {
        // fallback: try to find any array with embedding
        const found = (function scan(obj) {
          if (!obj || typeof obj !== 'object') return null;
          if (Array.isArray(obj)) {
            if (obj.length && (obj[0].embedding || obj[0].vector)) return obj;
          }
          for (const k of Object.keys(obj)) {
            const res = scan(obj[k]);
            if (res) return res;
          }
          return null;
        })(resp.data);
        if (found) candidates = found;
      }
    }

    if (!Array.isArray(candidates) || candidates.length === 0) {
      console.error('OpenRouter returned unexpected shape — printing response snippet:');
      console.error(JSON.stringify(resp.data).slice(0, 1000));
      return { success: false, error: 'unexpected_shape', raw: resp.data };
    }

    // extract embedding vectors
    const vectors = candidates.map(item => item.embedding || item.vector || null);
    const validCount = vectors.filter(Boolean).length;
    console.log(`OpenRouter returned ${vectors.length} items, ${validCount} valid vectors.`);
    if (validCount > 0) {
      const dim = vectors.find(v => v && v.length)?.length;
      console.log('Example vector dimension:', dim);
    }
    return { success: true, vectors };
  } catch (err) {
    const status = err?.response?.status;
    const data = err?.response?.data;
    console.error('OpenRouter request failed:', status || '', err.message);
    if (data) console.error('Response snippet:', JSON.stringify(data).slice(0, 1000));
    return { success: false, error: err.message || String(err), status, data };
  }
}

(async () => {
  console.log('OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);
  console.log('OPENROUTER_API_KEY present:', !!OPENROUTER_API_KEY);
  console.log('OPENROUTER_MODEL ->', OPENROUTER_MODEL);
  console.log('CHROMA_HOST:PORT ->', `${process.env.CHROMA_HOST}:${process.env.CHROMA_PORT}`);
  console.log('MONGODB_URI present:', !!process.env.MONGODB_URI);

  // Ping Chroma
  try {
    const url = `http://${process.env.CHROMA_HOST || 'localhost'}:${process.env.CHROMA_PORT || 8000}/`;
    const resp = await axios.get(url, { timeout: 5000 }).catch(e => e.response || e);
    console.log('Chroma ping status:', resp && resp.status ? resp.status : 'no response or error');
  } catch (err) {
    console.error('Chroma ping error:', err.message || err);
  }

  // Ping Mongo
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI missing');
    await mongoose.connect(uri, { dbName: 'india-travel-rag', connectTimeoutMS: 5000 });
    console.log('Mongo connected OK');
    await mongoose.disconnect();
  } catch (err) {
    console.error('Mongo connection failed:', err.message || err);
  }

  // Test OpenRouter embeddings
  const embedTest = await testOpenRouterEmbedding(['hello world', 'namaste yatra']);
  if (!embedTest.success) {
    console.error('OpenRouter embedding test failed or skipped.');
    if (embedTest.error) console.error('Error:', embedTest.error);
    // don't exit with non-zero yet — user might want to continue
  }

  process.exit(0);
})();
