const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const Org = require('../models/Orgs.js');

/* All these will need to be restricted to just admin user */

router.post('/admins', async (req, res) => {
    try {
        const org = await Org.findOne( {"name": req.body.org });
        const alreadyAdded = org.admins.find(a => a === req.body.new_admin);
        if(alreadyAdded != undefined) {
            res.status(400).send('This email has already been added as an admin for the organization.');
            return;
        }
        await Org.updateOne({_id: org._id}, {$push: {admins: req.body.new_admin}});
        res.json(org.admins);
    } catch (err){
        res.json({message: "Failed to add admin to org"});
    }
});

router.post('/employees', async (req, res) => { 
    try {
        const org = await Org.findOne( {"name": req.body.org });
        const alreadyAdded = org.employees.find(a => a === req.body.employee);
        if(alreadyAdded != undefined) {
            res.status(400).send('This email has already been added as an employee for the organization.');
            return;
        }
        await Org.updateOne({_id: org._id}, {$push: {employees: req.body.employee}});
        res.json(org.employees);
    } catch (err){
        res.json({message: "Failed to add employee to org"});
    }
});

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