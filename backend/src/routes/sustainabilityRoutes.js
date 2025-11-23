const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const {
  calculateCarbon,
  compareTransport,
  getEcoTips,
  getEcoHomestays,
} = require('../controllers/sustainabilityController');

// All routes are public (optional auth for saving preferences)
router.use(optionalAuth);

// Carbon footprint
router.post('/carbon/calculate', calculateCarbon);
router.get('/carbon/compare', compareTransport);

// Eco resources
router.get('/tips', getEcoTips);
router.get('/homestays', getEcoHomestays);

module.exports = router;
