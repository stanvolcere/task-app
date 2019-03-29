const express = require('express');

// this merely makes sure that the file runs
require("./db/mongoose");

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("Server has started on port " + port);
});