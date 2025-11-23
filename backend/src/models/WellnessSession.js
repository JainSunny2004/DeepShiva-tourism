const mongoose = require('mongoose');

const wellnessSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  routineId: {
    type: String,
    required: true,
  },
  routineName: {
    type: String,
    required: true,
  },
  sessionType: {
    type: String,
    enum: ['yoga', 'meditation', 'breathing', 'wellness'],
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  mood: {
    before: {
      type: String,
      enum: ['stressed', 'anxious', 'tired', 'neutral', 'calm', 'energized'],
    },
    after: {
      type: String,
      enum: ['stressed', 'anxious', 'tired', 'neutral', 'calm', 'energized'],
    },
  },
  notes: {
    type: String,
    default: '',
  },
  postureDetection: {
    enabled: Boolean,
    accuracy: Number,
    postures: [String],
  },
  sessionDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

wellnessSessionSchema.index({ userId: 1, sessionDate: -1 });

module.exports = mongoose.model('WellnessSession', wellnessSessionSchema);
