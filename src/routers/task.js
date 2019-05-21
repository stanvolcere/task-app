const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");

// connecting to model
const Task = require("../models/task");

//retrive all tasks saved in db (depending )
router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body);
    const task = new Task({
        // the spread operator copies all the object properties 
        //from the specified object to the new task object
        ...req.body,
        owner: req.user._id
    }); 

    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send(e);
    }
});

// all the below routes allows the user to filter out the data that is returned
// GET /tasks/?completed=true
// GET /tasks/?limit=2&skip=2 -> allows for pagination
// GET /tasks/?sortBy=createdBy_asc
router.get("/tasks", auth, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split("_");
        // usage of a ternary operator here
        sort[parts[0]] = parts[1] === 'desc' ? 1 : -1;   
    }
    
    try {
        //involves the usage of populate function om the user so as to 
        //filter out the tasks that belong only to the logged in user
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.status(200).send(req.user.tasks);
    } catch(e) {
        res.status(500).send(e);
    }
});

// retrieve a particular task from the db
router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // this returnes a specifc task if it belongs to the currenlty signed in user
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch(e) {
        res.status(500).send();
    }
});

//update a task  
router.patch("/tasks/:id", auth, async (req, res) => {
    // this handles the error that would occur if we try to update a property that doesm't exist 
    const updates = Object.keys(req.body);
    const allowUpdates = ["description", "completed"];
    // if all elements in the rray returns true the every will return every
    const isValidOperation = updates.every((update) => {
        return allowUpdates.includes(update);
    });

    if (!isValidOperation) {
        return res.status(500).send({error: "invalid updates"});
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if (!task) {
            return res.status(404).send({info: "Task Not Found"});
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        });
        await task.save();
        res.status(200).send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

// delete a task from the db
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;