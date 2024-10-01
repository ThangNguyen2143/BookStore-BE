const Home = require('./Home.js')
const Product = require('./Product.js')
const User = require('./User.js')
const Payment = require('./Payment.js')
const Cart = require('./Cart.js')
const Order = require('./Order.js')
function route(app){
       app.use('/',Home)
       app.use('/api/products',Product)
       app.use('/api/users',User)
       app.use('/api/payment',Payment)
       app.use('/api/cart',Cart)
       app.use('/api/orders',Order)
}

module.exports = route;
