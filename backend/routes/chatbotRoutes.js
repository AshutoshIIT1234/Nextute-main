import express from 'express';
import { handleChatQuery, refreshKnowledgeBase } from '../controllers/chatbotController.js';

const router = express.Router();

// Chat query endpoint
router.post('/query', handleChatQuery);

// Refresh knowledge base (admin only in production)
router.post('/refresh', refreshKnowledgeBase);

export default router;
