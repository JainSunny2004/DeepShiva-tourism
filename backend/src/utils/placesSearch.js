const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../config/env');

/**
 * Load JSON data file
 */
function loadDataFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error loading ${filename}:`, error.message);
    return null;
  }
}

/**
 * Search spiritual sites
 */
function searchSpiritualSites({ query, state, category }) {
  try {
    const data = loadDataFile('spiritualSites.json');
    if (!data || !data.sites) return [];

    let results = data.sites;

    // Filter by query
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(site => 
        site.name.toLowerCase().includes(lowerQuery) ||
        site.type.toLowerCase().includes(lowerQuery) ||
        site.description?.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by state
    if (state) {
      results = results.filter(site => 
        site.state.toLowerCase() === state.toLowerCase()
      );
    }

    // Filter by category
    if (category) {
      results = results.filter(site => 
        site.category === category
      );
    }

    return results;

  } catch (error) {
    console.error('❌ Search Spiritual Sites Error:', error.message);
    return [];
  }
}

/**
 * Search treks
 */
function searchTreks({ query, difficulty, state, maxAltitude }) {
  try {
    const data = loadDataFile('treks.json');
    if (!data || !data.treks) return [];

    let results = data.treks;

    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(trek => 
        trek.name.toLowerCase().includes(lowerQuery) ||
        trek.description?.toLowerCase().includes(lowerQuery)
      );
    }

    if (difficulty) {
      results = results.filter(trek => 
        trek.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    if (state) {
      results = results.filter(trek => 
        trek.state.toLowerCase() === state.toLowerCase()
      );
    }

    if (maxAltitude) {
      results = results.filter(trek => 
        trek.max_altitude_m <= maxAltitude
      );
    }

    return results;

  } catch (error) {
    console.error('❌ Search Treks Error:', error.message);
    return [];
  }
}

/**
 * Search homestays
 */
function searchHomestays({ state, category, ecoRating, priceRange }) {
  try {
    const data = loadDataFile('homestays.json');
    if (!data || !data.homestays) return [];

    let results = data.homestays;

    if (state) {
      results = results.filter(hs => 
        hs.state.toLowerCase() === state.toLowerCase()
      );
    }

    if (category) {
      results = results.filter(hs => 
        hs.category === category
      );
    }

    if (ecoRating) {
      results = results.filter(hs => 
        hs.eco_rating >= ecoRating
      );
    }

    // Price range filtering would need more sophisticated logic
    // For now, simple string matching
    if (priceRange) {
      results = results.filter(hs => 
        hs.price_range?.includes(priceRange)
      );
    }

    return results;

  } catch (error) {
    console.error('❌ Search Homestays Error:', error.message);
    return [];
  }
}

/**
 * Search festivals
 */
function searchFestivals({ month, state, category }) {
  try {
    const data = loadDataFile('festivals.json');
    if (!data || !data.festivals) return [];

    let results = data.festivals;

    if (month) {
      results = results.filter(fest => 
        fest.typical_months?.some(m => m.toLowerCase().includes(month.toLowerCase()))
      );
    }

    if (state) {
      results = results.filter(fest => 
        fest.states_celebrated?.some(s => s.toLowerCase().includes(state.toLowerCase()))
      );
    }

    if (category) {
      results = results.filter(fest => 
        fest.category === category
      );
    }

    return results;

  } catch (error) {
    console.error('❌ Search Festivals Error:', error.message);
    return [];
  }
}

/**
 * Get recommendations based on preferences
 */
function getRecommendations({ preferences, location, season }) {
  const recommendations = {
    spiritual_sites: [],
    treks: [],
    homestays: [],
    festivals: [],
    cuisines: [],
  };

  try {
    // Spiritual sites
    if (preferences.spiritual) {
      recommendations.spiritual_sites = searchSpiritualSites({ 
        state: location,
      }).slice(0, 5);
    }

    // Treks
    if (preferences.adventure) {
      recommendations.treks = searchTreks({ 
        state: location,
        difficulty: preferences.trekDifficulty || undefined,
      }).slice(0, 5);
    }

    // Homestays
    if (preferences.eco) {
      recommendations.homestays = searchHomestays({ 
        state: location,
        ecoRating: 4,
      }).slice(0, 5);
    }

    // Festivals (by season/month)
    if (season) {
      recommendations.festivals = searchFestivals({ 
        state: location,
      }).slice(0, 3);
    }

    return recommendations;

  } catch (error) {
    console.error('❌ Get Recommendations Error:', error.message);
    return recommendations;
  }
}

module.exports = {
  searchSpiritualSites,
  searchTreks,
  searchHomestays,
  searchFestivals,
  getRecommendations,
};
