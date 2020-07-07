require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/Users.js');


router.patch('/', async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(user === null) return res.status(400).json({error: 'There is no user with the given email.'});
      
        //Change secret
        const reset_token = await jwt.sign({_id: user._id} , process.env.RESET_TOKEN_SECRET, {expiresIn: '10m'});
        await user.updateOne({resetLink: reset_token}, (err, succ) => {
            if(err) return res.status(400).json({error: "Couldn't store token."});
            else {
                res.send(reset_token);
            }
        });
    } catch {
        res.status(500).json({error: 'Server error.'})
    }
});

/* 
    expects: in req.body resetToken, newPass
*/
router.patch('/reset', async (req, res) => {
    try {
        const {resetToken, newPass } = req.body;
        const hashedPassword = await bcrypt.hash(newPass, 10);
        if(resetToken) {
            await jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET)

            const user = await User.findOne({resetLink: resetToken});
            if(user === null) return res.status(400).json({error: 'Invalid reset token.'});

            await user.updateOne({password: hashedPassword});
            await user.updateOne({resetLink: ''});
            res.status(200).json({messsage: 'Password has been updated.'});    
        } else {
            return res.status(400).json({error: 'Missing reset token.'});
        }
    } catch (err) {
       res.status(500).json({error: err})
    }

});

module.exports = router; 