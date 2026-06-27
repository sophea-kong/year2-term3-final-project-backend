import { Schedule, Room, Booking } from "../models/index.js";
import { Op } from "sequelize";

export async function createScheduleRepo(scheduleData) {
    const schedule = await Schedule.create(scheduleData);
    return schedule.toJSON();
}

export async function getAllSchedulesRepo() {
    const schedules = await Schedule.findAll({
        include: [{ model: Room, required: false }]
    });
    return schedules.map(s => s.toJSON());
}

export async function getScheduleByIdRepo(id) {
    const schedule = await Schedule.findOne({
        where: { scheduleId: id },
        include: [{ model: Room, required: false }]
    });
    return schedule ? schedule.toJSON() : null;
}

export async function updateScheduleRepo(id, scheduleData) {
    const [affectedCount] = await Schedule.update(scheduleData, {
        where: { scheduleId: id }
    });
    return affectedCount;
}

export async function deleteScheduleRepo(id) {
    const affectedCount = await Schedule.destroy({
        where: { scheduleId: id }
    });
    return affectedCount;
}

export async function checkConflictRepo(roomId, startTime, endTime, excludeScheduleId = null) {
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Overlap condition: (s.startTime < end) AND (s.endTime > start)
    const scheduleWhere = {
        roomId,
        startTime: { [Op.lt]: end },
        endTime: { [Op.gt]: start }
    };

    if (excludeScheduleId) {
        scheduleWhere.scheduleId = { [Op.ne]: excludeScheduleId };
    }

    const conflictingSchedules = await Schedule.findAll({
        where: scheduleWhere
    });

    // Also check active bookings (status not rejected and not cancelled)
    const conflictingBookings = await Booking.findAll({
        where: {
            roomId,
            startTime: { [Op.lt]: end },
            endTime: { [Op.gt]: start },
            status: { [Op.notIn]: ['rejected', 'cancelled'] }
        }
    });

    const hasConflict = conflictingSchedules.length > 0 || conflictingBookings.length > 0;

    return {
        hasConflict,
        conflictingSchedules: conflictingSchedules.map(s => s.toJSON()),
        conflictingBookings: conflictingBookings.map(b => b.toJSON())
    };
}
