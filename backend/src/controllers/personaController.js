const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../config/env');
const { User } = require('../models/User');

/**
 * Get all personas
 */
async function getAllPersonas(req, res) {
  try {
    const filePath = path.join(DATA_DIR, 'personas.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    res.json({
      success: true,
      personas: data.personas || [],
    });

  } catch (error) {
    console.error('❌ Get Personas Error:', error);
    res.status(500).json({ error: 'Failed to fetch personas' });
  }
}

/**
 * Get single persona
 */
async function getPersona(req, res) {
  try {
    const { personaId } = req.params;

    const filePath = path.join(DATA_DIR, 'personas.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const persona = data.personas.find(p => p.id === personaId);

    if (!persona) {
      return res.status(404).json({ error: 'Persona not found' });
    }

    res.json({
      success: true,
      persona,
    });

  } catch (error) {
    console.error('❌ Get Persona Error:', error);
    res.status(500).json({ error: 'Failed to fetch persona' });
  }
}

/**
 * Set user's preferred persona
 */
async function setPreferredPersona(req, res) {
  try {
    const { personaId } = req.body;
    const userId = req.user.id;

    if (!personaId) {
      return res.status(400).json({ error: 'Persona ID required' });
    }

    await User.findByIdAndUpdate(userId, {
      preferredPersona: personaId,
    });

    res.json({
      success: true,
      message: 'Preferred persona updated',
    });

  } catch (error) {
    console.error('❌ Set Persona Error:', error);
    res.status(500).json({ error: 'Failed to set preferred persona' });
  }
}

module.exports = {
  getAllPersonas,
  getPersona,
  setPreferredPersona,
};
