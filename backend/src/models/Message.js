const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  notebookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notebook',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  personaUsed: {
    type: String,
    default: 'pers001',
  },
  sources: [{
    type: String,
  }],
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0,
  },
  language: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for fast queries
messageSchema.index({ notebookId: 1, timestamp: -1 });
messageSchema.index({ userId: 1 });

module.exports = mongoose.model('Message', messageSchema);
