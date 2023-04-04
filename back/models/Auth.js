const mongoose = require('mongoose');
require('mongoose-type-email');
const uniqueValidator = require('mongoose-unique-validator');
const  tlds  = require ('tld-list') ;
mongoose.SchemaTypes.Email.defaults.message = 'Email address is invalid'

const userSchema = mongoose.Schema({
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true,
    unique: true,
    correctTld : true,
    tlds,
  },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
