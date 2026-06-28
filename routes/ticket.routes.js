import express from "express";
import {
    getAllTickets,
    getTicketById,
    getTicketByBookingId,
    verifyTicketCode,
    cancelTicket,
    expireTicket
} from "../controller/ticketController.js";

const ticketRoute = express.Router();
ticketRoute.use(express.json());

ticketRoute.get('/tickets', getAllTickets);
ticketRoute.post('/tickets/verify', verifyTicketCode);
ticketRoute.get('/tickets/:ticketId', getTicketById);
ticketRoute.patch('/tickets/:ticketId/cancel', cancelTicket);
ticketRoute.patch('/tickets/:ticketId/expire', expireTicket);

// Bookings integration endpoint
ticketRoute.get('/bookings/:bookingId/ticket', getTicketByBookingId);

export { ticketRoute };
