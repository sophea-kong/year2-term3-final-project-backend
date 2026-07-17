import express from "express";
import {
    getAllTickets,
    getTicketById,
    getTicketByBookingId,
    verifyTicketCode,
    cancelTicket,
    expireTicket
} from "../controller/ticketController.js";
import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleware.js";

const ticketRoute = express.Router();
ticketRoute.use(express.json());

ticketRoute.get('/tickets', authenticateToken, authorizeAdmin, getAllTickets);
ticketRoute.post('/tickets/verify', authenticateToken, authorizeAdmin, verifyTicketCode);
ticketRoute.get('/tickets/:ticketId', authenticateToken, getTicketById);
ticketRoute.patch('/tickets/:ticketId/cancel', authenticateToken, authorizeAdmin, cancelTicket);
ticketRoute.patch('/tickets/:ticketId/expire', authenticateToken, authorizeAdmin, expireTicket);

// Bookings integration endpoint
ticketRoute.get('/booking/:bookingId/ticket', authenticateToken, getTicketByBookingId);

export { ticketRoute };
