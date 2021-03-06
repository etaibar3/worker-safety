const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Token = require('../models/Tokens.js');
const { authenticateUser } = require('../middleware/auth.js');


router.delete('/', authenticateUser, async (req, res) => {
    try {
        const token = req.cookies.token;
        const { exp } = await jwt.decode(token);

        const invalidateToken = new Token({
            key: token,
            expiresAt: exp * 1000
        })
        await invalidateToken.save();
        res.json({expiresAt: exp});

    } catch(err){
        res.status(500).json({error: err} );
    }

})

module.exports = router; 