import { User, Booking, DigitalTicket, Room, BanRecord } from "../models/index.js";

export async function getAllUsers(){
    const users = await User.findAll();
    return users.map(u => u.toJSON());
}

export async function getUserByid(id){
    const user = await User.findOne({ where: { userId: id } });
    return user ? user.toJSON() : undefined;
}

export async function editUserRepo(id,name,email){
    await User.update({ fullName: name, email }, { where: { userId: id } });
    return 1;
}

export async function banUserRepo(id, adminId, reason){
    await User.update({ status: "banned" }, { where: { userId: id } });
    await BanRecord.create({
        userId: id,
        bannedBy: adminId,
        reason: reason || "Violation of terms",
        startDate: new Date()
    });
    return 1;
}

export async function unbanUserRepo(id){
    await User.update({ status: "active" }, { where: { userId: id } });
    await BanRecord.update(
        { status: 'lifted', endDate: new Date() },
        { where: { userId: id, status: 'active' } }
    );
    return 1;
}

export async function getBookingbyuserRepo(id){
    const bookings = await Booking.findAll({
        where: { userId: id },
        include: [{ model: User, required: true}],
        include : [{model : Room, required:true}]
    });
    
    if(bookings.length === 0){
        return 0;
    } else {
        return bookings.map(b => {
            const data = b.toJSON();
            const { User: userObj, ...bookingData } = data;
            return { ...userObj, ...bookingData };
        });
    }
}

export async function getTicketsbyUserRepo(id) {
    const tickets = await DigitalTicket.findAll({
        include: [{
            model: Booking,
            required: true,
            where: { userId: id },
            include: [{ model: User, required: true }]
        }]
    });
    
    if(tickets.length == 0){
        return [];
    } else {
        return tickets.map(t => {
            const data = t.toJSON();
            return {
                ticketId: data.ticketId,
                bookingId: data.bookingId,
                ticketCode: data.ticketCode,
                qrCode: data.qrCode,
                status: data.status,
                generatedAt: data.generatedAt
            };
        });
    }
}
