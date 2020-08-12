const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken')
const Token = require('../models/Tokens');





/* Verifies with JWT that user logged in as admin, and retireves their info */
 async function authenticateAdmin (req, res, next) {
    try {
        console.log(req.cookies)
        const token = await req.cookies.token;
        if(token === null) return res.status(401).json({error: 'No Token Provided'});

        const invalidToken = await Token.findOne( {"key": token} )
        if(invalidToken != null) return res.status(401).json({error: 'Invalid Token'});

        await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.status(403).json( {error: 'Invalid Token'} );
            req.user = user;
            if(!req.user.admin) return res.status(401).json({error: 'No admin access'});
            next();
        });
    } catch(err) {
        next(err);
    }
}

/* Verifies with JWT that user logged in, and retireves their info */
async function authenticateUser (req, res, next) {
    try {
        const token = req.cookies.token;
        if(token === null) return res.status(401).json({error: 'No Token Provided'});

        const invalidToken = await Token.findOne( {"key": token} )
        if(invalidToken != null) return res.status(401).json({error: 'Logged out token'});

        await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.status(403).json({error: 'Invalid Token'});
            req.user = user;
            next();
        });
    } catch(err) {
        next(err);
    }
}; 

module.exports = { authenticateAdmin, authenticateUser };