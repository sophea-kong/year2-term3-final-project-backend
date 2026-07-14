import express from "express";
import getChatAssistance from "../controller/chatController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const chatRouter = express.Router();
chatRouter.post('/assist', authenticateToken, (req,res)=>getChatAssistance(req,res));

export default chatRouter;