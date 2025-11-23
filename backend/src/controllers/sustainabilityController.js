const { calculateCarbonFootprint, compareTransportOptions } = require('../utils/carbonCalculator');
const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../config/env');

/**
 * Calculate carbon footprint
 */
async function calculateCarbon(req, res) {
  try {
    const { travelMode, distanceKm, accommodationType, durationDays } = req.body;

    if (!travelMode || !distanceKm || !accommodationType || !durationDays) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const result = calculateCarbonFootprint({
      travelMode,
      distanceKm: parseFloat(distanceKm),
      accommodationType,
      durationDays: parseInt(durationDays),
    });

    res.json({
      success: true,
      carbonFootprint: result,
    });

  } catch (error) {
    console.error('❌ Calculate Carbon Error:', error);
    res.status(500).json({ error: 'Failed to calculate carbon footprint' });
  }
}

/**
 * Compare transport options
 */
async function compareTransport(req, res) {
  try {
    const { distanceKm } = req.query;

    if (!distanceKm) {
      return res.status(400).json({ error: 'Distance required' });
    }

    const comparison = compareTransportOptions(parseFloat(distanceKm));

    res.json({
      success: true,
      comparison,
    });

  } catch (error) {
    console.error('❌ Compare Transport Error:', error);
    res.status(500).json({ error: 'Failed to compare transport options' });
  }
}

/**
 * Get eco tips
 */
async function getEcoTips(req, res) {
  try {
    const { category, context } = req.query;

    const filePath = path.join(DATA_DIR, 'ecoTips.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    let tips = data.tips || [];

    if (category) {
      tips = tips.filter(t => t.category === category);
    }

    if (context) {
      tips = tips.filter(t => t.context.toLowerCase().includes(context.toLowerCase()));
    }

    res.json({
      success: true,
      tips,
      count: tips.length,
    });

  } catch (error) {
    console.error('❌ Get Eco Tips Error:', error);
    res.status(500).json({ error: 'Failed to fetch eco tips' });
  }
}

/**
 * Get eco-friendly homestays
 */
async function getEcoHomestays(req, res) {
  try {
    const { minEcoRating = 4, state } = req.query;

    const filePath = path.join(DATA_DIR, 'homestays.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    let homestays = data.homestays || [];

    homestays = homestays.filter(h => h.eco_rating >= parseFloat(minEcoRating));

    if (state) {
      homestays = homestays.filter(h => h.state.toLowerCase() === state.toLowerCase());
    }

    res.json({
      success: true,
      homestays,
      count: homestays.length,
    });

  } catch (error) {
    console.error('❌ Get Eco Homestays Error:', error);
    res.status(500).json({ error: 'Failed to fetch eco-friendly homestays' });
  }
}

module.exports = {
  calculateCarbon,
  compareTransport,
  getEcoTips,
  getEcoHomestays,
};
