import { getAllUsers } from "../repositiory/userrepository.js";

export async function getAllUsersContoller(req,res){
    try{
        const result = await getAllUsers();
        return res.send(result);
    } catch (err){
        console.log(err);
        return res.send("node");
    }
}