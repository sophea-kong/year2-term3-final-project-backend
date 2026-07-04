import express from "express";
import {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    checkConflict
} from "../controller/scheduleController.js";
import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleware.js";

const scheduleRoute = express.Router();
scheduleRoute.use(express.json());

scheduleRoute.post('/check-conflict', checkConflict);

scheduleRoute.post('/', authenticateToken, authorizeAdmin, createSchedule);
scheduleRoute.get('/', getAllSchedules);

scheduleRoute.get('/:scheduleId', getScheduleById);
scheduleRoute.put('/:scheduleId', authenticateToken, authorizeAdmin, updateSchedule);
scheduleRoute.delete('/:scheduleId', authenticateToken, authorizeAdmin, deleteSchedule);

export { scheduleRoute };
