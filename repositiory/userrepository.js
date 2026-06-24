import { pool } from "../db/database.js"
export async function getAllUsers(){
    let [result] = await pool.query(`select * from User;`);
    return result;
}

export async function getUserByid(id){
    let [result] = await pool.query(`select * from User where userId=?`,[id]);
    return result[0];
}

export async function editUserRepo(id,name,email){
    await pool.query(`update user set fullname=?,email=? where userid=?;`,[name,email,id]);
    return 1;
}

export async function banUserRepo(id){
    await pool.query(`update user set status="banned" where userid=?`,[id]);
    return 1;
}

export async function unbanUserRepo(id){
    await pool.query(`update user set status="active" where userid=?`,[id]);
    return 1;
}

export async function getBookingbyuserRepo(id){
    let [result] = await pool.query(`select * from user u join booking b using (userid) where userId=?`,[id]);
    if(result.length === 0){
        return 0;
    } else {
        return result;
    }
}

export async function getTicketsbyUserRepo(id) {
    let [result] = await pool.query(`select d.ticketid,d.bookingid,d.ticketCode,d.qrcode,d.status,d.generatedAt from user u join booking b using (userid) join digital_ticket d using (bookingid) where userid=?`,[id]);
    if(result.length == 0){
        return [];
    } else {
        return result;
    }
}


export async function getNotificationByUserRepo(id){
    let [result] = await pool.query(`select n.notificationid,n.userid,n.title,n.message,n.type,n.isread,n.createdat from notification n join user u using (userid) where userid=?`,[id]);
    if(result.length == 0){
        return [];
    } else {
        return result;
    }
}