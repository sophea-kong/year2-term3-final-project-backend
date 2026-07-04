import { User } from "../models/index.js";

export async function createUserRepo(fullname, email, passwordHash) {
    const user = await User.create({
        fullName: fullname,
        email,
        password: passwordHash,
        status: 'active'
    });
    return user.userId;
}

export async function getUserByEmailRepo(email) {
    const user = await User.findOne({ where: { email } });
    return user ? user.toJSON() : null;
}

export async function updatePasswordRepo(userId, newPasswordHash) {
    await User.update({ password: newPasswordHash }, { where: { userId } });
    return 1;
}

