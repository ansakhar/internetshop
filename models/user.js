const uniqueValidator = require('mongoose-unique-validator')
const validator = require('validator')
const mongoose = require('mongoose')

// userScheema
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true , required: true,
      validate:{
        validator: validator.isEmail,
        isAsync: false
      }
  },
    password: { type: String, required: true, minlength: 6 }
  })
  
  userSchema.plugin(uniqueValidator)
  
// model User
module.exports = mongoose.model('User', userSchema, 'users')