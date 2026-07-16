import { MaintenanceRequest, Room, User } from "../models/index.js";

export async function createMaintenanceRequestRepo(data) {
    const request = await MaintenanceRequest.create(data);
    return request.toJSON();
}

export async function getAllMaintenanceRequestsRepo() {
    const requests = await MaintenanceRequest.findAll({
        include: [
            { model: Room },
            { model: User }
        ]
    });
    return requests.map(r => r.toJSON());
}

export async function getMaintenanceRequestByIdRepo(id) {
    const request = await MaintenanceRequest.findOne({ 
        where: { maintenanceId: id },
        include: [
            { model: Room },
            { model: User }
        ]
    });
    return request ? request.toJSON() : null;
}

export async function updateMaintenanceStatusRepo(id, status) {
    const [affectedCount] = await MaintenanceRequest.update({ status }, { where: { maintenanceId: id } });
    return affectedCount;
}

export async function getMaintenanceRequestsByRoomRepo(roomId) {
    const requests = await MaintenanceRequest.findAll({ where: { roomId } });
    return requests.map(r => r.toJSON());
}

export async function getMaintenanceRequestsByUserRepo(userId) {
    const requests = await MaintenanceRequest.findAll({ where: { reportedBy: userId } });
    return requests.map(r => r.toJSON());
}
