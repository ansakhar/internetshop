const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const app = express()
var path = require("path")

//controllers:
const usersRouter = require('./controllers/users')
const productsRouter = require('./controllers/products')
const cartsRouter = require('./controllers/carts')

/*Serving static files from 'public'-directory:
login.js, login.css, verkkokauppa.js, verkkokauppa.css*/
app.use(express.static('public'))

// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())

app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/carts', cartsRouter)

// Connection to MongoDB database.
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("Database connected")
})

// initial page: login-register form
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + '/public/login.html'))
})

// shop-route - not in use
app.get('/shop', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/shop/verkkokauppa.html'))
  })

// shop-route by id
app.get('/shop/?userId=:id', async(request, response) => {
  response.sendFile(path.join(__dirname + '/public/shop/verkkokauppa.html'))
})

// app listen port
app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening`)
})