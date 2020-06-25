const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const User = require('./Users.js');
const Org = require('./Orgs.js');


//Validate new admin acount data 
const employeeValidation = Joi.object ({
    email: Joi.string().email().required(),    
    password: Joi.string().min(6).required(),
    admin: Joi.bool(),
    org: Joi.string().required()
});


/* Post a new employee to db - for account creation*/
router.post('/create-account', async (req, res) => {
    try {//Data Validation
        const { error } = await employeeValidation.validateAsync(req.body);
    } catch (error){
        return res.status(400).send(error.details[0].message)
    }
    try { //Create account 
        const emailExists = await User.findOne( {"email": req.body.email }, {"email": 1}); 
        if(emailExists) { 
            res.status(400).send('A user with this email already exists.');
            return;
        }
        const org = await Org.findOne( {"name": req.body.org });
        const employee = await org.employees.find(e =>  e  === req.body.email );
        if(await employee === undefined) {
            res.status(401).send('You are not authorized to create an employee account with this organization');
            return;
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            admin: false,
            org: req.body.org
        })
        const savedUser = await user.save();
        res.json(savedUser);
    } catch(err){
        res.json({message: err});
    }
});


module.exports = router; 
