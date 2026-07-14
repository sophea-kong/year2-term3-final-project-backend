import { generateRespond } from "../utils/gemini.util.js";

const getChatAssistance = async (req,res) => {
    try {
        const {message} = req.body;
        // Extract userId from the authenticated user token (set by authenticateToken middleware)
        const userId = req.user?.userId;
        if (!message) {
            return res.status(400).json({error : "message is required."});
        }
        // Pass userId into generateRespond
        const aireply = await generateRespond(message, userId);
        return res.status(200).json({
            success : true,
            reply : aireply
        });
    } catch (err){
        return res.status(500).json({success : false, error : err.message});
    }
}

export default getChatAssistance;