const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const multer = require('multer');
const sharp = require('sharp');
const {sendWelcomeEmail, sendDeleteAccountEmail} = require('../emails/account');

// setup middleare for user.js nly 
// connecting to model
const User = require("../models/user");

const upload = multer({
    // removeing the dest passes the validated data through to our router to do somehtng with it
    // dest: 'avatars',
    // restricts the size of file that is uploaded
    limits: {
        // this size is represented in bytes (translates to 1MB)
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        // cb is a callback
        // multer allows us to access the file that is in consideration
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("The file you are attempting to upload is not an image file. Please try another."));
        } 
        cb(undefined, true);
    }
});

// express doen't use the returned Promise from the async function
router.post("/users", async (req, res) => {
    const user = new User(req.body);

    // this set up is more readable
    try {
        //await user.save();
        // will send a new user an email
        sendWelcomeEmail(user.email, user.name);
        // note the below function will also save the user for us
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e);
    };

    // usage of promise chaining
    // user.save().then((user) => {
    //     res.status(201).send(user);
    // }).catch((error) => {
    //     res.status(400).send(error);
    // });
});

//retrive all users saved in db
//auth has to call next() to ensure that the next thing runs
router.get("/users/me", auth, async (req, res) => {

    //route repurposed so as to return the profile of the currently sign in user
    res.send(req.user);

    // try {
    //     const users = await User.find({});
    //     res.send(users);
    // } catch (e) {
    //     res.status(500).send();
    // }
});

// takes §in an image to be saved onto the user 
router.post("/users/me/avatar", auth, upload.single('avatar'), async (req, res) => {
    // usage of sharp here to resize the image and change it png sent into the buffer 
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();

    // multer has passed the image over to this router to handle and is accessible via the req.file.buffer var
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

// usage of route params to access the dynamic value provided
// router.get("/users/:id", async (req, res) => {
//     // when testing make sure the its atleast 12 characters long
//     const _id = req.params.id;

//     try {
//         // mongoose automatically converts string ids to Object Ids
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         } 
//         res.send(user);
//     } catch(e) {
//         res.status(500).send(e);
//     }    
// });

router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ["name", "email", "password", "age"];
    // if all elements in the rray returns true the every will return every
    const isValidOperation = updates.every((update) => {
        return allowUpdates.includes(update);
    });

    if (!isValidOperation) {
        return res.status(500).send({error: "invalid updates"});
    }

    try {
        //const user = await User.findById(req.params.id);

        // allows for manualy dynamic updating of user objects
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        });
        await req.user.save();

        // new returns the new user rather than old user
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if (!req.user) {
            // if not found then the user const will be empty 
            return res.status(404).send();
        }
        res.status(200).send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

// delete functionality will only work if the user is authenticated
router.delete('/users/me', auth, async (req, res) => {
    try {
        // remember req.user holds the surrently authenticated user
        // and so when remove() is called on the currenlty logged in user
        await req.user.remove();
        sendDeleteAccountEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
    
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        // uses shorthand here because the name of the object is the same as the name of the value of that object
        res.send({user, token});
    } catch(e) {
        res.status(400).send(e);
    }
});

// route will log user out for specified user
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

// will logout of all sessions i.e delete all tokens for specified user
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

// allows a browser client to get the image and render it to the browser in html
router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user.avatar || !user) {
            throw new Error();
        }
        
        // .set(0) allows us to set the header
        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

module.exports = router;