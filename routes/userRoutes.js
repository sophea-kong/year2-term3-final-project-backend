import { banUser, editUser, getAllUsersContoller, getBookingbyUser, getTicketsByuser, getUserByidController, unbanUser } from "../controller/userController.js";
import express from "express";
import { getUserByid } from "../repositiory/userrepository.js";
import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleware.js";

const route = express.Router();
route.use(express.json());

route.get('/', authenticateToken, authorizeAdmin, (req,res)=>getAllUsersContoller(req,res));
route.get('/:id', authenticateToken, (req,res)=>getUserByidController(req,res));
route.put("/edit/:id", authenticateToken, (req,res)=>editUser(req,res));
route.patch("/ban/:id", authenticateToken, authorizeAdmin, (req,res)=>banUser(req,res));
route.patch("/unban/:id", authenticateToken, authorizeAdmin, (req,res)=>unbanUser(req,res));
route.get('/:id/booking', authenticateToken, (req,res)=>getBookingbyUser(req,res));
route.get('/:id/tickets', authenticateToken, (req,res)=>getTicketsByuser(req,res));


export {route}