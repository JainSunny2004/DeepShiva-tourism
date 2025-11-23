const Message = require('../models/Message');
const { User, Notebook } = require('../models/User');
const { retrieveContext, calculateConfidence } = require('../utils/ragRetriever');
const { callLLM } = require('../utils/callLLM');
const { detectLanguage, selectPersona } = require('../utils/languageDetection');
const fs = require('fs');
const path = require('path');
const { DATA_DIR } = require('../config/env');

/**
 * Send message and get AI response
 */
async function sendMessage(req, res) {
  try {
    const { notebookId, message, personaId, language } = req.body;
    const userId = req.user.id;

    if (!message || !notebookId) {
      return res.status(400).json({ error: 'Message and notebookId required' });
    }

    // Verify notebook belongs to user
    const notebook = await Notebook.findOne({ _id: notebookId, userId });
    if (!notebook) {
      return res.status(404).json({ error: 'Notebook not found' });
    }

    // Detect language if not provided
    const detectedLanguage = language || detectLanguage(message);

    // Select persona (auto or manual)
    const selectedPersonaId = personaId || selectPersona(message);

    // Get persona data
    const personaData = getPersonaData(selectedPersonaId);

    // Save user message
    const userMessage = await Message.create({
      notebookId,
      userId,
      role: 'user',
      content: message,
      language: detectedLanguage,
      timestamp: new Date(),
    });

    // Add to notebook
    notebook.messages.push(userMessage._id);
    notebook.updatedAt = new Date();
    await notebook.save();

    // Retrieve context from RAG
    const retrievedContext = await retrieveContext({
      query: message,
      topK: 5,
    });

    // Calculate confidence
    const confidence = calculateConfidence(retrievedContext);

    // Get conversation history
    const conversationHistory = await Message.find({ notebookId })
      .sort({ timestamp: -1 })
      .limit(6)
      .lean();

    const formattedHistory = conversationHistory
      .reverse()
      .slice(0, -1) // Exclude current message
      .map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

    // Call LLM
    const llmResponse = await callLLM({
      userQuery: message,
      personaContext: personaData,
      retrievedContext,
      language: detectedLanguage,
      conversationHistory: formattedHistory,
    });

    // Extract sources
    const sources = retrievedContext.map(doc => doc.id);

    // Save assistant message
    const assistantMessage = await Message.create({
      notebookId,
      userId,
      role: 'assistant',
      content: llmResponse.answer,
      personaUsed: selectedPersonaId,
      sources,
      confidence,
      language: detectedLanguage,
      metadata: {
        model: llmResponse.model,
        usage: llmResponse.usage,
      },
      timestamp: new Date(),
    });

    // Add to notebook
    notebook.messages.push(assistantMessage._id);
    await notebook.save();

    // Update user last active
    await User.findByIdAndUpdate(userId, { lastActive: new Date() });

    res.json({
      success: true,
      message: assistantMessage,
      persona: personaData.name,
      confidence,
      sources,
    });

  } catch (error) {
    console.error('❌ Send Message Error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
}

/**
 * Get chat history for notebook
 */
async function getChatHistory(req, res) {
  try {
    const { notebookId } = req.params;
    const userId = req.user.id;
    const { limit = 50, skip = 0 } = req.query;

    // Verify notebook belongs to user
    const notebook = await Notebook.findOne({ _id: notebookId, userId });
    if (!notebook) {
      return res.status(404).json({ error: 'Notebook not found' });
    }

    const messages = await Message.find({ notebookId })
      .sort({ timestamp: 1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      messages,
      total: notebook.messages.length,
    });

  } catch (error) {
    console.error('❌ Get Chat History Error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
}

/**
 * Create new notebook
 */
async function createNotebook(req, res) {
  try {
    const { title } = req.body;
    const userId = req.user.id;

    const notebook = await Notebook.create({
      userId,
      title: title || 'New Travel Chat',
      messages: [],
    });

    // Add to user's notebooks
    await User.findByIdAndUpdate(userId, {
      $push: { notebooks: notebook._id },
    });

    res.json({
      success: true,
      notebook,
    });

  } catch (error) {
    console.error('❌ Create Notebook Error:', error);
    res.status(500).json({ error: 'Failed to create notebook' });
  }
}

/**
 * Get all notebooks for user
 */
async function getNotebooks(req, res) {
  try {
    const userId = req.user.id;

    const notebooks = await Notebook.find({ userId })
      .sort({ updatedAt: -1 })
      .select('title createdAt updatedAt')
      .lean();

    res.json({
      success: true,
      notebooks,
    });

  } catch (error) {
    console.error('❌ Get Notebooks Error:', error);
    res.status(500).json({ error: 'Failed to fetch notebooks' });
  }
}

/**
 * Delete notebook
 */
async function deleteNotebook(req, res) {
  try {
    const { notebookId } = req.params;
    const userId = req.user.id;

    const notebook = await Notebook.findOne({ _id: notebookId, userId });
    if (!notebook) {
      return res.status(404).json({ error: 'Notebook not found' });
    }

    // Delete all messages
    await Message.deleteMany({ notebookId });

    // Delete notebook
    await Notebook.findByIdAndDelete(notebookId);

    // Remove from user
    await User.findByIdAndUpdate(userId, {
      $pull: { notebooks: notebookId },
    });

    res.json({
      success: true,
      message: 'Notebook deleted',
    });

  } catch (error) {
    console.error('❌ Delete Notebook Error:', error);
    res.status(500).json({ error: 'Failed to delete notebook' });
  }
}

/**
 * Helper: Get persona data from JSON
 */
function getPersonaData(personaId) {
  try {
    const filePath = path.join(DATA_DIR, 'personas.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const persona = data.personas.find(p => p.id === personaId);
    
    return persona || data.personas[0]; // Default to first persona
  } catch (error) {
    console.error('❌ Get Persona Error:', error);
    // Return default persona
    return {
      id: 'pers001',
      name: 'Ravi',
      system_prompt: 'You are a helpful travel guide for India.',
    };
  }
}

module.exports = {
  sendMessage,
  getChatHistory,
  createNotebook,
  getNotebooks,
  deleteNotebook,
};
