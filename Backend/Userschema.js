const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name:{
    type:String,
    required:true
  },
  mailid:{
    type:String,
    required:true
  },
  mobileno:{
    type:Number,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  Date:{
    type:String,
    required:true
    default:
  }
});

const User = model('users', userSchema);
module.exports = mongoose.models.users || User