const express = require('express');
const router = express.Router();
const User = require('./Users.js');


/* Post a new user to db - for account creation*/
router.post('/', async (req, res) => {
    console.log('user post request');
    const user = new User({
        email: req.body.email,
        password: req.body.password,
        admin: req.body.admin
    })
    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch(err){
        res.json({message: err});
    }
});


module.exports = router; 