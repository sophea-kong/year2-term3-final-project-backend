import { User, Booking, DigitalTicket, Notification } from "../models/index.js";
import { sequelize } from "../db/database.js";

export async function getAllUsers(){
    const users = await User.findAll();
    return users.map(u => u.toJSON());
}

export async function getUserByid(id){
    const user = await User.findOne({ where: { userid: id } });
    return user ? user.toJSON() : undefined;
}

export async function editUserRepo(id,name,email){
    await User.update({ fullname: name, email }, { where: { userid: id } });
    return 1;
}

export async function banUserRepo(id){
    await User.update({ status: "banned" }, { where: { userid: id } });
    return 1;
}

export async function unbanUserRepo(id){
    await User.update({ status: "active" }, { where: { userid: id } });
    return 1;
}

export async function getBookingbyuserRepo(id){
    const bookings = await Booking.findAll({
        where: { userid: id },
        include: [{ model: User, required: true }]
    });
    
    if(bookings.length === 0){
        return 0;
    } else {
        // Flatten the object to match previous SQL join behavior
        return bookings.map(b => {
            const data = b.toJSON();
            const { user, ...bookingData } = data;
            return { ...user, ...bookingData };
        });
    }
}

export async function getTicketsbyUserRepo(id) {
    const tickets = await DigitalTicket.findAll({
        include: [{
            model: Booking,
            required: true,
            where: { userid: id },
            include: [{ model: User, required: true }]
        }]
    });
    
    if(tickets.length == 0){
        return [];
    } else {
        return tickets.map(t => {
            const data = t.toJSON();
            return {
                ticketid: data.ticketid,
                bookingid: data.bookingid,
                ticketCode: data.ticketCode,
                qrcode: data.qrcode,
                status: data.status,
                generatedAt: data.generatedAt
            };
        });
    }
}

export async function getNotificationByUserRepo(id){
    const notifications = await Notification.findAll({
        where: { userid: id },
        include: [{ model: User, required: true }]
    });
    
    if(notifications.length == 0){
        return [];
    } else {
        return notifications.map(n => {
            const data = n.toJSON();
            const { user, ...notifData } = data;
            return { ...user, ...notifData };
        });
    }
}