import { DigitalTicket, Booking, User, Room } from "../models/index.js";
import crypto from "crypto";

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
            required: false
        }]
    });
    return ticket ? ticket.toJSON() : null;
}

export async function getTicketByBookingIdRepo(bookingId) {
    const ticket = await DigitalTicket.findOne({
        where: { bookingId }
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

export async function createTicketRepo(bookingId) {
    const ticketCode = crypto.randomBytes(16).toString("hex");
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticketCode}`;
    
    const ticket = await DigitalTicket.create({
        bookingId,
        ticketCode,
        qrCode,
        status: 'valid'
    });
    return ticket.toJSON();
}
