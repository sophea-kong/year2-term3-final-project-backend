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
	rescheduleBookingHandler,
	pendingBooking,
	getAllApproved
} from "../controller/bookingController.js";
import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleware.js";

const bookingroute = express.Router();
bookingroute.use(express.json());

bookingroute.post('/', authenticateToken, (req, res) => createNewBooking(req, res));
bookingroute.get('/', authenticateToken, (req, res) => getAllBooking(req, res));
bookingroute.get('/me', authenticateToken, (req, res) => getBookingsForUser(req, res));
bookingroute.get('/pendings',authenticateToken,authorizeAdmin,(req,res) => pendingBooking(req,res))
bookingroute.get('/approved',authenticateToken,authorizeAdmin,(req,res) => getAllApproved(req,res));
bookingroute.get('/:booking_id', authenticateToken, (req, res) => getBooking(req, res));
bookingroute.put('/:booking_id', authenticateToken, (req, res) => putBooking(req, res));

bookingroute.patch('/:booking_id/approve', authenticateToken,authorizeAdmin, (req, res) => approveBooking(req, res));
bookingroute.patch('/:booking_id/reject', authenticateToken,authorizeAdmin, (req, res) => rejectBooking(req, res));
bookingroute.patch('/:booking_id/cancel', authenticateToken, (req, res) => cancelBooking(req, res));
bookingroute.patch('/:booking_id/complete', authenticateToken,authorizeAdmin, (req, res) => completeBooking(req, res));
bookingroute.patch('/:booking_id/no-show', authenticateToken,authorizeAdmin, (req, res) => noShowBooking(req, res));
bookingroute.patch('/:booking_id/reschedule', authenticateToken,authorizeAdmin, (req, res) => rescheduleBookingHandler(req, res));

export { bookingroute }     