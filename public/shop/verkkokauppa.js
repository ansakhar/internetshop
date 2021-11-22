    const baseUrl = '';
    let total = 0;
    let userId = null;

//called when an HTML body onload event has occurred
function init() {
  let infoText = document.getElementById('infoText')
  infoText.innerHTML = 'Ladataan tavaralista palvelimelta, odota...'
  loadProducts()

  const path = window.location.origin+window.location.pathname
  console.log("path: ", path)
  const searchParams = new URLSearchParams(window.location.href);
  userId = searchParams.get(path+'?userId');
  console.log("userId: ", userId)

  if (userId != null) {
  loadCart(userId)
  }
}

function logout() {
  location.replace("/")
}

//creating a product object by editing the DOM on a web page
function createProductContainer(product) {
let productcontainer = document.createElement('div')
productcontainer.className = 'Product'

let button = document.createElement('button')
button.innerHTML = "Buy"
button.onclick = function() { buyProduct(product._id) }

let image = document.createElement('img')
image.src = product.image

let title = document.createElement('p')
title.className = 'Product-Title'
title.innerHTML = product.title

let price = document.createElement('p')
const formatter = new Intl.NumberFormat('fi-FI')
price.innerHTML = formatter.format(product.price) + " €"

let description = document.createElement('p')
description.innerHTML = product.description

let category = document.createElement('p')
category.className = 'Product-Category'
category.innerHTML = product.category

productcontainer.appendChild(button)
productcontainer.appendChild(image)
productcontainer.appendChild(title)
productcontainer.appendChild(price)
productcontainer.appendChild(description)
productcontainer.appendChild(category)

return productcontainer
}

//add product to the user's cart
async  function buyProduct(productId) {
  if (userId === null) location.replace("/")
  else {
  console.log("product to buy ", productId)
  let response = await fetch(`${baseUrl}/carts/`+userId)
  let cart = await response.json()
  let productInCart = false

  cart.products.forEach(cartPosition => {
    if (cartPosition.productId === productId) {
      productInCart = true
      cartPosition.quantity+= 1
      console.log("new quantity", cartPosition.quantity)
    }
      })

    if (!productInCart) {
      (cart.products).push({
        productId: productId, 
        quantity:  1
    })
    }
    //console.log("new cart's products", cart.products)

    const data = { 'products': cart.products }
    console.log("new data", data)
    const response2 = await fetch(`${baseUrl}/carts/`+cart._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      //to clear the previous output to the screen
      let cartdiv = document.getElementById("cart")
      cartdiv.innerHTML = ""; 
      let totaldiv = document.getElementById('total')
      totaldiv.innerHTML = "Total: 0.00 €"

      //cart-interface refreshing
      loadCart(cart.userId)
    }
}

//filter products by category
function filterByCategory(array) {
    let category = document.getElementById("filterCategory").value
    return array.filter(product => product.category === category)
}

//filter products by price
function filterByPrice(array) {
    let maxPrice = parseInt(document.getElementById("filterPrice").value)
    return array.filter(product => product.price <= maxPrice)
}

//downloading products information from the server
async function loadProducts() {
    let response = await fetch(`${baseUrl}/products`)
    let products = await response.json()
    //console.log(products)
     
    let filterCategory = document.getElementById("filterCategory")
    let filterPrice = document.getElementById("filterPrice")

    if(filterCategory.selectedIndex) {
        products = filterByCategory(products)
    }
    if(filterPrice.selectedIndex) {
        products = filterByPrice(products)
    }

    filterCategory.addEventListener("change", loadProducts)
    filterPrice.addEventListener("change", loadProducts)

    let productdiv = document.getElementById("products");
    productdiv.innerHTML = ""; //to clear the previous output to the screen

      products.forEach(product => {
        let productcontainer = createProductContainer(product)
        productdiv.appendChild(productcontainer)
      })

      infoText.innerHTML = ''
}

//creating a product object by editing the DOM on a web page
async function createProductOfCart(cartPosition, cart) {

let response = await fetch(`${baseUrl}/products/id/`+cartPosition.productId)
let product = await response.json()

let productOfCart = document.createElement('div')
let product_id = document.createAttribute('id')
product_id.value= cartPosition.productId
productOfCart.setAttributeNode(product_id)
productOfCart.className = 'ProductOfCart'

let button = document.createElement('button')
button.innerHTML = "x"
button.onclick = function() { removeProduct(cartPosition, cart) }

let image = document.createElement('img')
image.src = product.image

let title = document.createElement('p')
title.className = 'ProductOfCart-Title'
title.innerHTML = product.title

let quantity = document.createElement('div')
const formatter = new Intl.NumberFormat('fi-FI')
let price = formatter.format(product.price)
quantity.innerHTML = cartPosition.quantity + " pcs  by  " +
price + " €"

let summa = document.createElement('p')
summa.className = 'ProductOfCart-Summa'
let summaEuroa = cartPosition.quantity*product.price
summa.innerHTML = summaEuroa.toFixed(2) + " €"

productOfCart.appendChild(button)
productOfCart.appendChild(image)
productOfCart.appendChild(title)
productOfCart.appendChild(quantity)
productOfCart.appendChild(summa)

total = total + summaEuroa
let infoText = document.getElementById('total')
infoText.innerHTML = "Total: " + total.toFixed(2) + " €"

//console.log(productOfCart)
return productOfCart
}

//remove item from the cart
async  function  removeProduct(cartPosition, cart) {
    let newProducts = cart.products.filter(product => product.productId !== cartPosition.productId)

    const data = { 'products': newProducts }
    const response = await fetch(`${baseUrl}/carts/`+cart._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      //to clear the previous output to the screen
      let cartdiv = document.getElementById("cart")
      cartdiv.innerHTML = ""; 
      let totaldiv = document.getElementById('total')
      totaldiv.innerHTML = "Total: 0.00 €"

      //cart-interface refreshing
      loadCart(cart.userId)
}

//downloading shopping cart information from the server
async function loadCart(userId) {

let responseUser = await fetch(`${baseUrl}/users/id/`+userId)
let user = await responseUser.json()
let userNimi = user.email.slice(0, user.email.indexOf("@"))

let welcomediv = document.getElementById("welcome")
welcomediv.innerHTML = userNimi

    let response = await fetch(`${baseUrl}/carts/`+userId)
    let cart = await response.json()
    console.log("user's cart: ", cart)
    console.log("user's products:", cart.products)

    let cartdiv = document.getElementById("cart")
    total = 0
    let totaldiv = document.getElementById('total')
    totaldiv.innerHTML = "Total: 0.00 €"

    cart.products.forEach(async function(cartPosition) {
    let productOfCart = await createProductOfCart(cartPosition, cart)
    //console.log("productOfCart", productOfCart)
    cartdiv.appendChild(productOfCart)
      })
}