import { getAllBanRecordsRepo, getBanRecordsByUserRepo } from "../repositiory/banRepository.js";

export async function getAllBanRecords(req, res) {
    try {
        const records = await getAllBanRecordsRepo();
        res.status(200).json({ success: true, data: records });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getBanRecordsByUserId(req, res) {
    try {
        const { userId } = req.params;
        const records = await getBanRecordsByUserRepo(userId);
        res.status(200).json({ success: true, data: records });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
