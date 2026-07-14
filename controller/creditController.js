import { User, CreditTransaction } from '../models/index.js';

export async function getUserBalance(req, res) {
    try {
        const userId = req.user.userId;
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const transactions = await CreditTransaction.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });

        return res.json({
            creditBalance: user.creditBalance,
            transactions
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function manageUserCredits(req, res) {
    try {
        const { targetUserId, amount, type, reason } = req.body;

        if (!targetUserId || !amount || !type || !reason) {
            return res.status(400).json({ error: "Missing required fields: targetUserId, amount, type, reason" });
        }

        if (type !== 'addition' && type !== 'deduction') {
            return res.status(400).json({ error: "Invalid transaction type" });
        }

        const user = await User.findByPk(targetUserId);
        if (!user) {
            return res.status(404).json({ error: "Target user not found" });
        }

        const numericAmount = parseInt(amount, 10);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ error: "Amount must be a positive integer" });
        }

        // Adjust balance
        if (type === 'addition') {
            user.creditBalance += numericAmount;
        } else {
            user.creditBalance -= numericAmount;
        }

        await user.save();

        // Create transaction record
        const transaction = await CreditTransaction.create({
            userId: targetUserId,
            amount: numericAmount,
            type: type,
            reason: reason
        });

        return res.json({
            message: "Credits updated successfully",
            newBalance: user.creditBalance,
            transaction
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
