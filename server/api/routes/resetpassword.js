require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
const User = require('../models/Users.js');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let msg = {
    to: '',
    from: 'benjamin.bodine@tufts.edu',
    subject: 'Safe Return Password Reset',
    html: ''
  };

/* 
    expects in req.body: email
*/
router.patch('/', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({email: email});
        if(user === null) return res.status(400).json({error: 'There is no user with the given email.'});
      
        const reset_token = await jwt.sign({_id: user._id} , process.env.RESET_TOKEN_SECRET, {expiresIn: '10m'});
        await user.updateOne({resetLink: reset_token}, (err) => {
            if(err) return res.status(400).json({error: "Couldn't store token."});
            else {
                msg.to = email;
                msg.html = `
                            <h2>Follow the link below to reset your password.</h2>
                            <p>http://localhost:3000/resetpassword/${reset_token}</p>
                           `
                sgMail.send(msg);
                res.json({message: 'Please check your email for your password reset link.'});
            }
        });
    } catch {
        res.status(500).json({error: 'Server error.'})
    }
});

/* 
    expects in req.body: resetToken, newPass
*/
router.patch('/reset', async (req, res) => {
    try {
        const {resetToken, newPass} = req.body;
        const hashedPassword = await bcrypt.hash(newPass, 10);
        if(resetToken) {
            await jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET);

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