import { getAllUsersContoller } from "../controller/userController.js";
import express from "express";

const route = express();
route.use(express.json());

route.get('/ressadfasf',(req,res)=>getAllUsersContoller(req,res));

export {route}