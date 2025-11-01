import express from 'express';
const router = express.Router();
import { sendInvoiceEmail, updateUserSubscription } from '../controllers/paymentController.js';

// Send invoice email
router.post('/send-invoice', sendInvoiceEmail);

// Update user subscription
router.post('/subscription', updateUserSubscription);

export default router;