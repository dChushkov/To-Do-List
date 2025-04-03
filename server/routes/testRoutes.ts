import express from 'express';
import { createTest, getAllTests } from '../controllers/testController';

const router = express.Router();

router.post('/', createTest);
router.get('/', getAllTests);

export default router; 