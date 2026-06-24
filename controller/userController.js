import { banUserRepo, editUserRepo, getAllUsers, getBookingbyuserRepo, getNotificationByUserRepo, getTicketsbyUserRepo, getUserByid, unbanUserRepo } from "../repositiory/userrepository.js";

export async function getAllUsersContoller(req,res){
    try{
        const result = await getAllUsers();
        return res.send(result);
    } catch (err){
        console.log(err);
        return res.send("node");
    }
}
     
export async function getUserByidController(req,res){
    try{
        const {id} = req.params;
        console.log(id);
        const result = await getUserByid(id);
        return res.send(result);
    } catch (err){
        console.log(err);
        return res.status(400).send("error");
    }
}


export async function editUser(req,res){
    try{
        const {id} = req.params;
        const {name,email} = req.body;
        const result = await editUserRepo(id,name,email);
        if (result==1){
            return res.send("edited");
        }
    } catch (err){
        console.log(err);
    }
}

export async function banUser(req,res){
    try{
        const {id} = req.params;
        const result = await banUserRepo(id);
        if(result==1){
            return res.send(`user : ${id} has been banned.`);
        }
    } catch (err){
        console.log(err);
    }
}

export async function unbanUser(req,res){
    try{
        const {id} = req.params;
        const result = await unbanUserRepo(id);
        if(result==1){
            return res.send(`user : ${id} has been unbanned.`);
        }
    } catch (err){
        console.log(err);
    }
}


export async function getBookingbyUser(req,res){
    try{
        const {id} = req.params;
        const result = await getBookingbyuserRepo(id);
        return res.send(result);
    } catch (err){
        console.log(err);
    }
}


export async function getTicketsByuser(req,res){
    try{
        const {id} = req.params;
        const result = await getTicketsbyUserRepo(id);
        return res.send(result);
    } catch (err){
        console.log(err);
    }
}

export async function getNotificationByUser(req,res){
    try{
        const {id} = req.params;
        const result = await getNotificationByUserRepo(id);
        return res.send(result);
    } catch (err){
        console.log(err);
    }
}