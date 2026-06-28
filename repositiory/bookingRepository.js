import { Booking, User, Room } from "../models/index.js";

export async function getAllBookings() {
    const bookings = await Booking.findAll();
    return bookings.map(b => b.toJSON());
}

export async function createBooking(data) {
    const booking = await Booking.create(data);
    return booking.toJSON();
}

export async function getBookingById(bookingId) {
    const booking = await Booking.findByPk(bookingId, {
        include: [User, Room]
    });
    return booking ? booking.toJSON() : null;
}

export async function updateBooking(bookingId, updates) {
    await Booking.update(updates, { where: { bookingId } });
    return getBookingById(bookingId);
}

export async function getBookingsByUser(userId) {
    const bookings = await Booking.findAll({ where: { userId } });
    return bookings.map(b => b.toJSON());
}

export async function setBookingStatus(bookingId, status, extra = {}) {
    const updates = { status, ...extra };
    return updateBooking(bookingId, updates);
}

export async function rescheduleBooking(bookingId, startTime, endTime) {
    const updates = { startTime, endTime, status: 'rescheduled' };
    return updateBooking(bookingId, updates);
}