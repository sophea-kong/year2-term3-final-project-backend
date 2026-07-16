import express from 'express';
import { getAllBanRecords, getBanRecordsByUserId } from '../controller/banController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all ban records (Admin only ideally)
router.get('/', authenticateToken,authorizeAdmin, getAllBanRecords);

// Get ban records for a specific user
router.get('/user/:userId', authenticateToken ,authorizeAdmin, getBanRecordsByUserId);

export default router;
