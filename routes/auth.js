import express from "express";
import { register, login, logout, getMe, updateMe, forgotPassword, resetPassword } from "../controller/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getGoogleAuthUrl, googleCallback } from "../controller/googleAuthController.js";

const route = express.Router();
route.use(express.json());

route.post('/register', register);
route.post('/login', login);
route.post('/logout', logout);
route.get('/me', authenticateToken, getMe);
route.put('/me', authenticateToken, updateMe);
route.post('/forgot-password', forgotPassword);
route.post('/reset-password', resetPassword);
route.get('/google',authenticateToken,getGoogleAuthUrl);
route.get('/google/callback',googleCallback);

export { route as authRoute };
