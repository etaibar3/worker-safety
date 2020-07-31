/* Worker Safter server/Users.js
 * Holds model for User schema in db
 */

const mongo4j = require("mongo4j");
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },

  firstName: {
    type: String,
    required: true
  },

  lastName: {
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
    require: true
  },
                                   
  resetLink: {
        data: String,
        default: ''
    }
});

UserSchema.plugin(mongo4j.plugin());
module.exports = mongoose.model("Users", UserSchema);
