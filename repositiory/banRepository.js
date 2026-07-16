import { BanRecord, User } from "../models/index.js";

export async function getAllBanRecordsRepo() {
    const records = await BanRecord.findAll({
        include: [{ model: User, attributes: ['userId', 'fullName', 'email'] }]
    });
    return records.map(r => r.toJSON());
}

export async function getBanRecordsByUserRepo(userId) {
    const records = await BanRecord.findAll({
        where: { userId },
        include: [{ model: User, attributes: ['userId', 'fullName', 'email'] }]
    });
    return records.map(r => r.toJSON());
}
