const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
    key: {
        type: String,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Tokens', TokenSchema);