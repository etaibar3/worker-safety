const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const User = require('../models/Users.js');
const Org = require('../models/Orgs.js');
const { authenticateUser } = require('../middleware/auth.js');

//Validate new employee acount data 
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
        return res.status(400).json({error: error.details[0].message});
    }
    try { //Create account 
        const emailExists = await User.findOne( {"email": req.body.email }, {"email": 1}); 
        if(emailExists) { 
            res.status(400).send({error: 'A user with the email ' + req.body.email + ' already exists'});
            return;
        }
        const org = await Org.findOne( {"name": req.body.org });
        if(await org === null) {
            res.status(400).json({error: 'There is no organization by the name ' + req.body.org});
            return;
        }
        const employee = await org.employees.find(e =>  e  === req.body.email );
        if(await employee === undefined) {
            res.status(401).json({error: 'You are not authorized to create an employee account with the organization ' + 
                    req.body.org});
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
        res.status(500).json({error: err});
    }
});

router.get('/companyrep', authenticateUser, async (req, res) => {
    try {
        const org = await Org.findOne({name: req.user.org})
        if(await org === null) {
            res.status(400).json({error: 'Org not found'});
            return;
        }
        /* parentAccounts stores an array of pairs of a user and their rep*/
        const pair = org.parentAccounts.find(p => p.user === req.user.email);
        if(pair === undefined) {
            res.status(400).json({error: 'Unable to find ' + req.user.email + '`s company rep'});
            return;
        }
        res.json({rep: pair.rep});
    } catch(err) {
        res.status(500).json({error: err})
    }
});

module.exports = router; 
