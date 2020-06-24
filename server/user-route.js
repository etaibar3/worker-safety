require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const User = require('./Users.js');


//Validate user email and password
const userValidation = Joi.object ({
    email: Joi.string().email().required(),    
    password: Joi.string().min(6).required(),
    admin: Joi.bool().required()
});

const loginValidation = Joi.object ({
    email: Joi.string().email().required(),    
    password: Joi.string().min(6).required()
});

/* Post a new user to db - for account creation*/
router.post('/', async (req, res) => {
    try {//Data Validation
        const { error } = await userValidation.validateAsync(req.body);
    } catch (error){
        return res.status(400).send(error.details[0].message)
    }
    try { //Create account
        const emailExists = await User.findOne( {"email": req.body.email }, {"email": 1}); 
        if(emailExists) { 
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
    try {//Data Validation
        const { error } = await loginValidation.validateAsync(req.body);
    } catch (error){
        return res.status(400).send(error.details[0].message)
    }
    try {
        const user = await User.findOne( {"email": req.body.email} );
        if(user === null) {
            res.status(404).send('There is no user with this email.');
            return;
        }
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass)  return res.status(403).send('User name and password do not match.');
        
        const token = jwt.sign( {_id: user._id }, process.env.ACCESS_TOKEN_SECRET);
        res.header('auth-toekn',token).send(token);

    } catch(err) {
        res.json({message: err});
    }
});

module.exports = router; 
