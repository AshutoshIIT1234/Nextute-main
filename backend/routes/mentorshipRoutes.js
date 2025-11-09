import express from 'express';
import {
  createMentorshipOrder,
  verifyMentorshipPayment,
  getAllMentors,
  getMentorById,
} from '../controllers/mentorshipController.js';

const router = express.Router();

router.get('/mentors', getAllMentors);
router.get('/mentors/:id', getMentorById);
router.post('/create-order', createMentorshipOrder);
router.post('/verify-payment', verifyMentorshipPayment);

export default router;
