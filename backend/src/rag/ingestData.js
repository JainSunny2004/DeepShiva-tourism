const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../config/env');
const { generateEmbeddingsBatch, prepareTextForEmbedding } = require('../utils/embeddingGenerator');
const { initializeChromaClient, deleteCollection, addDocuments } = require('../utils/vectorClient');

/**
 * Main ingestion script
 */
async function ingestAllData() {
  console.log('🚀 Starting data ingestion...\n');

  try {
    // Initialize ChromaDB
    await initializeChromaClient();

    // Delete existing collection (fresh start)
    try {
      await deleteCollection();
      console.log('✅ Cleared existing collection\n');
    } catch (error) {
      console.log('ℹ️  No existing collection to clear\n');
    }

    // Re-initialize collection
    await initializeChromaClient();

    // Ingest each dataset
    await ingestSpiritualSites();
    await ingestTreks();
    await ingestCuisines();
    await ingestFestivals();
    await ingestEmergencies();
    await ingestEcoTips();
    await ingestWellness();
    await ingestHomestays();
    await ingestShlokas();
    await ingestPersonas();
    await ingestCrowdPatterns();

    console.log('\n✅ All data ingested successfully!');

  } catch (error) {
    console.error('❌ Ingestion failed:', error.message);
    process.exit(1);
  }
}

/**
 * Ingest spiritual sites
 */
async function ingestSpiritualSites() {
  console.log('📿 Ingesting spiritual sites...');
  
  const filePath = path.join(DATA_DIR, 'spiritualSites.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.sites || data.sites.length === 0) {
    console.log('⚠️  No spiritual sites found');
    return;
  }

  const ids = [];
  const documents = [];
  const metadatas = [];

  for (const site of data.sites) {
    ids.push(site.id);
    documents.push(prepareTextForEmbedding(site, 'spiritual_site'));
    metadatas.push({
      type: 'spiritual_site',
      category: site.category || 'general',
      state: site.state || 'Unknown',
      name: site.name,
      content: JSON.stringify(site),
    });
  }

  const embeddings = await generateEmbeddingsBatch(documents);
  await addDocuments({ ids, documents, embeddings, metadatas });

  console.log(`✅ Ingested ${data.sites.length} spiritual sites\n`);
}

/**
 * Ingest treks
 */
async function ingestTreks() {
  console.log('🏔️  Ingesting treks...');
  
  const filePath = path.join(DATA_DIR, 'treks.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.treks || data.treks.length === 0) {
    console.log('⚠️  No treks found');
    return;
  }

  const ids = [];
  const documents = [];
  const metadatas = [];

  for (const trek of data.treks) {
    ids.push(trek.id);
    documents.push(prepareTextForEmbedding(trek, 'trek'));
    metadatas.push({
      type: 'trek',
      category: trek.category || 'general',
      state: trek.state || 'Unknown',
      difficulty: trek.difficulty || 'Unknown',
      name: trek.name,
      content: JSON.stringify(trek),
    });
  }

  const embeddings = await generateEmbeddingsBatch(documents);
  await addDocuments({ ids, documents, embeddings, metadatas });

  console.log(`✅ Ingested ${data.treks.length} treks\n`);
}

/**
 * Ingest cuisines
 */
async function ingestCuisines() {
  console.log('🍛 Ingesting cuisines...');
  
  const filePath = path.join(DATA_DIR, 'cuisines.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.cuisines || data.cuisines.length === 0) {
    console.log('⚠️  No cuisines found');
    return;
  }

  const ids = [];
  const documents = [];
  const metadatas = [];

  for (const cuisine of data.cuisines) {
    ids.push(cuisine.id);
    documents.push(prepareTextForEmbedding(cuisine, 'cuisine'));
    metadatas.push({
      type: 'cuisine',
      category: cuisine.category || 'general',
      state: cuisine.state || 'Unknown',
      name: cuisine.dish_name,
      content: JSON.stringify(cuisine),
    });
  }

  const embeddings = await generateEmbeddingsBatch(documents);
  await addDocuments({ ids, documents, embeddings, metadatas });

  console.log(`✅ Ingested ${data.cuisines.length} cuisines\n`);
}

