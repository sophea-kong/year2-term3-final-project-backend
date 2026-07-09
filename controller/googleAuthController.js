import { google } from "googleapis";
import { User } from "../models/index.js";
import { encrypt } from "../utils/cypto.js";
import jwt from "jsonwebtoken";

const oatuh2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
)

export function getGoogleAuthUrl(req,res){
    const scopes = ['https://www.googleapis.com/auth/calendar.events'];
    
    // Get token from auth header or query parameter
    let token = req.query.token;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    const url = oatuh2Client.generateAuthUrl({
        access_type : 'offline',
        prompt : 'consent',
        scope : scopes,
        state : token,
    })

    res.redirect(url);
}

export async function googleCallback(req,res){
    const {code, state} = req.query;

    if(!code){
        return res.status(300).send("Authorization code missing.");
    }
    if(!state){
        return res.status(401).send("Authentication token state missing.");
    }

    let userId;
    try {
        const decoded = jwt.verify(state, process.env.JWT_SECRET || 'secret_key');
        userId = decoded.userId || decoded.id;
    } catch (err) {
        console.error("Token verification failed in googleCallback:", err);
        return res.status(401).send("Invalid token state.");
    }

    try{
        const {tokens} = await oatuh2Client.getToken(code);
        const encryptedAccessToken = encrypt(tokens.access_token);
        const encryptedRefreshedToken = tokens.refresh_token? encrypt(tokens.refresh_token) : null;
        const tokenExpiry = tokens.expiry_date;

        const updatePayload = {
            googleAccessToken : encryptedAccessToken,
            googleTokenExpiry : tokenExpiry
        }

        if (encryptedRefreshedToken){
            updatePayload.googleRefreshToken = encryptedRefreshedToken;
        }

        await User.update(updatePayload ,{where : {userId}});

        return res.redirect('http://localhost:5173/profile?status=success');
    } catch (err){
      console.error("error exchanging code for tokens : ", err);
        return res.redirect('http://localhost:5173/profile?status=error');
    }
}