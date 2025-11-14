import express from 'express';
import { submitCareerApplication } from '../controllers/careerController.js';

const router = express.Router();

router.post('/apply', submitCareerApplication);

export default router;
