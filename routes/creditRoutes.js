import express from 'express';
import { getUserBalance, manageUserCredits } from '../controller/creditController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

export const creditRoute = express.Router();

creditRoute.use(express.json());

// Users view their balance and transactions
creditRoute.get('/me', authenticateToken, getUserBalance);

// Admin manages credits
creditRoute.post('/manage', authenticateToken, authorizeAdmin, manageUserCredits);
