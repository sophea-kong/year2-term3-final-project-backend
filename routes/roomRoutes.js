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
import multer from "multer";
import { uploadRoomImage } from "../controller/roomController.js";
import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleware.js";


const upload = multer({storage : multer.memoryStorage() });

const roomRoute = express.Router();
roomRoute.use(express.json());

// Main collection routes
roomRoute.post('/', authenticateToken, authorizeAdmin, createRoom);
roomRoute.get('/', getAllRooms);

// Available rooms route (placed before :room_id to avoid parameter clash)
roomRoute.get('/available', getAvailableRooms);

// Individual room routes
roomRoute.get('/:room_id', getRoomById);
roomRoute.put('/:room_id', authenticateToken, authorizeAdmin, updateRoom);
roomRoute.delete('/:room_id', authenticateToken, authorizeAdmin, deleteRoom);
roomRoute.patch('/:room_id/status', authenticateToken, authorizeAdmin, updateRoomStatus);
roomRoute.get('/:room_id/schedules', getRoomSchedules);
roomRoute.get('/:room_id/bookings', authenticateToken, getRoomBookings);

roomRoute.post('/:room_id/images', authenticateToken, authorizeAdmin, upload.single('image'), uploadRoomImage);

export { roomRoute };
