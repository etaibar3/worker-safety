const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');
const Org = require('../models/Orgs.js');
const User = require('../models/Users.js');
const { authenticateAdmin } = require('../middleware/auth.js');
require('dotenv').config()

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function generateEmail(email, isAdmin, org) {
    let msg = {
        to: email,
        from: 'benjamin.bodine@tufts.edu',
        subject: 'Safe Return Account Creation',
        html: ''
    };
    if(isAdmin) {
        msg.html = `
                 <h2>You have been invited to join the organization ${org} on Safe Return.</h2>
                 <p>Please follow the link below to create your admin account.</p>
                 <p>http://localhost:3000/create-root-account</p>
                `
    } else {
        msg.html = `
                 <h2>You have been invited to join the organization ${org} on Safe Return.</h2>
                 <p>Please follow the link below to create your employee account.</p>
                 <p>http://localhost:3000/create-child-account</p>
                 `
    }
    return msg;
}

/* Validate request for adding a user to an organization*/
const userValidation = Joi.object ({
    email: Joi.string().email().required(),    
    admin: Joi.bool().required()
});


//Adds a user to organization so they can create an account
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
            res.status(400).json({error: 'This email has already been added to the organization'});
            return;
        }
        //console.log(process.env.SENDGRID_API_KEY)
        if(await req.body.admin === true || req.body.admin === "true")  {
            await Org.updateOne({_id: org._id}, {$push: {admins: req.body.email}});
            const msg = generateEmail(req.body.email, true, req.user.org);
            sgMail.send(msg);
            res.json(org.admins);
        }
        else {
           await Org.updateOne({_id: org._id}, {$push: {employees: req.body.email}});
           await Org.updateOne({_id: org._id}, 
            {$push: {parentAccounts: {user: req.body.email, rep: req.user.email}}});
           const msg = generateEmail(req.body.email, false, req.user.org);
           sgMail.send(msg);
           res.json(org.employees);
        }
    } catch (err){
        res.status(400).json({error: "Unable to add user to org"});
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
            await Org.updateOne({name: req.user.org}, {$pull: {parentAccounts: {user: req.body.email}}})
            res.send(anEmployee);
        } else {
            res.status(400).json({error: 'User is not part of roster: unable to delete'});
            return
        }
        await User.deleteOne( {email: req.body.email } );
    
    } catch (err) {
        res.status(400).json({error: "Unable to remove user from org."});
    }
})

//Returns list of Users - entire roster
router.get('/manageRoster', authenticateAdmin, async (req, res) => {
    try {
        const org = await Org.findOne( {"name": req.user.org} );
        if(org === null) {
            res.status(400).json({error: 'Org not found'});
            return;
        }
        const adminNames = await Promise.all(org.admins.map(async (a) => {
           const user = await User.findOne({email: a});
           if(user === null) {
               return "";
           }
           else {
               return user.firstName + " " + user.lastName;
           }
        }));
        const employeeNames = await Promise.all(org.employees.map(async (e) => {
            const user =  await User.findOne({email: e});
            if(user === null) {
                return "";
            }
            else {
                return user.firstName + " " + user.lastName;
            }
         }));
        res.json( {admins: org.admins, aNames: adminNames, 
                    eNames: employeeNames, employees: org.employees} );
    } catch(err) {
        res.status(400).json({error: "Unable to retrieve roster"})
    }
});

/*For lookup of a single user */
router.get('/manageRoster/:email', authenticateAdmin, async (req, res) => {
    try {
        var fullName;
        const org = await Org.findOne( {"name": req.user.org} );
        const anAdmin = await org.admins.find(a => a === req.params.email);
        const anEmployee = await org.employees.find(e => e === req.params.email);
        
        if(anAdmin != undefined) {
            const user = await User.findOne( {email: anAdmin} )
            if (user === null) {
                fullName = ""
            } else {
                fullName = user.firstName + " " + user.lastName;
            }
            res.send( {email: anAdmin, admin: true, name: fullName} );
        } else if (anEmployee != undefined) {
            const user = await User.findOne( {email: anEmployee} )
            if (user === null) {
                fullName = ""
            } else {
                fullName = user.firstName + " " + user.lastName;
            }
            res.send( {email: anEmployee, admin: false, name: fullName} );
        } else {
            res.status(400).json({error: 'User is not part of roster'});
        }
    } catch(err) {
        res.status(500).json({error: "Unable to retrieve user"})
    }
});

/* Update user access */
router.patch('/manageRoster', authenticateAdmin, async (req, res) => {
    try {
        const { error } = await userValidation.validateAsync(req.body);
    } catch (error){ 
        return res.status(400).json({error: error.details[0].message});
    }
    try {
        const org = await Org.findOne( {"name": req.user.org} );
        const anAdmin = await org.admins.find(a => a === req.body.email);
        const anEmployee = await org.employees.find(e => e === req.body.email);

        if(await anAdmin === undefined && anEmployee === undefined) {
            res.status(403).json({error: 'User is not part of roster: unable to update status'});
            return;
        }
        await Org.updateOne({name: req.user.org}, {$pull: {employees: req.body.email}});
        await Org.updateOne({name: req.user.org}, {$pull: {admins: req.body.email}});
        await Org.updateOne({name: req.user.org}, {$pull: {parentAccounts: {user: req.body.email}}})

        if(req.body.admin === true || req.body.admin === "true")  {
            await Org.updateOne({name: req.user.org}, {$push: {admins: req.body.email}});
            await User.updateOne({email: req.body.email}, {$set: {admin: true}});
        }
        else {
            await Org.updateOne({name: req.user.org}, {$push: {employees: req.body.email}});
            await User.updateOne({email: req.body.email}, {$set: {admin: false}});
            await Org.updateOne({_id: org._id}, 
                {$push: {parentAccounts: {user: req.body.email, rep: req.user.email}}});
        }
        res.json(req.body);
    } catch (err) {
        res.status(400).json({error: "Unable to update user"});
    }
});


module.exports = router; 
