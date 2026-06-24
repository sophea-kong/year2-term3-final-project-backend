import { banUser, editUser, getAllUsersContoller, getBookingbyUser, getNotificationByUser, getTicketsByuser, getUserByidController, unbanUser } from "../controller/userController.js";
import express from "express";
import { getUserByid } from "../repositiory/userrepository.js";

const route = express.Router();
route.use(express.json());

route.get('/',(req,res)=>getAllUsersContoller(req,res));
route.get('/:id',(req,res)=>getUserByidController(req,res));
route.put("/edit/:id",(req,res)=>editUser(req,res));
route.patch("/ban/:id",(req,res)=>banUser(req,res));
route.patch("/unban/:id",(req,res)=>unbanUser(req,res));
route.get('/:id/booking',(req,res)=>getBookingbyUser(req,res));
route.get('/:id/tickets',(req,res)=>getTicketsByuser(req,res));
route.get('/:id/notification',(req,res)=>getNotificationByUser(req,res));

export {route}