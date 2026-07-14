import 'dotenv/config';
import express from 'express';
import { logger } from './middleware/logger.js';
import { route } from './routes/userRoutes.js';
import { bookingroute } from './routes/bookingRoutes.js';
import { authRoute } from './routes/auth.js';
import { roomRoute } from './routes/roomRoutes.js';
import { scheduleRoute } from './routes/schedule.routes.js';
import { ticketRoute } from './routes/ticket.routes.js';
import { creditRoute } from './routes/creditRoutes.js';
import cors from 'cors';
import { sequelize } from './db/database.js';
import { setupCronJobs } from './utils/cronJobs.js';
import chatRouter from './routes/chat.js';

const app = express();

app.use(logger);
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).send("test");
});


app.use('/auth', authRoute);
app.use("/users", route);
app.use('/booking', bookingroute);
app.use('/rooms', roomRoute);
app.use('/schedules', scheduleRoute);
app.use('/credits', creditRoute);
app.use('/', ticketRoute);
app.use('/chat',chatRouter);

if (process.env.NODE_ENV !== 'test') {
    sequelize.sync();
    setupCronJobs();
    app.listen(3000, () => {
        console.log("listening on port 3000");
    });
}

export default app;