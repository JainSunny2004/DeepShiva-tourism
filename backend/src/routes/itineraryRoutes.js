const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createTripPlan,
  generateItinerary,
  getTripPlans,
  getTripPlan,
  updateTripPlan,
  deleteTripPlan,
  calculateTripCarbon,
} = require('../controllers/itineraryController');

// All routes require authentication
router.use(authenticate);

// Trip plan CRUD
router.post('/', createTripPlan);
router.get('/', getTripPlans);
router.get('/:tripPlanId', getTripPlan);
router.put('/:tripPlanId', updateTripPlan);
router.delete('/:tripPlanId', deleteTripPlan);

// AI features
router.post('/:tripPlanId/generate', generateItinerary);
router.get('/:tripPlanId/carbon', calculateTripCarbon);

module.exports = router;
