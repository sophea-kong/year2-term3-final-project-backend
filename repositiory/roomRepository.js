import { Room, Schedule, Booking } from "../models/index.js";

export async function createRoomRepo(roomData) {
    const room = await Room.create(roomData);
    return room.toJSON();
}

export async function getAllRoomsRepo() {
    const rooms = await Room.findAll();
    return rooms.map(r => r.toJSON());
}

export async function getRoomByIdRepo(id) {
    const room = await Room.findOne({ where: { roomId: id } });
    return room ? room.toJSON() : null;
}

export async function updateRoomRepo(id, roomData) {
    const [affectedCount] = await Room.update(roomData, { where: { roomId: id } });
    return affectedCount;
}

export async function deleteRoomRepo(id) {
    const affectedCount = await Room.destroy({ where: { roomId: id } });
    return affectedCount;
}

export async function updateRoomStatusRepo(id, status) {
    const [affectedCount] = await Room.update({ status }, { where: { roomId: id } });
    return affectedCount;
}

export async function getAvailableRoomsRepo() {
    const rooms = await Room.findAll({ where: { status: 'available' } });
    return rooms.map(r => r.toJSON());
}

export async function getRoomSchedulesRepo(id) {
    const schedules = await Schedule.findAll({ where: { roomId: id } });
    return schedules.map(s => s.toJSON());
}

export async function getRoomBookingsRepo(id) {
    const bookings = await Booking.findAll({ where: { roomId: id } });
    return bookings.map(b => b.toJSON());
}