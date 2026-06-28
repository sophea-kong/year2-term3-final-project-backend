import express from "express";
import {
	getAllBooking,
	createNewBooking,
	getBookingsForUser,
	getBooking,
	putBooking,
	approveBooking,
	rejectBooking,
	cancelBooking,
	completeBooking,
	noShowBooking,
	rescheduleBookingHandler
} from "../controller/bookingController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const bookingroute = express.Router();
bookingroute.use(express.json());

bookingroute.post('/', authenticateToken, (req, res) => createNewBooking(req, res));
bookingroute.get('/', authenticateToken, (req, res) => getAllBooking(req, res));
bookingroute.get('/me', authenticateToken, (req, res) => getBookingsForUser(req, res));
bookingroute.get('/:booking_id', authenticateToken, (req, res) => getBooking(req, res));
bookingroute.put('/:booking_id', authenticateToken, (req, res) => putBooking(req, res));

bookingroute.patch('/:booking_id/approve', authenticateToken, (req, res) => approveBooking(req, res));
bookingroute.patch('/:booking_id/reject', authenticateToken, (req, res) => rejectBooking(req, res));
bookingroute.patch('/:booking_id/cancel', authenticateToken, (req, res) => cancelBooking(req, res));
bookingroute.patch('/:booking_id/complete', authenticateToken, (req, res) => completeBooking(req, res));
bookingroute.patch('/:booking_id/no-show', authenticateToken, (req, res) => noShowBooking(req, res));
bookingroute.patch('/:booking_id/reschedule', authenticateToken, (req, res) => rescheduleBookingHandler(req, res));

export { bookingroute }     