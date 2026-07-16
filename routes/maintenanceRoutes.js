import express from "express";
import {
    createMaintenanceRequest,
    getAllMaintenanceRequests,
    getMaintenanceRequestById,
    updateMaintenanceStatus,
    getMyMaintenanceRequests
} from "../controller/maintenanceController.js";
import { authenticateToken, authorizeAdmin } from "../middleware/authMiddleware.js";

const maintenanceRoute = express.Router();

maintenanceRoute.use(express.json());



maintenanceRoute.post('/', authenticateToken, createMaintenanceRequest);
maintenanceRoute.get('/my-requests', authenticateToken, getMyMaintenanceRequests);
maintenanceRoute.get('/', authenticateToken, authorizeAdmin, getAllMaintenanceRequests);
maintenanceRoute.get('/:id', authenticateToken, authorizeAdmin, getMaintenanceRequestById);
maintenanceRoute.patch('/:id/status', authenticateToken, authorizeAdmin, updateMaintenanceStatus);

export { maintenanceRoute };
