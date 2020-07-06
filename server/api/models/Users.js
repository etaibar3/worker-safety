/* Worker Safter server/Users.js
 * Holds model for User schema in db
 */


const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },

  password: {
    type: String,
    require: true,
  },

  admin: {
    type: Boolean,
    default: true,
    require: true,
  },
  
  org: {
    type: String,
    require: true
  }
  
});

module.exports = mongoose.model("Users", UserSchema);
