require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const User = require("../models/Users.js");

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

function generateToken(user) {
  /* TODO: 2nd argument of the follwing line should produce a token. Must be a hex value as a string */
    return jwt.sign(user , process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'});
}

/*Post request to authenticate user */
router.post('/', async (req, res) => {
    try {//Data Validation
        const { error } = await loginValidation.validateAsync(req.body);
    } catch (error){ 
        return res.status(400).json( {error: error.details[0].message} )
        console.log(error)
    }
    try {
        const user = await User.findOne( {"email": req.body.email} );
        if(user === null) {
            res.status(404).json({error: 'User name and password do not match'});
            return;
        }
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if(!validPass)  return res.status(403).json({error: 'User name and password do not match'});
        const serialize = {email: user.email, admin: user.admin, _id: user._id, org: user.org}
        const token = generateToken(serialize);
        /* Cookies won't work rn, since clinet and server are on different domains */
        res.set('Access-Control-Allow-Origin', req.headers.origin)
        res.set('Access-Control-Allow-Credentials', 'true')
        //res.set('Access-Control-Expose-Headers', 'set-cookie, date, etag')
        res.cookie('token', token, {
            maxAge: 60 * 30 * 1000,
            httpOnly: true,
            secure: true,  /* Uncomment when we add https */
            path: '/',
            sameSite: 'None',
            withCredentials: true
        });
        res.send({ message: "User is logged in.", isAdmin: user.admin });
    } catch(err) {
        console.log(err)
        res.status(500).json({error: err});
    }

});

module.exports = router;
