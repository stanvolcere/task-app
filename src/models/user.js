const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../models/task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number");
            }
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Sorry, email is invalid");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Sorry, password is invalid. Your password cannot contain password!");
            }
        }

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
}
);

// this middleware will run just before the save functionality is run
//used for hashing password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    //next moves to the saving process after the async function
    next();
});

// middleware that runs whenever a user attemps to delete a themselves
// which would automatically cause that user's tasks to also be deleted
userSchema.pre('remove', async function (next) {
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
});

// static methods are availble on the Model 
userSchema.statics.findByCredentials = async (email, password) => {
    // usage of destructuing here
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Unable to find that email");
    };

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("unable to login");
    };

    return user;
};

// method are accessible on the model instances (called instance methods)
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

// if we wish to use the this keyword within this function we have to defined it in the 
// normal way finctions are defined and refrain from using an arrow function
userSchema.methods.toJSON = function () {
    // user now holds the surrent user 
    const user = this;
    const userObject = user.toObject();

    // allows us to manupulate the userobject that we want tpo send back as response
    // so as to ensure that when we login the data returned to the user isn't the private ones 
    // for example password and tokens
    delete userObject.password
    delete userObject.tokens
    // avatar deleted from profile responce because it is way too large and 
    // slows down the app
    delete userObject.avatar

    return userObject;
};

// this relationship is not stored in the database
// because it's been marked virtual
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

const User = new mongoose.model('User', userSchema);

module.exports = User;