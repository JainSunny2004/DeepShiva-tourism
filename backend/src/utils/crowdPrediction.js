/**
 * Predict crowd levels based on date, location, and patterns
 */
function predictCrowdLevel({ locationId, date, crowdPatternData }) {
  try {
    const targetDate = new Date(date);
    const month = targetDate.toLocaleString('en-US', { month: 'long' });
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (!crowdPatternData) {
      return {
        level: 'moderate',
        confidence: 0.4,
        message: 'Limited crowd data available',
      };
    }

    let crowdLevel = 'moderate';
    let confidence = 0.7;
    let factors = [];

    // Check peak months
    if (crowdPatternData.peak_months && crowdPatternData.peak_months.includes(month)) {
      crowdLevel = 'high';
      factors.push(`Peak month: ${month}`);
    }

    // Check off-season
    if (crowdPatternData.off_season_months && crowdPatternData.off_season_months.some(m => m.includes(month))) {
      crowdLevel = 'low';
      factors.push(`Off-season month: ${month}`);
    }

    // Weekend spike
    if (isWeekend && crowdPatternData.weekend_spike) {
      const spike = crowdPatternData.weekend_spike.toLowerCase();
      if (spike === 'high' || spike === 'very high' || spike === 'extreme') {
        crowdLevel = crowdLevel === 'high' ? 'extreme' : 'high';
        factors.push('Weekend spike expected');
      }
    }

    // Festival check (simplified - would need festival calendar)
    if (crowdPatternData.festival_spikes && crowdPatternData.festival_spikes.length > 0) {
      factors.push('Check festival calendar for spikes');
      confidence = 0.6; // Lower confidence without precise festival dates
    }

    // Estimate wait time
    let estimatedWaitTime = 'Unknown';
    if (crowdLevel === 'low' && crowdPatternData.typical_wait_time_low) {
      estimatedWaitTime = crowdPatternData.typical_wait_time_low;
    } else if ((crowdLevel === 'high' || crowdLevel === 'extreme') && crowdPatternData.typical_wait_time_high) {
      estimatedWaitTime = crowdPatternData.typical_wait_time_high;
    }

    return {
      level: crowdLevel,
      confidence,
      estimatedWaitTime,
      factors,
      recommendation: generateCrowdRecommendation(crowdLevel, crowdPatternData),
    };

  } catch (error) {
    console.error('❌ Crowd Prediction Error:', error.message);
    return {
      level: 'unknown',
      confidence: 0,
      message: 'Error predicting crowd levels',
    };
  }
}

/**
 * Generate recommendation based on crowd level
 */
function generateCrowdRecommendation(crowdLevel, crowdPatternData) {
  const recommendations = [];

  switch (crowdLevel) {
    case 'extreme':
    case 'high':
      recommendations.push('Arrive very early (before dawn if possible)');
      recommendations.push('Consider visiting on weekday instead');
      if (crowdPatternData.avoid_common_mistake) {
        recommendations.push(crowdPatternData.avoid_common_mistake);
      }
      if (crowdPatternData.estimated_money_saved) {
        recommendations.push(crowdPatternData.estimated_money_saved);
      }
      break;

    case 'moderate':
      recommendations.push('Moderate crowds expected - plan for some wait time');
      recommendations.push('Early morning or late evening visits recommended');
      break;

    case 'low':
      recommendations.push('Good time to visit - minimal crowds expected');
      recommendations.push('Enjoy leisurely exploration');
      break;

    default:
      recommendations.push('Check latest conditions before visit');
  }

  return recommendations.join('. ');
}

/**
 * Get best times to visit based on crowd patterns
 */
function getBestVisitTimes(crowdPatternData) {
  if (!crowdPatternData) {
    return {
      bestMonths: ['October', 'November', 'February', 'March'],
      bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
      bestTimeOfDay: 'Early morning (6-8 AM) or late evening',
    };
  }

  return {
    bestMonths: crowdPatternData.off_season_months || ['Check specific location'],
    avoidMonths: crowdPatternData.peak_months || [],
    bestDays: crowdPatternData.weekend_spike === 'High' ? ['Monday-Thursday'] : ['Any day'],
    bestTimeOfDay: 'Early morning (before 8 AM)',
    avoidCommonMistake: crowdPatternData.avoid_common_mistake || '',
  };
}

module.exports = {
  predictCrowdLevel,
  getBestVisitTimes,
};
