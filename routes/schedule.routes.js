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

scheduleRoute.post('/check-conflict', checkConflict);

scheduleRoute.post('/', createSchedule);
scheduleRoute.get('/', getAllSchedules);

scheduleRoute.get('/:scheduleId', getScheduleById);
scheduleRoute.put('/:scheduleId', updateSchedule);
scheduleRoute.delete('/:scheduleId', deleteSchedule);

export { scheduleRoute };
