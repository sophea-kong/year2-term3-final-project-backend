import {
    createMaintenanceRequestRepo,
    getAllMaintenanceRequestsRepo,
    getMaintenanceRequestByIdRepo,
    updateMaintenanceStatusRepo,
    getMaintenanceRequestsByRoomRepo,
    getMaintenanceRequestsByUserRepo
} from "../repositiory/maintenanceRepository.js";

export async function createMaintenanceRequest(req, res) {
    try {
        const { roomId, issueTitle, description } = req.body;
        
        if (!roomId || !issueTitle) {
            return res.status(400).send({ error: "roomId and issueTitle are required" });
        }

        const data = {
            roomId,
            issueTitle,
            description,
            reportedBy: req.user.userId, // Assuming authenticateToken middleware adds user to req
            status: 'open'
        };

        const request = await createMaintenanceRequestRepo(data);
        return res.status(201).send(request);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function getAllMaintenanceRequests(req, res) {
    try {
        const requests = await getAllMaintenanceRequestsRepo();
        return res.send(requests);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function getMaintenanceRequestById(req, res) {
    try {
        const { id } = req.params;
        const request = await getMaintenanceRequestByIdRepo(id);
        if (!request) {
            return res.status(404).send({ error: "Maintenance request not found" });
        }
        return res.send(request);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function updateMaintenanceStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).send({ error: "Valid status is required ('open', 'in_progress', 'resolved', 'closed')" });
        }

        const result = await updateMaintenanceStatusRepo(id, status);
        if (result === 0) {
            return res.status(404).send({ error: "Maintenance request not found or status unchanged" });
        }
        return res.send({ message: `Maintenance status updated to ${status}` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}

export async function getMyMaintenanceRequests(req, res) {
    try {
        const userId = req.user.userId;
        const requests = await getMaintenanceRequestsByUserRepo(userId);
        return res.send(requests);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
    }
}
