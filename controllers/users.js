const usersRouter = require('express').Router()
const User = require('../models/user')

// get-request /users -route - not in use
usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
      response.json(users)
  })
  
// get-request /users/:email -route
usersRouter.get('/:email', async (request, response) => {
  const user = await User.findOne({email:request.params.email})
    if (user) response.json(user)
    else response.status(404).end()
})

// users/id/:id -route
usersRouter.get('/id/:id', async (request, response) => {
    const user = await User.findById(request.params.id)
      if (user) response.json(user)
      else response.status(404).end()
    })

// delete all users - not in use
usersRouter.delete('/', async (request, response) => {
  const info = await User.deleteMany({})
    if (info) response.json(info)
    else response.status(404).end()
})
  
//new user registering
usersRouter.post('/', async (request, response) => {
    try {
      console.log(request.body)
    const user = new User({
      email: request.body.email,
      password: request.body.password
    })
  
    const savedUser = await user.save()
    response.json(savedUser)
  }
  catch (error) {
    if (error.name === 'ValidationError') {
      console.log("error name:", error.name)
      console.log(error.message)
      return response.status(400).json({ error: error.message })
       }
       else console.log(error.message)
      }
  })

module.exports = usersRouter