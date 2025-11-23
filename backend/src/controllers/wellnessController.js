const WellnessSession = require('../models/WellnessSession');
const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../config/env');

/**
 * Get all wellness routines
 */
async function getWellnessRoutines(req, res) {
  try {
    const filePath = path.join(DATA_DIR, 'wellness.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    res.json({
      success: true,
      routines: data.routines || [],
    });

  } catch (error) {
    console.error('❌ Get Wellness Routines Error:', error);
    res.status(500).json({ error: 'Failed to fetch wellness routines' });
  }
}

/**
 * Get single wellness routine
 */
async function getWellnessRoutine(req, res) {
  try {
    const { routineId } = req.params;

    const filePath = path.join(DATA_DIR, 'wellness.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const routine = data.routines?.find(r => r.id === routineId);

    if (!routine) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    res.json({
      success: true,
      routine,
    });

  } catch (error) {
    console.error('❌ Get Wellness Routine Error:', error);
    res.status(500).json({ error: 'Failed to fetch routine' });
  }
}

/**
 * Start wellness session
 */
async function startWellnessSession(req, res) {
  try {
    const userId = req.user.id;
    const { routineId, routineName, sessionType, duration, moodBefore } = req.body;

    if (!routineId || !routineName || !sessionType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const session = await WellnessSession.create({
      userId,
      routineId,
      routineName,
      sessionType,
      duration: duration || 0,
      mood: {
        before: moodBefore,
      },
      sessionDate: new Date(),
    });

    res.json({
      success: true,
      session,
    });

  } catch (error) {
    console.error('❌ Start Session Error:', error);
    res.status(500).json({ error: 'Failed to start wellness session' });
  }
}

/**
 * Complete wellness session
 */
async function completeWellnessSession(req, res) {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    const { moodAfter, notes, postureDetection } = req.body;

    const session = await WellnessSession.findOne({ _id: sessionId, userId });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    session.completed = true;
    session.mood.after = moodAfter;
    session.notes = notes || '';
    
    if (postureDetection) {
      session.postureDetection = postureDetection;
    }

    await session.save();

    res.json({
      success: true,
      session,
    });

  } catch (error) {
    console.error('❌ Complete Session Error:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
}

/**
 * Get user's wellness history
 */
async function getWellnessHistory(req, res) {
  try {
    const userId = req.user.id;
    const { limit = 20 } = req.query;

    const sessions = await WellnessSession.find({ userId })
      .sort({ sessionDate: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      sessions,
      total: sessions.length,
    });

  } catch (error) {
    console.error('❌ Get History Error:', error);
    res.status(500).json({ error: 'Failed to fetch wellness history' });
  }
}

/**
 * Get shlokas
 */
async function getShlokas(req, res) {
  try {
    const { category } = req.query;

    const filePath = path.join(DATA_DIR, 'shlokas.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    let shlokas = data.shlokas || [];

    if (category) {
      shlokas = shlokas.filter(s => s.category === category);
    }

    res.json({
      success: true,
      shlokas,
    });

  } catch (error) {
    console.error('❌ Get Shlokas Error:', error);
    res.status(500).json({ error: 'Failed to fetch shlokas' });
  }
}

module.exports = {
  getWellnessRoutines,
  getWellnessRoutine,
  startWellnessSession,
  completeWellnessSession,
  getWellnessHistory,
  getShlokas,
};
