import express from "express";
import {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule,
    checkConflict
} from "../controller/scheduleController.js";

const scheduleRoute = express.Router();
scheduleRoute.use(express.json());

// Conflict checking (placed first to prevent parameter conflict with scheduleId)
scheduleRoute.post('/check-conflict', checkConflict);

// Main collection routes
scheduleRoute.post('/', createSchedule);
scheduleRoute.get('/', getAllSchedules);

// Individual schedule routes
scheduleRoute.get('/:scheduleId', getScheduleById);
scheduleRoute.put('/:scheduleId', updateSchedule);
scheduleRoute.delete('/:scheduleId', deleteSchedule);

export { scheduleRoute };
