const { generateEmbedding } = require('./embeddingGenerator');
const { queryCollection } = require('./vectorClient');

/**
 * RAG retrieval pipeline
 */
async function retrieveContext({ 
  query, 
  topK = 5, 
  filterType = null,
  filterState = null 
}) {
  try {
    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);

    // Build metadata filter
    let whereFilter = null;
    if (filterType || filterState) {
      whereFilter = {};
      if (filterType) whereFilter.type = filterType;
      if (filterState) whereFilter.state = filterState;
    }

    // Query ChromaDB
    const results = await queryCollection({
      queryEmbeddings: [queryEmbedding],
      nResults: topK,
      where: whereFilter,
    });

    // Format results
    const retrievedDocs = [];
    if (results.ids && results.ids[0]) {
      for (let i = 0; i < results.ids[0].length; i++) {
        retrievedDocs.push({
          id: results.ids[0][i],
          content: JSON.parse(results.documents[0][i]),
          metadata: results.metadatas[0][i],
          distance: results.distances[0][i],
          score: 1 - results.distances[0][i], // Convert distance to similarity score
        });
      }
    }

    return retrievedDocs;

  } catch (error) {
    console.error('❌ RAG Retrieval Error:', error.message);
    throw error;
  }
}

/**
 * Multi-query retrieval for complex questions
 */
async function multiQueryRetrieval({ queries, topKPerQuery = 3 }) {
  try {
    const allResults = [];

    for (const query of queries) {
      const results = await retrieveContext({ query, topK: topKPerQuery });
      allResults.push(...results);
    }

    // Deduplicate by ID and sort by score
    const uniqueResults = [];
    const seenIds = new Set();

    for (const doc of allResults) {
      if (!seenIds.has(doc.id)) {
        seenIds.add(doc.id);
        uniqueResults.push(doc);
      }
    }

    uniqueResults.sort((a, b) => b.score - a.score);

    return uniqueResults.slice(0, 10); // Return top 10

  } catch (error) {
    console.error('❌ Multi-Query Retrieval Error:', error.message);
    throw error;
  }
}

/**
 * Retrieve by category/type
 */
async function retrieveByCategory({ category, limit = 10 }) {
  try {
    const queryEmbedding = await generateEmbedding(`Information about ${category}`);

    const results = await queryCollection({
      queryEmbeddings: [queryEmbedding],
      nResults: limit,
      where: { category: category },
    });

    const retrievedDocs = [];
    if (results.ids && results.ids[0]) {
      for (let i = 0; i < results.ids[0].length; i++) {
        retrievedDocs.push({
          id: results.ids[0][i],
          content: JSON.parse(results.documents[0][i]),
          metadata: results.metadatas[0][i],
        });
      }
    }

    return retrievedDocs;

  } catch (error) {
    console.error('❌ Category Retrieval Error:', error.message);
    throw error;
  }
}

/**
 * Calculate confidence score based on retrieval results
 */
function calculateConfidence(retrievedDocs) {
  if (!retrievedDocs || retrievedDocs.length === 0) {
    return 0.3; // Low confidence without context
  }

  // Average similarity scores of top results
  const avgScore = retrievedDocs.slice(0, 3).reduce((sum, doc) => sum + doc.score, 0) / Math.min(3, retrievedDocs.length);

  // Confidence based on similarity and number of results
  let confidence = avgScore * 0.7;
  if (retrievedDocs.length >= 5) {
    confidence += 0.2;
  } else if (retrievedDocs.length >= 3) {
    confidence += 0.1;
  }

  return Math.min(Math.max(confidence, 0), 1); // Clamp between 0 and 1
}

module.exports = {
  retrieveContext,
  multiQueryRetrieval,
  retrieveByCategory,
  calculateConfidence,
};
