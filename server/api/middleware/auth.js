const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken')

/* Verifies with JWT that user logged in as admin, and retireves their info */
 function authenticateAdmin (req, res, next) {
    const token = req.headers['auth'];
    if(token === null) return res.status(401).send();

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user ) => {
        if(err) return res.status(403).send();
        req.user = user;
        if(!req.user.admin) return res.status(401).send();
        next();
    });
}

/* Verifies with JWT that user logged in, and retireves their info */
function authenticateUser (req, res, next) {
    const token = req.headers['auth'];
    if(token === null) return res.status(401).send();

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user ) => {
        if(err) return res.status(403).send();
        req.user = user;
        next();
    });
}; 

module.exports = { authenticateAdmin, authenticateUser };