const express = require('express');
const { logger } = require('./middleware/logger');
const { route } = require('./routes/userRoutes');

const app = express()

app.use(logger);

app.get('/', (req, res) => {
    res.send("test");
})



app.use(route);

app.listen(3000, () => {
    console.log("listening on port 3000");
})