import express from "express";
import { getAllBooking } from "../controller/bookingController.js";

const bookingroute = express.Router();
bookingroute.use(express.json());

bookingroute.get('/',(req,res)=>getAllBooking(req,res));


export {bookingroute}