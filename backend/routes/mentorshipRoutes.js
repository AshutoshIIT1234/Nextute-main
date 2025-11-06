import express from 'express';
import {
  createMentorshipOrder,
  verifyMentorshipPayment,
} from '../controllers/mentorshipController.js';

const router = express.Router();

router.post('/create-order', createMentorshipOrder);
router.post('/verify-payment', verifyMentorshipPayment);

export default router;
