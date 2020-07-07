const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const Org = require('../models/Orgs.js');
const User = require('../models/Users.js');
const { authenticateAdmin } = require('../middleware/auth.js');

/* Validate request for adding a user to an organization*/
const userValidation = Joi.object ({
    email: Joi.string().email().required(),    
    admin: Joi.bool().required()
});


//Adds an admin to an organization so they can create an account
router.post('/manageRoster', authenticateAdmin, async (req, res) => {
    try {//Data Validation
        const { error } = await userValidation.validateAsync(req.body);
    } catch (error){ 
        return res.status(400).json({error: error.details[0].message});
    }
    try {
        const org = await Org.findOne( {"name": req.user.org });
        const alreadyAdmin = await org.admins.find(a => a === req.body.email);
        const alreadyEmployee = await org.employees.find(e => e === req.body.email);

        if(alreadyAdmin != undefined || alreadyEmployee != undefined) {
            res.status(400).json({error: 'This email has already been added to the organization.'});
            return;
        }
        if(await req.body.admin === true)  {
            await Org.updateOne({_id: org._id}, {$push: {admins: req.body.email}});
            res.json(org.admins);
        }
        else {
           await Org.updateOne({_id: org._id}, {$push: {employees: req.body.email}});
           res.json(org.employees);
        }
    } catch (err){
        res.status(400).json({message: "Failed to add user to org."});
    }
});

//Delete user form org list and User collection if account was created
router.delete('/manageRoster', authenticateAdmin, async (req, res) => {
    try{
        const org = await Org.findOne( {"name": req.user.org } );
        const anAdmin = await org.admins.find(a => a === req.body.email);
        const anEmployee = await org.employees.find(e => e === req.body.email);

        if(anAdmin != undefined) {
            await Org.updateOne({name: req.user.org}, {$pull: {admins: req.body.email}})
            res.send(anAdmin);
        } else if (anEmployee != undefined) {
            await Org.updateOne({name: req.user.org}, {$pull: {employees: req.body.email}});
            res.send(anEmployee);
        } else {
            res.status(400).json({error: 'User not found: could not delete.'});
            return
        }
        await User.deleteOne( {email: req.body.email } );
    
    } catch (err) {
        res.status(400).json({error: "Failed to remove user from org."});
    }
})

//Returns list of Users - entire roster
router.get('/manageRoster', authenticateAdmin, async (req, res) => {
    try {
        const org = await Org.findOne( {"name": req.user.org} );
        if(await org === null) {
            res.sendStatus(400);
            return;
        }
        res.json( {admins: org.admins, employees: org.employees} );
    } catch(err) {
        res.status(400).json({error: "Couldn't return roster."})
    }
});

/*For lookup of a single user */
router.get('/manageRoster/:email', authenticateAdmin, async (req, res) => {
    try {
        const org = await Org.findOne( {"name": req.user.org} );
        const anAdmin = await org.admins.find(a => a === req.params.email);
        const anEmployee = await org.employees.find(e => e === req.params.email);

        if(anAdmin != undefined) {
            res.send({email: anAdmin, admin: true});
        } else if (anEmployee != undefined) {
            res.send({email: anEmployee, admin: false});
        } else {
            res.status(400).json({error: 'User is not part of roster.'});
        }
    } catch(err) {
        res.status(500).json({error: "Could not retrieve user."})
    }
});

/* Update user access */
router.patch('/manageRoster', authenticateAdmin, async (req, res) => {
    try {
        const { error } = await userValidation.validateAsync(req.body);
    } catch (error){ 
        return res.status(400).send(error.details[0].message);
    }
    try {
        const org = await Org.findOne( {"name": req.user.org} );
        const anAdmin = await org.admins.find(a => a === req.body.email);
        const anEmployee = await org.employees.find(e => e === req.body.email);

        if(await anAdmin === undefined && anEmployee === undefined) {
            res.status(403).json({error: 'User does not exist.'});
            return;
        }
        await Org.updateOne({name: req.user.org}, {$pull: {employees: req.body.email}});
        await Org.updateOne({name: req.user.org}, {$pull: {admins: req.body.email}});
        
        if(req.body.admin === true || req.body.admin === "true")  {
            await Org.updateOne({name: req.user.org}, {$push: {admins: req.body.email}});
            await User.updateOne({email: req.body.email}, {$set: {admin: true}});
        }
        else {
            await Org.updateOne({name: req.user.org}, {$push: {employees: req.body.email}});
            await User.updateOne({email: req.body.email}, {$set: {admin: false}});
        }
        res.json(req.body);
    } catch (err) {
        res.status(400).json({error: "Couldn't update user."});
    }
});


module.exports = router; 