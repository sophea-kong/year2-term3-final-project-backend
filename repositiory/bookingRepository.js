import { where } from "sequelize";
import { Booking, Room } from "../models/index.js";

// Helper to format booking: replaces or appends roomName
function formatBooking(b) {
    if (!b) return null;
    const data = b.toJSON();
    data.roomName = data.Room ? data.Room.roomName : null;
    delete data.Room;
    return data;
}

export async function getAllBookings() {
    const bookings = await Booking.findAll({
        include: [{
            model: Room,
            attributes: ['roomName'],
            required: false
        }]
    });
    return bookings.map(formatBooking);
}

export async function createBooking(bookingData) {
    const booking = await Booking.create(bookingData);
    // Reload to get the roomName
    const reloaded = await Booking.findOne({
        where: { bookingId: booking.bookingId },
        include: [{
            model: Room,
            attributes: ['roomName'],
            required: false
        }]
    });
    return formatBooking(reloaded);
}

export async function getBookingById(id) {
    const booking = await Booking.findOne({
        where: { bookingId: id },
        include: [{
            model: Room,
            attributes: ['roomName'],
            required: false
        }]
    });
    return booking ? formatBooking(booking) : null;
}

export async function updateBooking(id, bookingData) {
    await Booking.update(bookingData, {
        where: { bookingId: id }
    });
    return getBookingById(id);
}

export async function getBookingsByUser(userId) {
    const bookings = await Booking.findAll({
        where: { userId },
        include: [{
            model: Room,
            attributes: ['roomName'],
            required: false
        }]
    });
    return bookings.map(formatBooking);
}

export async function setBookingStatus(id, status, extraFields = {}) {
    await Booking.update({ status, ...extraFields }, {
        where: { bookingId: id }
    });
    return getBookingById(id);
}

export async function rescheduleBooking(id, startTime, endTime) {
    await Booking.update({ startTime, endTime }, {
        where: { bookingId: id }
    });
    return getBookingById(id);
}

export async function pendingBookingRepo() {
    const bookings = await Booking.findAll({
        include: [{
            model: Room,
            attributes: ['roomName'],
            required: false
        }],
        where : {status : 'pending'}
    });
    return bookings.map(formatBooking);
}