/**
 * Ingest festivals
 */
async function ingestFestivals() {
  console.log('🎉 Ingesting festivals...');
  
  const filePath = path.join(DATA_DIR, 'festivals.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.festivals || data.festivals.length === 0) {
    console.log('⚠️  No festivals found');
    return;
  }

  const ids = [];
  const documents = [];
  const metadatas = [];

  for (const festival of data.festivals) {
    ids.push(festival.id);
    documents.push(prepareTextForEmbedding(festival, 'festival'));
    metadatas.push({
      type: 'festival',
      category: festival.category || 'general',
      name: festival.name,
      content: JSON.stringify(festival),
    });
  }

  const embeddings = await generateEmbeddingsBatch(documents);
  await addDocuments({ ids, documents, embeddings, metadatas });

  console.log(`✅ Ingested ${data.festivals.length} festivals\n`);
}

/**
 * Ingest emergencies
 */
async function ingestEmergencies() {
  console.log('🚨 Ingesting emergency info...');
  
  const filePath = path.join(DATA_DIR, 'emergencyInfo.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.emergencies || data.emergencies.length === 0) {
    console.log('⚠️  No emergency info found');
    return;
  }

  const ids = [];
  const documents = [];
  const metadatas = [];

  for (const emergency of data.emergencies) {
    ids.push(emergency.id);
    documents.push(prepareTextForEmbedding(emergency, 'emergency'));
    metadatas.push({
      type: 'emergency',
      category: emergency.category || 'general',
      name: emergency.category,
      content: JSON.stringify(emergency),
    });
  }

  const embeddings = await generateEmbeddingsBatch(documents);
  await addDocuments({ ids, documents, embeddings, metadatas });

  console.log(`✅ Ingested ${data.emergencies.length} emergency entries\n`);
}

/**
 * Ingest eco tips
 */
async function ingestEcoTips() {
  console.log('🌱 Ingesting eco tips...');
  
  const filePath = path.join(DATA_DIR, 'ecoTips.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.tips || data.tips.length === 0) {
    console.log('⚠️  No eco tips found');
    return;
  }

  const ids = [];
  const documents = [];
  const metadatas = [];

  for (const tip of data.tips) {
    ids.push(tip.id);
    documents.push(prepareTextForEmbedding(tip, 'eco_tip'));
    metadatas.push({
      type: 'eco_tip',
      category: tip.category || 'general',
      name: tip.context,
      content: JSON.stringify(tip),
    });
  }

  const embeddings = await generateEmbeddingsBatch(documents);
  await addDocuments({ ids, documents, embeddings, metadatas });

  console.log(`✅ Ingested ${data.tips.length} eco tips\n`);
}

/**
 * Ingest wellness routines
 */
async function ingestWellness() {
  console.log('🧘 Ingesting wellness routines...');
  
  const filePath = path.join(DATA_DIR, 'wellness.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.routines || data.routines.length === 0) {
    console.log('⚠️  No wellness routines found');
    return;
  }

  const ids = [];
  const documents = [];
  const metadatas = [];

  for (const routine of data.routines) {
    ids.push(routine.id);
    documents.push(prepareTextForEmbedding(routine, 'wellness'));
    metadatas.push({
      type: 'wellness',
      category: routine.routine_type || 'general',
      name: routine.name,
      content: JSON.stringify(routine),
    });
  }

  const embeddings = await generateEmbeddingsBatch(documents);
  await addDocuments({ ids, documents, embeddings, metadatas });

  console.log(`✅ Ingested ${data.routines.length} wellness routines\n`);
}

/**
 * Ingest homestays
 */
