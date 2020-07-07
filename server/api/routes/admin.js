const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const User = require('../models/Users.js');
const Org = require('../models/Orgs.js');


//Validate new admin acount data 
const adminValidation = Joi.object ({
    email: Joi.string().email().required(),    
    password: Joi.string().min(6).required(),
    admin: Joi.bool(),
    org: Joi.string().required()
});


/* Returns admins organization - or creates a new one */
async function getOrg (req, res) { 
    try {
        let org = await Org.findOne( {"name": req.body.org });
        if(org === null) {
            org = new Org({
                name: req.body.org,
                admins: [req.body.email],
                employees: []
            })
            await org.save();
        }
        return org;
    } catch (err) {
        res.json({error: "Failed to get org."});
    }
}

/* Post a new admin to db - for account creation*/
router.post('/create-account', async (req, res) => {
    try {//Data Validation
        const { error } = await adminValidation.validateAsync(req.body);
    } catch (error){
        return res.status(400).json({error: error.details[0].message});
    }
    try { //Create account
        const emailExists = await User.findOne( {"email": req.body.email }, {"email": 1}); 
        if(emailExists) { 
            res.status(400).json({error: 'A user with this email already exists.'});
            return;
        }
        const org = await getOrg(req, res);
        const admin = await org.admins.find(a =>  a === req.body.email );
        if(await admin === undefined) {
            res.status(401).json({error: 'You are not authorized to create an admin account with this organization'});
            return;
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            admin: true,
            org: req.body.org
        })
        const savedUser = await user.save();
        res.json(savedUser);
    } catch(err){ 
        res.status(500).json({error: "Failed to create account."});
    }
});

module.exports = router; 