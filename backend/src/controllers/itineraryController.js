const TripPlan = require('../models/TripPlan');
const { searchSpiritualSites, searchTreks, searchHomestays } = require('../utils/placesSearch');
const { calculateCarbonFootprint } = require('../utils/carbonCalculator');
const { generateStructuredResponse } = require('../utils/callLLM');

/**
 * Create new trip plan
 */
async function createTripPlan(req, res) {
  try {
    const userId = req.user.id;
    const { title, destinations, startDate, endDate, preferences } = req.body;

    const tripPlan = await TripPlan.create({
      userId,
      title: title || 'My India Trip',
      destinations: destinations || [],
      startDate,
      endDate,
      totalDays: calculateDays(startDate, endDate),
      preferences: preferences || {},
      status: 'draft',
    });

    res.json({
      success: true,
      tripPlan,
    });

  } catch (error) {
    console.error('❌ Create Trip Plan Error:', error);
    res.status(500).json({ error: 'Failed to create trip plan' });
  }
}

/**
 * Generate AI itinerary
 */
async function generateItinerary(req, res) {
  try {
    const { tripPlanId } = req.params;
    const userId = req.user.id;

    const tripPlan = await TripPlan.findOne({ _id: tripPlanId, userId });
    if (!tripPlan) {
      return res.status(404).json({ error: 'Trip plan not found' });
    }

    // Build itinerary based on destinations and preferences
    const itinerary = [];
    let currentDay = 1;

    for (const destination of tripPlan.destinations) {
      const dailyPlan = {
        day: currentDay,
        date: addDays(new Date(tripPlan.startDate), currentDay - 1),
        activities: [],
      };

      // Morning activity
      dailyPlan.activities.push({
        time: '06:00 AM',
        activity: `Sunrise visit to ${destination.name}`,
        location: destination.name,
        notes: 'Early morning visits avoid crowds',
      });

      // Mid-day activity
      dailyPlan.activities.push({
        time: '12:00 PM',
        activity: 'Local cuisine lunch',
        location: 'Nearby restaurant',
        notes: 'Try regional specialties',
      });

      // Afternoon activity
      dailyPlan.activities.push({
        time: '03:00 PM',
        activity: 'Explore nearby attractions',
        location: destination.name,
        notes: 'Check crowd patterns',
      });

      // Evening activity
      dailyPlan.activities.push({
        time: '06:00 PM',
        activity: 'Evening aarti or cultural program',
        location: destination.name,
        notes: 'Spiritual experience',
      });

      itinerary.push(dailyPlan);
      currentDay++;

      if (destination.durationDays > 1) {
        for (let i = 1; i < destination.durationDays; i++) {
          currentDay++;
        }
      }
    }

    tripPlan.itinerary = itinerary;
    tripPlan.updatedAt = new Date();
    await tripPlan.save();

    res.json({
      success: true,
      itinerary: tripPlan.itinerary,
    });

  } catch (error) {
    console.error('❌ Generate Itinerary Error:', error);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
}

/**
 * Get all trip plans for user
 */
async function getTripPlans(req, res) {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const query = { userId };
    if (status) {
      query.status = status;
    }

    const tripPlans = await TripPlan.find(query)
      .sort({ updatedAt: -1 })
      .lean();

    res.json({
      success: true,
      tripPlans,
    });

  } catch (error) {
    console.error('❌ Get Trip Plans Error:', error);
    res.status(500).json({ error: 'Failed to fetch trip plans' });
  }
}

/**
 * Get single trip plan
 */
async function getTripPlan(req, res) {
  try {
    const { tripPlanId } = req.params;
    const userId = req.user.id;

    const tripPlan = await TripPlan.findOne({ _id: tripPlanId, userId }).lean();
    
    if (!tripPlan) {
      return res.status(404).json({ error: 'Trip plan not found' });
    }

    res.json({
      success: true,
      tripPlan,
    });

  } catch (error) {
    console.error('❌ Get Trip Plan Error:', error);
    res.status(500).json({ error: 'Failed to fetch trip plan' });
  }
}

/**
 * Update trip plan
 */
async function updateTripPlan(req, res) {
  try {
    const { tripPlanId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const tripPlan = await TripPlan.findOneAndUpdate(
      { _id: tripPlanId, userId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );

    if (!tripPlan) {
      return res.status(404).json({ error: 'Trip plan not found' });
    }

    res.json({
      success: true,
      tripPlan,
    });

  } catch (error) {
    console.error('❌ Update Trip Plan Error:', error);
    res.status(500).json({ error: 'Failed to update trip plan' });
  }
}

/**
 * Delete trip plan
 */
async function deleteTripPlan(req, res) {
  try {
    const { tripPlanId } = req.params;
    const userId = req.user.id;

    const result = await TripPlan.findOneAndDelete({ _id: tripPlanId, userId });

    if (!result) {
      return res.status(404).json({ error: 'Trip plan not found' });
    }

    res.json({
      success: true,
      message: 'Trip plan deleted',
    });

  } catch (error) {
    console.error('❌ Delete Trip Plan Error:', error);
    res.status(500).json({ error: 'Failed to delete trip plan' });
  }
}

/**
 * Calculate carbon footprint for trip
 */
async function calculateTripCarbon(req, res) {
  try {
    const { tripPlanId } = req.params;
    const userId = req.user.id;

    const tripPlan = await TripPlan.findOne({ _id: tripPlanId, userId });
    
    if (!tripPlan) {
      return res.status(404).json({ error: 'Trip plan not found' });
    }

    // Estimate distance (simplified)
    const estimatedDistance = tripPlan.destinations.length * 300; // km per destination

    const carbonData = calculateCarbonFootprint({
      travelMode: tripPlan.travelMode || 'mixed',
      distanceKm: estimatedDistance,
      accommodationType: tripPlan.accommodationType || 'hotel',
      durationDays: tripPlan.totalDays || 7,
    });

    tripPlan.carbonFootprint = {
      kg: carbonData.totalKg,
      offset: carbonData.offsetSuggestions[0],
    };
    await tripPlan.save();

    res.json({
      success: true,
      carbonFootprint: carbonData,
    });

  } catch (error) {
    console.error('❌ Calculate Carbon Error:', error);
    res.status(500).json({ error: 'Failed to calculate carbon footprint' });
  }
}

// Helper functions
function calculateDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports = {
  createTripPlan,
  generateItinerary,
  getTripPlans,
  getTripPlan,
  updateTripPlan,
  deleteTripPlan,
  calculateTripCarbon,
};
