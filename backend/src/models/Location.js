const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  locationId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['spiritual_site', 'trek', 'homestay', 'city', 'region'],
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
  crowdData: {
    currentLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'extreme'],
      default: 'moderate',
    },
    peakMonths: [String],
    offSeasonMonths: [String],
    averageWaitTime: Number,
    lastUpdated: Date,
  },
  weatherData: {
    currentTemp: Number,
    condition: String,
    bestSeason: String,
    lastUpdated: Date,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

locationSchema.index({ locationId: 1 });
locationSchema.index({ type: 1, state: 1 });

module.exports = mongoose.model('Location', locationSchema);
