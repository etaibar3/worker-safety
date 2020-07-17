const mongoose = require('mongoose');

const OrgSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    employees: {
        type: Array,
        default: []
    },

    admins: {
        type: Array,
        default: []
    },

    parentAccounts: {
        type: Array,
        default: []
    },
});

module.exports = mongoose.model('Orgs', OrgSchema);
