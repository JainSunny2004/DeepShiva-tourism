const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/auth');
const {
  getAllPersonas,
  getPersona,
  setPreferredPersona,
} = require('../controllers/personaController');

// Public routes
router.get('/', optionalAuth, getAllPersonas);
router.get('/:personaId', optionalAuth, getPersona);

// Authenticated routes
router.post('/preferred', authenticate, setPreferredPersona);

module.exports = router;
