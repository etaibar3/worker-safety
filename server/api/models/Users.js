/* Worker Safter server/Users.js
 * Holds model for User schema in db
 */

const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email: { 
        type: String,
        required: true
    },

    password: {
        type: String,
        require: true
    }, 

    admin: {
        type: Boolean,
        default: true,
        require: true
    },
    
    org: {
        type: String,
        require: ture
    }

});

module.exports = mongoose.model('Users', UserSchema);
