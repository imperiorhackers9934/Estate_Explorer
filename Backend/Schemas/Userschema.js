const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mailid: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  mobileno: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
    default: Date.now, // Sets the default value to the current date
  },
});

const User = model('users', userSchema);
module.exports = mongoose.models.users || User;
