import express from "express";
import {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    updateRoomStatus,
    getAvailableRooms,
    getRoomSchedules,
    getRoomBookings
} from "../controller/roomController.js";

const roomRoute = express.Router();
roomRoute.use(express.json());

// Main collection routes
roomRoute.post('/', createRoom);
roomRoute.get('/', getAllRooms);

// Available rooms route (placed before :room_id to avoid parameter clash)
roomRoute.get('/available', getAvailableRooms);

// Individual room routes
roomRoute.get('/:room_id', getRoomById);
roomRoute.put('/:room_id', updateRoom);
roomRoute.delete('/:room_id', deleteRoom);
roomRoute.patch('/:room_id/status', updateRoomStatus);
roomRoute.get('/:room_id/schedules', getRoomSchedules);
roomRoute.get('/:room_id/bookings', getRoomBookings);

export { roomRoute };
