import {
    createScheduleRepo,
    getAllSchedulesRepo,
    getScheduleByIdRepo,
    updateScheduleRepo,
    deleteScheduleRepo,
    checkConflictRepo
} from "../repositiory/scheduleRepository.js";

export async function createSchedule(req, res) {
    try {
        const { roomId, startTime, endTime } = req.body;
        if (!roomId || !startTime || !endTime) {
            return res.status(400).send({ error: "roomId, startTime, and endTime are required" });
        }

        // Check for conflicts before creating
        const conflictCheck = await checkConflictRepo(roomId, startTime, endTime);
        if (conflictCheck.hasConflict) {
            return res.status(409).send({
                error: "Time conflict detected for the selected room",
                details: conflictCheck
            });
        }

        const schedule = await createScheduleRepo(req.body);
        return res.status(201).send(schedule);
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: err.message });
    }
}

export async function getAllSchedules(req, res) {
    try {
        const schedules = await getAllSchedulesRepo();
        return res.send(schedules);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function getScheduleById(req, res) {
    try {
        const { scheduleId } = req.params;
        const schedule = await getScheduleByIdRepo(scheduleId);
        if (!schedule) {
            return res.status(404).send({ error: "Schedule not found" });
        }
        return res.send(schedule);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function updateSchedule(req, res) {
    try {
        const { scheduleId } = req.params;
        const { roomId, startTime, endTime } = req.body;

        // If time or room is being updated, check conflicts
        if (roomId || startTime || endTime) {
            // Get current schedule details to fall back on existing values if not all are modified
            const current = await getScheduleByIdRepo(scheduleId);
            if (!current) {
                return res.status(404).send({ error: "Schedule not found" });
            }

            const targetRoomId = roomId || current.roomId;
            const targetStart = startTime || current.startTime;
            const targetEnd = endTime || current.endTime;

            const conflictCheck = await checkConflictRepo(targetRoomId, targetStart, targetEnd, scheduleId);
            if (conflictCheck.hasConflict) {
                return res.status(409).send({
                    error: "Time conflict detected for the selected room",
                    details: conflictCheck
                });
            }
        }

        const result = await updateScheduleRepo(scheduleId, req.body);
        if (result === 0) {
            return res.status(404).send({ error: "Schedule not found or no changes made" });
        }
        return res.send({ message: "Schedule updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: err.message });
    }
}

export async function deleteSchedule(req, res) {
    try {
        const { scheduleId } = req.params;
        const result = await deleteScheduleRepo(scheduleId);
        if (result === 0) {
            return res.status(404).send({ error: "Schedule not found" });
        }
        return res.send({ message: "Schedule deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function checkConflict(req, res) {
    try {
        const { roomId, startTime, endTime } = req.body;
        if (!roomId || !startTime || !endTime) {
            return res.status(400).send({ error: "roomId, startTime, and endTime are required in request body" });
        }
        const result = await checkConflictRepo(roomId, startTime, endTime);
        return res.send(result);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}
