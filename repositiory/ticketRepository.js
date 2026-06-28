import { DigitalTicket, Booking, User, Room } from "../models/index.js";

export async function getAllTicketsRepo() {
    const tickets = await DigitalTicket.findAll({
        include: [{
            model: Booking,
            required: false,
            include: [
                { model: User, required: false },
                { model: Room, required: false }
            ]
        }]
    });
    return tickets.map(t => t.toJSON());
}

export async function getTicketByIdRepo(id) {
    const ticket = await DigitalTicket.findOne({
        where: { ticketId: id },
        include: [{
            model: Booking,
            required: false,
            include: [
                { model: User, required: false },
                { model: Room, required: false }
            ]
        }]
    });
    return ticket ? ticket.toJSON() : null;
}

export async function getTicketByBookingIdRepo(bookingId) {
    const ticket = await DigitalTicket.findOne({
        where: { bookingId },
        include: [{
            model: Booking,
            required: false,
            include: [
                { model: User, required: false },
                { model: Room, required: false }
            ]
        }]
    });
    return ticket ? ticket.toJSON() : null;
}

export async function getTicketByCodeRepo(ticketCode) {
    const ticket = await DigitalTicket.findOne({
        where: { ticketCode },
        include: [{
            model: Booking,
            required: false,
            include: [
                { model: User, required: false },
                { model: Room, required: false }
            ]
        }]
    });
    return ticket ? ticket.toJSON() : null;
}

export async function updateTicketStatusRepo(id, status) {
    const [affectedCount] = await DigitalTicket.update({ status }, {
        where: { ticketId: id }
    });
    return affectedCount;
}
