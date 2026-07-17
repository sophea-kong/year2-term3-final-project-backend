import { getBookingById } from "../repositiory/bookingRepository.js";
import {
    getAllTicketsRepo,
    getTicketByIdRepo,
    getTicketByBookingIdRepo,
    getTicketByCodeRepo,
    updateTicketStatusRepo
} from "../repositiory/ticketRepository.js";
import { getMe } from "./authController.js";

export async function getAllTickets(req, res) {
    try {
        const tickets = await getAllTicketsRepo();
        return res.send(tickets);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function getTicketById(req, res) {
    try {
        const { ticketId } = req.params;
        const ticket = await getTicketByIdRepo(ticketId);
        if (!ticket) {
            return res.status(404).send({ error: "Ticket not found" });
        }

        if (ticket.Booking && ticket.Booking.userId !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).send({ error: "Access denied. You are not the owner of this ticket." });
        }

        return res.send(ticket);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function getTicketByBookingId(req, res) {
    try {
        const { bookingId } = req.params;
        const ticket = await getTicketByBookingIdRepo(bookingId);
        if (!ticket) {
            return res.status(404).send({ error: "Ticket not found for this booking" });
        }
        if (ticket.Booking && ticket.Booking.userId !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).send({ error: "Access denied. You are not the owner of this ticket." });
        }

        return res.send(ticket);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function verifyTicketCode(req, res) {
    try {
        const { ticketCode } = req.body;
        if (!ticketCode) {
            return res.status(400).send({ error: "ticketCode is required in request body" });
        }

        const ticket = await getTicketByCodeRepo(ticketCode);
        if (!ticket) {
            return res.status(404).send({ verified: false, error: "Ticket code not found" });
        }

        if (ticket.status !== 'valid') {
            return res.send({
                verified: false,
                status: ticket.status,
                message: `Ticket is not valid (status: ${ticket.status})`,
                ticket
            });
        }

        await updateTicketStatusRepo(ticket.ticketId, 'used');
        ticket.status = 'used';

        return res.send({
            verified: true,
            message: "Ticket verified successfully and marked as used",
            ticket
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function cancelTicket(req, res) {
    try {
        const { ticketId } = req.params;
        const ticket = await getTicketByIdRepo(ticketId);
        if (!ticket) {
            return res.status(404).send({ error: "Ticket not found" });
        }

        await updateTicketStatusRepo(ticketId, 'cancelled');
        return res.send({ message: "Ticket cancelled successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function expireTicket(req, res) {
    try {
        const { ticketId } = req.params;
        const ticket = await getTicketByIdRepo(ticketId);
        if (!ticket) {
            return res.status(404).send({ error: "Ticket not found" });
        }

        await updateTicketStatusRepo(ticketId, 'expired');
        return res.send({ message: "Ticket expired successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}
