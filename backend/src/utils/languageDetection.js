const nlp = require('compromise');

/**
 * Detect language of text (simple heuristic-based)
 */
function detectLanguage(text) {
  if (!text || typeof text !== 'string') {
    return 'en';
  }

  // Check for Devanagari script (Hindi)
  const devanagariRegex = /[\u0900-\u097F]/;
  if (devanagariRegex.test(text)) {
    return 'hi';
  }

  // Check for common Hindi words in romanized form
  const hindiKeywords = ['namaste', 'dhanyavad', 'kripya', 'kaise', 'kahan', 'kya', 'hai', 'hain', 'mandir', 'darshan'];
  const lowerText = text.toLowerCase();
  
  const hindiWordCount = hindiKeywords.filter(word => lowerText.includes(word)).length;
  if (hindiWordCount >= 2) {
    return 'hi';
  }

  // Default to English
  return 'en';
}

/**
 * Extract intent from user query
 */
function extractIntent(query) {
  const lowerQuery = query.toLowerCase();

  // Intent patterns
  const intents = {
    trek_info: ['trek', 'hiking', 'mountain', 'climb', 'altitude'],
    spiritual_info: ['temple', 'mandir', 'pilgrimage', 'darshan', 'aarti', 'shloka', 'prayer'],
    travel_planning: ['plan', 'itinerary', 'trip', 'visit', 'tour', 'travel'],
    safety: ['safe', 'safety', 'emergency', 'danger', 'risk', 'first aid'],
    crowd_info: ['crowd', 'busy', 'wait time', 'queue', 'avoid crowds'],
    wellness: ['yoga', 'meditation', 'wellness', 'relax', 'stress', 'pranayama'],
    food: ['food', 'cuisine', 'eat', 'restaurant', 'dish', 'meal'],
    eco_tourism: ['eco', 'sustainable', 'green', 'environment', 'carbon'],
    accommodation: ['stay', 'hotel', 'homestay', 'accommodation', 'lodge'],
    festival: ['festival', 'celebration', 'event', 'mela'],
  };

  const detectedIntents = [];

  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      detectedIntents.push(intent);
    }
  }

  return detectedIntents.length > 0 ? detectedIntents : ['general'];
}

/**
 * Determine best persona based on query intent
 */
function selectPersona(query) {
  const intents = extractIntent(query);

  // Persona mapping
  const personaMap = {
    trek_info: 'pers003', // Trek Companion - Arjun
    spiritual_info: 'pers002', // Spiritual Teacher - Guru Ananda
    travel_planning: 'pers001', // Local Guide - Ravi
    safety: 'pers005', // Safety Guardian - Kavya
    crowd_info: 'pers001', // Local Guide - Ravi
    wellness: 'pers002', // Spiritual Teacher - Guru Ananda
    food: 'pers001', // Local Guide - Ravi
    eco_tourism: 'pers001', // Local Guide - Ravi
    accommodation: 'pers001', // Local Guide - Ravi
    festival: 'pers004', // Cultural Expert - Dr. Meera
    general: 'pers001', // Default to Local Guide
  };

  // Select persona based on first intent
  return personaMap[intents[0]] || 'pers001';
}

/**
 * Extract location from query
 */
function extractLocation(query) {
  const doc = nlp(query);
  const places = doc.places().out('array');
  
  if (places.length > 0) {
    return places[0];
  }

  // Fallback: check for common Indian states/cities
  const indianLocations = [
    'delhi', 'mumbai', 'bangalore', 'kolkata', 'chennai', 'hyderabad',
    'kerala', 'goa', 'rajasthan', 'uttarakhand', 'himachal', 'kashmir',
    'ladakh', 'sikkim', 'assam', 'meghalaya', 'tamil nadu', 'karnataka',
    'maharashtra', 'gujarat', 'punjab', 'haryana', 'uttar pradesh',
    'varanasi', 'rishikesh', 'manali', 'leh', 'amritsar', 'jaipur', 'udaipur'
  ];

  const lowerQuery = query.toLowerCase();
  for (const location of indianLocations) {
    if (lowerQuery.includes(location)) {
      return location;
    }
  }

  return null;
}

/**
 * Extract date/time from query
 */
function extractDate(query) {
  const doc = nlp(query);
  const dates = doc.dates().out('array');
  
  if (dates.length > 0) {
    return dates[0];
  }

  // Check for month names
  const months = ['january', 'february', 'march', 'april', 'may', 'june',
                  'july', 'august', 'september', 'october', 'november', 'december'];
  
  const lowerQuery = query.toLowerCase();
  for (const month of months) {
    if (lowerQuery.includes(month)) {
      return month;
    }
  }

  return null;
}

module.exports = {
  detectLanguage,
  extractIntent,
  selectPersona,
  extractLocation,
  extractDate,
};