async function ingestHomestays() {
  console.log('🏡 Ingesting homestays...');
  
  const filePath = path.join(DATA_DIR, 'homestays.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.homestays || data.homestays.length === 0) {
    console.log('⚠️  No homestays found');
    return;
  }

  const ids = [];
  const documents = [];
  const metadatas = [];

  for (const homestay of data.homestays) {
    ids.push(homestay.id);
    documents.push(prepareTextForEmbedding(homestay, 'homestay'));
    metadatas.push({
      type: 'homestay',
      category: homestay.category || 'general',
      state: homestay.state || 'Unknown',
      name: homestay.name,
      content: JSON.stringify(homestay),
    });
  }

  const embeddings = await generateEmbeddingsBatch(documents);
  await addDocuments({ ids, documents, embeddings, metadatas });

  console.log(`✅ Ingested ${data.homestays.length} homestays\n`);
}

/**
 * Ingest shlokas
 */
async function ingestShlokas() {
  console.log('🕉️  Ingesting shlokas...');
  
  const filePath = path.join(DATA_DIR, 'shlokas.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.shlokas || data.shlokas.length === 0) {
    console.log('⚠️  No shlokas found');
    return;
  }

  const ids = [];
  const documents = [];
  const metadatas = [];

  for (const shloka of data.shlokas) {
    ids.push(shloka.id);
    documents.push(prepareTextForEmbedding(shloka, 'shloka'));
    metadatas.push({
      type: 'shloka',
      category: shloka.category || 'general',
      name: shloka.transliteration || shloka.sanskrit,
      content: JSON.stringify(shloka),
    });
  }

  const embeddings = await generateEmbeddingsBatch(documents);
  await addDocuments({ ids, documents, embeddings, metadatas });

  console.log(`✅ Ingested ${data.shlokas.length} shlokas\n`);
}

/**
 * Ingest personas
 */
async function ingestPersonas() {
  console.log('👤 Ingesting personas...');
  
  const filePath = path.join(DATA_DIR, 'personas.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.personas || data.personas.length === 0) {
    console.log('⚠️  No personas found');
    return;
  }

  const ids = [];
  const documents = [];
  const metadatas = [];

  for (const persona of data.personas) {
    ids.push(persona.id);
    documents.push(prepareTextForEmbedding(persona, 'persona'));
    metadatas.push({
      type: 'persona',
      category: persona.category || 'general',
      name: persona.name,
      content: JSON.stringify(persona),
    });
  }

  const embeddings = await generateEmbeddingsBatch(documents);
  await addDocuments({ ids, documents, embeddings, metadatas });

  console.log(`✅ Ingested ${data.personas.length} personas\n`);
}

/**
 * Ingest crowd patterns
 */
async function ingestCrowdPatterns() {
  console.log('👥 Ingesting crowd patterns...');
  
  const filePath = path.join(DATA_DIR, 'crowdPatterns.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.patterns || data.patterns.length === 0) {
    console.log('⚠️  No crowd patterns found');
    return;
  }

  const ids = [];
  const documents = [];
  const metadatas = [];

  for (const pattern of data.patterns) {
    ids.push(pattern.id);
    documents.push(prepareTextForEmbedding(pattern, 'crowd_pattern'));
    metadatas.push({
      type: 'crowd_pattern',
      category: pattern.category || 'general',
      state: pattern.state || 'Unknown',
      name: pattern.name,
      content: JSON.stringify(pattern),
    });
  }

  const embeddings = await generateEmbeddingsBatch(documents);
  await addDocuments({ ids, documents, embeddings, metadatas });

  console.log(`✅ Ingested ${data.patterns.length} crowd patterns\n`);
}

// Run if called directly
if (require.main === module) {
  ingestAllData()
    .then(() => {
      console.log('\n🎉 Ingestion complete! Exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Ingestion failed:', error);
      process.exit(1);
    });
}

module.exports = { ingestAllData };
