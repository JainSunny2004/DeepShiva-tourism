const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  sendMessage,
  getChatHistory,
  createNotebook,
  getNotebooks,
  deleteNotebook,
} = require('../controllers/chatController');

// All routes require authentication
router.use(authenticate);

// Chat operations
router.post('/message', sendMessage);
router.get('/history/:notebookId', getChatHistory);

// Notebook operations
router.post('/notebooks', createNotebook);
router.get('/notebooks', getNotebooks);
router.delete('/notebooks/:notebookId', deleteNotebook);

module.exports = router;
