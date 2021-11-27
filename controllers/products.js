const productsRouter = require('express').Router()
const Product = require('../models/product')

// products-route
productsRouter.get('/', async (request, response) => {
    const products = await Product.find({})
      response.json(products)
  })
  
// products/:category -route - not in use
productsRouter.get('/:category', async (request, response) => {
  const products = await Product.find({category:request.params.category})
  response.json(products)
  })
  
// products/id/:id-route
productsRouter.get('/id/:id', async (request, response) => {
  const product = await Product.findById(request.params.id)
    if (product) response.json(product)
    else response.status(404).end()
  })

//adding a new product - not in use
productsRouter.post('/', async (request, response) => {
  //const body = request.body
  const product = new Product({
    title: request.body.title,
    price: request.body.price,
    description: request.body.description,
    category: request.body.category,
    image: request.body.image
  })
  const savedProduct = await product.save()
  response.json(savedProduct)  
})

module.exports = productsRouter