const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const Token = require('../models/Tokens.js');
const { authenticateUser } = require('../middleware/auth.js');


router.delete('/', authenticateUser, async (req, res) => {
    try {
        const token = await req.headers['auth'];
        const { exp } = await jwt.decode(token);

        const invalidateToken = new Token({
            key: token,
            expiresAt: exp * 1000
        })
        await invalidateToken.save();
        res.json({expiresAt: exp});

    } catch(err){
        res.status(500).json({message: err} );
    }

})

module.exports = router; 