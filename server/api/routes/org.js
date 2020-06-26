const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const Org = require('../models/Orgs.js');

/* All these will need to be restricted to just admin user */

const userValidation = Joi.object ({
    email: Joi.string().email().required(),    
    admin: Joi.bool().required(),
    org: Joi.string().required()
});

//Adds an admin to an organization so they can create an account
router.post('/manageRoster', async (req, res) => {
    try {//Data Validation
        const { error } = await userValidation.validateAsync(req.body);
    } catch (error){ 
        return res.status(400).send(error.details[0].message);
    }
    try {
        const org = await Org.findOne( {"name": req.body.org });

        const alreadyAdmin = await org.admins.find(a => a === req.body.email);
        const alreadyEmployee = await org.employees.find(e => e === req.body.email);

        if(alreadyAdmin != undefined || alreadyEmployee != undefined) {
            res.status(400).send('This email has already been added to the organization.');
            return;
        }
        if(await req.body.admin === "true")  {
            await Org.updateOne({_id: org._id}, {$push: {admins: req.body.email}});
            res.json(org.admins);
        }
         else {
           await Org.updateOne({_id: org._id}, {$push: {employees: req.body.email}});
           res.json(org.employees);
        }
    } catch (err){
        res.status(400).json({message: "Failed to add user to org"});
    }
});

router.delete('/manageRoster', async (req, res) => {
    try{
        const org = await Org.findOne( {"name": req.body.org });
        const anAdmin = await org.admins.find(a => a === req.body.email);
        const anEmployee = await org.employees.find(e => e === req.body.email);
        if(anAdmin != undefined) {
            await Org.updateOne({name: req.body.org}, {$pull: {admins: req.body.email}})
            res.send(anAdmin);
        } else if (anEmployee != undefined) {
            await Org.updateOne({name: req.body.org}, {$pull: {employees: req.body.email}});
            res.send(anEmployee);
        } else {
            res.status(400).send('User not found: could not delete.');
            return
        }
        
    } catch (err) {
        res.status(400).json({message: "Failed to remove user from org"});
    }
})

//Returns list of admins
router.get('/admins/:org', async (req, res) => {
    try {
        const org = await Org.findOne( {"name": req.params.org} );
        if(await org === null) {
            res.status(400).send('There is no organization by this name.');
            return;
        }
        res.json(org.admins);
    } catch(err) {
        res.json({message: ""})
    }
});

//Returns list of employees
router.get('/employees/:org', async (req, res) => {
    try {
        const org = await Org.findOne( {"name": req.params.org} );
        if(await org === null) {
            res.status(400).send('There is no organization by this name.');
            return;
        }
        res.json(org.employees);
    } catch(err) {
        res.json({message: ""})
    }
});
module.exports = router; 