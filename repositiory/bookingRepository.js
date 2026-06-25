import { Booking } from "../models/index.js";

export async function getAllBookings() {
    const bookings = await Booking.findAll();
    return bookings.map(b => b.toJSON());
}