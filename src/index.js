const express = require('express');
const cors =  require('cors');

// this merely makes sure that the file runs
require("./db/mongoose");

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

app.use(express.json());
// allows any url in the world to access our 
app.use(cors());
app.use(userRouter);
app.use(taskRouter);

app.get("/", (req, res) => {
    res.send({
        Message: "Welcome to the Task App API. Please sign up or log in!"
    });
});

app.listen(port, () => {
    console.log("Server has started on port " + port);
});