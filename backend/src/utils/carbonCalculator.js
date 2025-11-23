/**
 * Calculate carbon footprint for travel
 */
function calculateCarbonFootprint({ 
  travelMode, 
  distanceKm, 
  accommodationType, 
  durationDays 
}) {
  try {
    let totalKg = 0;

    // Travel emissions (per km)
    const emissionFactors = {
      flight: 0.255, // kg CO2 per km
      train: 0.041,
      bus: 0.089,
      car: 0.171,
      bike: 0.0,
      walk: 0.0,
    };

    const travelEmission = (emissionFactors[travelMode] || 0.1) * distanceKm;
    totalKg += travelEmission;

    // Accommodation emissions (per night)
    const accommodationFactors = {
      hotel: 20, // kg CO2 per night
      homestay: 8,
      hostel: 10,
      camping: 2,
      eco_lodge: 5,
    };

    const accommodationEmission = (accommodationFactors[accommodationType] || 15) * durationDays;
    totalKg += accommodationEmission;

    // Food emissions (average per day)
    const foodEmissionPerDay = 5.5; // kg CO2
    totalKg += foodEmissionPerDay * durationDays;

    return {
      totalKg: Math.round(totalKg * 10) / 10,
      breakdown: {
        travel: Math.round(travelEmission * 10) / 10,
        accommodation: Math.round(accommodationEmission * 10) / 10,
        food: Math.round(foodEmissionPerDay * durationDays * 10) / 10,
      },
      comparison: generateComparison(totalKg),
      offsetSuggestions: generateOffsetSuggestions(totalKg),
    };

  } catch (error) {
    console.error('❌ Carbon Calculation Error:', error.message);
    return {
      totalKg: 0,
      error: 'Could not calculate carbon footprint',
    };
  }
}

/**
 * Generate comparison context
 */
function generateComparison(totalKg) {
  const comparisons = [];

  if (totalKg < 50) {
    comparisons.push('🌱 Low carbon footprint - eco-friendly trip!');
  } else if (totalKg < 150) {
    comparisons.push('🌿 Moderate carbon footprint');
  } else {
    comparisons.push('⚠️ High carbon footprint - consider offsets');
  }

  comparisons.push(`Equivalent to ${Math.round(totalKg / 8)} trees needed to offset`);
  comparisons.push(`Comparable to driving ${Math.round(totalKg / 0.171)} km by car`);

  return comparisons;
}

/**
 * Generate offset suggestions
 */
function generateOffsetSuggestions(totalKg) {
  const suggestions = [];

  suggestions.push(`Plant ${Math.ceil(totalKg / 8)} trees to offset this trip`);
  
  if (totalKg > 50) {
    suggestions.push('Choose homestays over hotels to reduce accommodation emissions');
    suggestions.push('Use trains instead of flights when possible');
  }

  suggestions.push('Support local eco-tourism initiatives');
  suggestions.push('Participate in clean-up drives at destinations');
  suggestions.push('Carbon offset programs: Consider platforms like Gold Standard or Verified Carbon Standard');

  return suggestions;
}

/**
 * Compare different travel options
 */
function compareTransportOptions(distanceKm) {
  const modes = ['flight', 'train', 'bus', 'car'];
  const results = [];

  modes.forEach(mode => {
    const emission = calculateCarbonFootprint({
      travelMode: mode,
      distanceKm,
      accommodationType: 'homestay',
      durationDays: 1,
    });

    results.push({
      mode,
      emissions: emission.breakdown.travel,
      recommended: mode === 'train' || mode === 'bus',
    });
  });

  results.sort((a, b) => a.emissions - b.emissions);

  return results;
}

module.exports = {
  calculateCarbonFootprint,
  compareTransportOptions,
};
