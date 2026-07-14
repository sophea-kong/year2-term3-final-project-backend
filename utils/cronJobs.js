import cron from 'node-cron';
import { Op } from 'sequelize';
import { Booking, User, CreditTransaction } from '../models/index.js';

export function setupCronJobs() {
    // Run every hour at minute 0
    cron.schedule('0 * * * *', async () => {
        console.log("Running scheduled job: Check for No-Show bookings");
        try {
            const now = new Date();

            // Find all approved bookings where endTime has passed
            const expiredBookings = await Booking.findAll({
                where: {
                    status: 'approved',
                    endTime: {
                        [Op.lt]: now
                    }
                }
            });

            for (const booking of expiredBookings) {
                // Update booking status to no-show
                booking.status = 'no-show';
                await booking.save();

                // Deduct credits from user (e.g., 20 credits penalty)
                const PENALTY_AMOUNT = 20;
                const user = await User.findByPk(booking.userId);
                
                if (user) {
                    user.creditBalance -= PENALTY_AMOUNT;
                    await user.save();

                    await CreditTransaction.create({
                        userId: user.userId,
                        amount: PENALTY_AMOUNT,
                        type: 'deduction',
                        reason: `No-show penalty for booking ${booking.bookingId}`
                    });
                    
                    console.log(`Penalized user ${user.userId} for no-show on booking ${booking.bookingId}`);
                }
            }
        } catch (error) {
            console.error("Error in no-show cron job:", error);
        }
    });
}
