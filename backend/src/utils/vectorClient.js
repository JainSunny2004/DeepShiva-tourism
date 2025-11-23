const { ChromaClient } = require('chromadb');
const { CHROMA_HOST, CHROMA_PORT, CHROMA_COLLECTION } = require('../config/env');

let client = null;
let collection = null;

/**
 * Initialize ChromaDB client
 */
async function initializeChromaClient() {
  try {
    if (!client) {
      client = new ChromaClient({
        path: `http://${CHROMA_HOST}:${CHROMA_PORT}`,
      });
      console.log('✅ ChromaDB client initialized');
    }
    
    return client;
  } catch (error) {
    console.error('❌ ChromaDB initialization error:', error.message);
    throw error;
  }
}

/**
 * Get or create collection
 */
async function getCollection() {
  try {
    if (collection) return collection;

    if (!client) {
      await initializeChromaClient();
    }

    try {
      collection = await client.getCollection({ name: CHROMA_COLLECTION });
      console.log(`✅ Connected to existing collection: ${CHROMA_COLLECTION}`);
    } catch (error) {
      // Collection doesn't exist, create it
      collection = await client.createCollection({
        name: CHROMA_COLLECTION,
        metadata: { description: 'India Travel Knowledge Base' },
      });
      console.log(`✅ Created new collection: ${CHROMA_COLLECTION}`);
    }

    return collection;
  } catch (error) {
    console.error('❌ Get collection error:', error.message);
    throw error;
  }
}

/**
 * Add documents to collection
 */
async function addDocuments({ ids, documents, embeddings, metadatas }) {
  try {
    const coll = await getCollection();
    
    await coll.add({
      ids,
      documents,
      embeddings,
      metadatas,
    });

    console.log(`✅ Added ${ids.length} documents to ChromaDB`);
    return true;
  } catch (error) {
    console.error('❌ Add documents error:', error.message);
    throw error;
  }
}

/**
 * Query collection
 */
async function queryCollection({ queryEmbeddings, nResults = 5, where = null }) {
  try {
    const coll = await getCollection();
    
    const results = await coll.query({
      queryEmbeddings,
      nResults,
      where,
    });

    return results;
  } catch (error) {
    console.error('❌ Query collection error:', error.message);
    throw error;
  }
}

/**
 * Delete collection (for reset)
 */
async function deleteCollection() {
  try {
    if (!client) {
      await initializeChromaClient();
    }

    await client.deleteCollection({ name: CHROMA_COLLECTION });
    collection = null;
    console.log(`✅ Deleted collection: ${CHROMA_COLLECTION}`);
    return true;
  } catch (error) {
    console.error('❌ Delete collection error:', error.message);
    throw error;
  }
}

/**
 * Get collection stats
 */
async function getCollectionStats() {
  try {
    const coll = await getCollection();
    const count = await coll.count();
    
    return {
      name: CHROMA_COLLECTION,
      count,
      host: CHROMA_HOST,
      port: CHROMA_PORT,
    };
  } catch (error) {
    console.error('❌ Get stats error:', error.message);
    throw error;
  }
}

module.exports = {
  initializeChromaClient,
  getCollection,
  addDocuments,
  queryCollection,
  deleteCollection,
  getCollectionStats,
};
