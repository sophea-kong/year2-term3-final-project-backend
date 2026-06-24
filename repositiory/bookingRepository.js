import { pool } from "../db/database.js";

export async function getAllBookings() {
    let [result] = await pool.query(`select * from booking;`);
    return result;
}