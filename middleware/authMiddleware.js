import jwt from "jsonwebtoken";
import { getUserByid } from "../repositiory/userrepository.js";

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log(authHeader);
    let token = authHeader;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    
    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
}

export async function authorizeAdmin(req, res, next) {
    const user = await getUserByid(req.user.userId);
    if (user.userId && user.role == 'admin') {
        next();
    } else {
        console.log(user);
        console.log(user.role);
        return res.status(403).json({ error: "Access denied. Admin role required." });
    }
}


// for testing send jwt payload in req.user instead of verifying token
// export function authenticateToken(req, res, next) {
//     req.user = {
//         id: 2,
//         role: "user"
//     };

//     next();
// }