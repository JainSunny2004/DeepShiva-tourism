const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const {
  getWellnessRoutines,
  getWellnessRoutine,
  startWellnessSession,
  completeWellnessSession,
  getWellnessHistory,
  getShlokas,
} = require('../controllers/wellnessController');

// Public routes
router.get('/routines', optionalAuth, getWellnessRoutines);
router.get('/routines/:routineId', optionalAuth, getWellnessRoutine);
router.get('/shlokas', optionalAuth, getShlokas);

// Authenticated routes
router.post('/sessions', authenticate, startWellnessSession);
router.put('/sessions/:sessionId/complete', authenticate, completeWellnessSession);
router.get('/sessions/history', authenticate, getWellnessHistory);

module.exports = router;
