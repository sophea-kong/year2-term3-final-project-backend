const express = require('express');
const { logger } = require('./middleware/logger');
const { route } = require('./routes/userRoutes');
const { bookingroute } = require('./routes/bookingRoutes');
const { authRoute } = require('./routes/auth.js');

const app = express()

app.use(logger);

app.get('/', (req, res) => {
    res.send("test");
})



app.use('/auth', authRoute);
app.use("/users",route);
app.use('/booking',bookingroute);

app.listen(3000, () => {
    console.log("listening on port 3000");
})