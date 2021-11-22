const mongoose = require('mongoose')

// cartScheema
const cartSchema = new mongoose.Schema({
    products : {type: Array},
    userId:  { type: String, unique: true , required: true}
  })
  
// model Cart
module.exports = mongoose.model('Cart', cartSchema, 'carts')