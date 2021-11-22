//const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const app = express()
var path = require("path")

/*Serving static files from 'public'-directory:
login.js, login.css, verkkokauppa.js, verkkokauppa.css*/
app.use(express.static('public'))

const usersRouter = require('./controllers/users')
const productsRouter = require('./controllers/products')
const cartsRouter = require('./controllers/carts')

// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())

//?
app.use(express.urlencoded({extended: true}))

app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/carts', cartsRouter)

// Connection to MongoDB database.
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://fullstackas:143080Mongo@cluster0.mrl4q.mongodb.net/verkkokauppa', {useNewUrlParser: true, useUnifiedTopology: true})
//mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("Database connected")
  console.log("test")
})

// initial page: login-register form
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + '/login.html'))
})

// shop-route
app.get('/shop', (request, response) => {
    response.sendFile(path.join(__dirname + '/verkkokauppa.html'))
  })

// shop-route by id
app.get('/shop/?userId=:id', async(request, response) => {
  response.sendFile(path.join(__dirname + '/verkkokauppa.html'))
})

// app listen port
app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening`)
})