const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const {
  searchSites,
  searchTreksEndpoint,
  searchHomestaysEndpoint,
  searchFestivalsEndpoint,
  getCrowdPrediction,
  getBestTimes,
  getPersonalizedRecommendations,
} = require('../controllers/travelController');

// Public routes (optional auth for personalization)
router.use(optionalAuth);

// Search endpoints
router.get('/sites', searchSites);
router.get('/treks', searchTreksEndpoint);
router.get('/homestays', searchHomestaysEndpoint);
router.get('/festivals', searchFestivalsEndpoint);

// Crowd intelligence
router.get('/crowd/predict', getCrowdPrediction);
router.get('/crowd/best-times', getBestTimes);

// Recommendations
router.get('/recommendations', getPersonalizedRecommendations);

module.exports = router;
