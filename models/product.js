const mongoose = require('mongoose')

// productScheema
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    category: String,
    image: String
  })
  
// model Product
module.exports = mongoose.model('Product', productSchema, 'products')