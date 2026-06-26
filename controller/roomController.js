import {
    createRoomRepo,
    getAllRoomsRepo,
    getRoomByIdRepo,
    updateRoomRepo,
    deleteRoomRepo,
    updateRoomStatusRepo,
    getAvailableRoomsRepo,
    getRoomSchedulesRepo,
    getRoomBookingsRepo
} from "../repositiory/roomRepository.js";

export async function createRoom(req, res) {
    try {
        const room = await createRoomRepo(req.body);
        return res.status(211).send(room);
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: err.message });
    }
}

export async function getAllRooms(req, res) {
    try {
        const rooms = await getAllRoomsRepo();
        return res.send(rooms);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function getRoomById(req, res) {
    try {
        const { room_id } = req.params;
        const room = await getRoomByIdRepo(room_id);
        if (!room) {
            return res.status(404).send({ error: "Room not found" });
        }
        return res.send(room);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function updateRoom(req, res) {
    try {
        const { room_id } = req.params;
        const result = await updateRoomRepo(room_id, req.body);
        if (result === 0) {
            return res.status(404).send({ error: "Room not found or no changes made" });
        }
        return res.send({ message: "Room updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: err.message });
    }
}

export async function deleteRoom(req, res) {
    try {
        const { room_id } = req.params;
        const result = await deleteRoomRepo(room_id);
        if (result === 0) {
            return res.status(404).send({ error: "Room not found" });
        }
        return res.send({ message: "Room deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function updateRoomStatus(req, res) {
    try {
        const { room_id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).send({ error: "Status is required" });
        }
        const result = await updateRoomStatusRepo(room_id, status);
        if (result === 0) {
            return res.status(404).send({ error: "Room not found or status unchanged" });
        }
        return res.send({ message: `Room status updated to ${status}` });
    } catch (err) {
        console.error(err);
        return res.status(400).send({ error: err.message });
    }
}

export async function getAvailableRooms(req, res) {
    try {
        const rooms = await getAvailableRoomsRepo();
        return res.send(rooms);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function getRoomSchedules(req, res) {
    try {
        const { room_id } = req.params;
        const schedules = await getRoomSchedulesRepo(room_id);
        return res.send(schedules);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function getRoomBookings(req, res) {
    try {
        const { room_id } = req.params;
        const bookings = await getRoomBookingsRepo(room_id);
        return res.send(bookings);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}
