import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUserRepo, getUserByEmailRepo, updatePasswordRepo } from "../repositiory/authRepository.js";
import { getUserByid, editUserRepo } from "../repositiory/userrepository.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export async function register(req, res) {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const existingUser = await getUserByEmailRepo(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const userId = await createUserRepo(fullname, email, hashedPassword);
        return res.status(201).json({ message: "User registered successfully", userId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        const user = await getUserByEmailRepo(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        if (user.status === 'banned') {
            return res.status(403).json({ error: "User is banned" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        const id = user.userId || user.id;
        const token = jwt.sign({ userId: id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return res.json({ message: "Login successful", token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function logout(req, res) {
    // Usually handled client-side by deleting token
    return res.json({ message: "Logout successful" });
}

export async function getMe(req, res) {
    try {
        const user = await getUserByid(req.user.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        
        const { password, ...userData } = user;
        return res.json(userData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateMe(req, res) {
    try {
        const { fullname, email } = req.body;
        if (!fullname || !email) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const result = await editUserRepo(req.user.userId, fullname, email);
        if (result === 1) {
            return res.json({ message: "Profile updated successfully" });
        } else {
            return res.status(400).json({ error: "Could not update profile" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const user = await getUserByEmailRepo(email);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Create a temporary reset token
        const resetToken = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '15m' });
        // In real app, send an email with reset token link
        return res.json({ message: "Password reset link generated", resetToken });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function resetPassword(req, res) {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ error: "Missing fields" });
        
        let payload;
        try {
            payload = jwt.verify(token, JWT_SECRET);
        } catch (e) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        await updatePasswordRepo(payload.userId, hashedPassword);
        return res.json({ message: "Password reset successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
