const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./Users.js');


/* Post a new user to db - for account creation*/
router.post('/', async (req, res) => {
    try { //Verify an email is valid? if thats possible
        const same_email = await User.findOne( {"email": req.body.email }, {"email": 1}); 
        if(await same_email != null) { 
            res.status(400).send('A user with this email already exists.');
            return;
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            admin: req.body.admin
        })
        const savedUser = await user.save();
        res.json(savedUser);
    } catch(err){
        res.json({message: err});
    }
});

/*Post request to authenticate user */
router.post('/login', async (req, res) => {
    try {
        const pword = await User.findOne( {"email": req.body.email}, {"password": 1} );
        if(pword === null) {
            res.status(404).send('There is no user with this email.');
            return;
        }
        if(await bcrypt.compare(req.body.password, pword.password)) {
            res.send('Successful login');
        } else {
            res.status(403).send('User name and password do not match.');
        }
    } catch(err) {
        res.json({message: err});
    }
});


module.exports = router; 