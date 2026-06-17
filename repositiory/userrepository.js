import { pool } from "../db/database.js"
export async function getAllUsers(){
    let [result] = await pool.query(`select * from NOTIFICATION;`);
    return result;
}