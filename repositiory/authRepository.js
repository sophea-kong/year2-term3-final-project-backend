import { pool } from "../db/database.js";

export async function createUserRepo(fullname, email, passwordHash) {
    const [result] = await pool.query(
        `INSERT INTO user (fullname, email, password, status) VALUES (?, ?, ?, 'active')`,
        [fullname, email, passwordHash]
    );
    return result.insertId;
}

export async function getUserByEmailRepo(email) {
    const [result] = await pool.query(`SELECT * FROM user WHERE email = ?`, [email]);
    return result[0];
}

export async function updatePasswordRepo(userId, newPasswordHash) {
    await pool.query(`UPDATE user SET password = ? WHERE userid = ?`, [newPasswordHash, userId]);
    return 1;
}
