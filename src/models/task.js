const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // makes reference to the user through it's objectId
        ref: 'User '
    }
}, {timestamps: true});

// task model stores the id of the 
const Task = new mongoose.model('Task', taskSchema);

module.exports = Task;