import express from 'express';
import { logger } from './middleware/logger.js';
import { route } from './routes/userRoutes.js';
import { bookingroute } from './routes/bookingRoutes.js';
import { authRoute } from './routes/auth.js';
import { roomRoute } from './routes/roomRoutes.js';

const app = express();

app.use(logger);

app.get('/', (req, res) => {
    res.send("test");
});

app.use('/auth', authRoute);
app.use("/users", route);
app.use('/booking', bookingroute);
app.use('/rooms', roomRoute);

app.listen(3000, () => {
    console.log("listening on port 3000");
});