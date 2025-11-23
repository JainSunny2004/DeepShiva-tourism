const { searchSpiritualSites, searchTreks, searchHomestays, searchFestivals, getRecommendations } = require('../utils/placesSearch');
const { predictCrowdLevel, getBestVisitTimes } = require('../utils/crowdPrediction');
const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../config/env');

/**
 * Search spiritual sites
 */
async function searchSites(req, res) {
  try {
    const { query, state, category } = req.query;

    const results = searchSpiritualSites({ query, state, category });

    res.json({
      success: true,
      results,
      count: results.length,
    });

  } catch (error) {
    console.error('❌ Search Sites Error:', error);
    res.status(500).json({ error: 'Failed to search sites' });
  }
}

/**
 * Search treks
 */
async function searchTreksEndpoint(req, res) {
  try {
    const { query, difficulty, state, maxAltitude } = req.query;

    const results = searchTreks({ 
      query, 
      difficulty, 
      state, 
      maxAltitude: maxAltitude ? parseInt(maxAltitude) : undefined 
    });

    res.json({
      success: true,
      results,
      count: results.length,
    });

  } catch (error) {
    console.error('❌ Search Treks Error:', error);
    res.status(500).json({ error: 'Failed to search treks' });
  }
}

/**
 * Search homestays
 */
async function searchHomestaysEndpoint(req, res) {
  try {
    const { state, category, ecoRating } = req.query;

    const results = searchHomestays({ 
      state, 
      category, 
      ecoRating: ecoRating ? parseFloat(ecoRating) : undefined 
    });

    res.json({
      success: true,
      results,
      count: results.length,
    });

  } catch (error) {
    console.error('❌ Search Homestays Error:', error);
    res.status(500).json({ error: 'Failed to search homestays' });
  }
}

/**
 * Search festivals
 */
async function searchFestivalsEndpoint(req, res) {
  try {
    const { month, state, category } = req.query;

    const results = searchFestivals({ month, state, category });

    res.json({
      success: true,
      results,
      count: results.length,
    });

  } catch (error) {
    console.error('❌ Search Festivals Error:', error);
    res.status(500).json({ error: 'Failed to search festivals' });
  }
}

/**
 * Get crowd prediction
 */
async function getCrowdPrediction(req, res) {
  try {
    const { locationId, date } = req.query;

    if (!locationId || !date) {
      return res.status(400).json({ error: 'Location ID and date required' });
    }

    // Load crowd pattern data
    const filePath = path.join(DATA_DIR, 'crowdPatterns.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const crowdPattern = data.patterns?.find(p => p.place_id === locationId);

    const prediction = predictCrowdLevel({
      locationId,
      date,
      crowdPatternData: crowdPattern,
    });

    res.json({
      success: true,
      prediction,
    });

  } catch (error) {
    console.error('❌ Crowd Prediction Error:', error);
    res.status(500).json({ error: 'Failed to predict crowd levels' });
  }
}

/**
 * Get best visit times
 */
async function getBestTimes(req, res) {
  try {
    const { locationId } = req.query;

    if (!locationId) {
      return res.status(400).json({ error: 'Location ID required' });
    }

    // Load crowd pattern data
    const filePath = path.join(DATA_DIR, 'crowdPatterns.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const crowdPattern = data.patterns?.find(p => p.place_id === locationId);

    const bestTimes = getBestVisitTimes(crowdPattern);

    res.json({
      success: true,
      bestTimes,
    });

  } catch (error) {
    console.error('❌ Best Times Error:', error);
    res.status(500).json({ error: 'Failed to get best times' });
  }
}

/**
 * Get personalized recommendations
 */
async function getPersonalizedRecommendations(req, res) {
  try {
    const { preferences, location, season } = req.query;

    const parsedPreferences = preferences ? JSON.parse(preferences) : {};

    const recommendations = getRecommendations({
      preferences: parsedPreferences,
      location,
      season,
    });

    res.json({
      success: true,
      recommendations,
    });

  } catch (error) {
    console.error('❌ Recommendations Error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
}

module.exports = {
  searchSites,
  searchTreksEndpoint,
  searchHomestaysEndpoint,
  searchFestivalsEndpoint,
  getCrowdPrediction,
  getBestTimes,
  getPersonalizedRecommendations,
};
