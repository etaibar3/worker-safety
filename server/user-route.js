const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('./Users.js');


/* Post a new user to db - for account creation*/
router.post('/', async (req, res) => {
    
    try {
        const same_email = User.find( {"email": req.body.email });
        if(same_email != null) {
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


module.exports = router; 