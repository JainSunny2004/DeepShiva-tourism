const mongoose = require('mongoose');

const tripPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  destinations: [{
    siteId: String,
    name: String,
    type: String,
    durationDays: Number,
    order: Number,
  }],
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  totalDays: {
    type: Number,
  },
  budget: {
    estimated: Number,
    currency: {
      type: String,
      default: 'INR',
    },
  },
  travelMode: {
    type: String,
    enum: ['train', 'flight', 'bus', 'car', 'mixed'],
    default: 'mixed',
  },
  accommodationType: {
    type: String,
    enum: ['hotel', 'homestay', 'hostel', 'camping', 'mixed'],
    default: 'mixed',
  },
  preferences: {
    spiritual: { type: Boolean, default: false },
    adventure: { type: Boolean, default: false },
    cultural: { type: Boolean, default: false },
    wellness: { type: Boolean, default: false },
    eco: { type: Boolean, default: false },
  },
  itinerary: [{
    day: Number,
    date: Date,
    activities: [{
      time: String,
      activity: String,
      location: String,
      notes: String,
    }],
  }],
  notes: {
    type: String,
    default: '',
  },
  carbonFootprint: {
    kg: Number,
    offset: String,
  },
  status: {
    type: String,
    enum: ['draft', 'planned', 'ongoing', 'completed'],
    default: 'draft',
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

tripPlanSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('TripPlan', tripPlanSchema);
