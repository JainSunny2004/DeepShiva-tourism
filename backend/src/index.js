const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { PORT, CORS_ORIGIN, NODE_ENV, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } = require('./config/env');

// Import routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const travelRoutes = require('./routes/travelRoutes');
const wellnessRoutes = require('./routes/wellnessRoutes');
const sustainabilityRoutes = require('./routes/sustainabilityRoutes');
const personaRoutes = require('./routes/personaRoutes');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests, please try again later.',
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/travel', travelRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/sustainability', sustainabilityRoutes);
app.use('/api/personas', personaRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'India Travel RAG API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      chat: '/api/chat',
      itinerary: '/api/itinerary',
      travel: '/api/travel',
      wellness: '/api/wellness',
      sustainability: '/api/sustainability',
      personas: '/api/personas',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║     🇮🇳  INDIA TRAVEL RAG API - RUNNING                  ║
║                                                          ║
║     Port: ${PORT}                                       ║
║     Environment: ${NODE_ENV}                            ║
║     Time: ${new Date().toLocaleString('en-IN')}         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('⚠️  SIGINT received, shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
