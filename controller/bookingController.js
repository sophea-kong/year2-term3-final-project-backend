import { getAllBookings } from "../repositiory/bookingRepository.js";

export async function getAllBooking(req,res){
    try{
        const result = await getAllBookings();
        return res.send(result);
    } catch(err){
        console.log(err);
        return res.send('erorr');
    }
}