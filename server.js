const express = require('express');
const { logger } = require('./middleware/logger');

const app = express()

app.use(logger);

app.get('/', (req, res) => {
    res.send("test");
})
app.listen(3000, () => {
    console.log("listening on port 3000");
})