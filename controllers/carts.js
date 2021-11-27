const cartsRouter = require('express').Router()
const Cart = require('../models/cart')

// carts-route - not in use
cartsRouter.get('/', async (request, response) => {
    const carts = await Cart.find({})
    response.json(carts)
  })
  
// cart-route by userId
cartsRouter.get('/:userId', async (request, response) => {
    const cart = await Cart.findOne({userId:request.params.userId})
    if (cart) response.json(cart)
    else response.status(404).end()
  })

// delete all carts - not in use
cartsRouter.delete('/', async (request, response) => {
  const info = await Cart.deleteMany({})
    if (info) response.json(info)
    else response.status(404).end()
})

// editing the contents of the cart
cartsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
  
    const cart = {
      products: body.products
    }
    try {
      const updatedCart = await Cart.findByIdAndUpdate(request.params.id, cart, { new: true })
      if (updatedCart) response.json(updatedCart)
      else response.status(404).end()
    } catch(error) {
      next(error)
    }
  })

//adding a new cart for new user
cartsRouter.post('/', async (request, response) => {
    const cart = new Cart({
      products: [],
      userId: request.body.userId
    })
    const savedCart = await cart.save()
    response.json(savedCart)  
  })

module.exports = cartsRouter