const Home = require('./Home.js')
const Product = require('./Product.js')
const User = require('./User.js')
function route(app){
       app.use('/',Home)
       app.use('/api/products',Product)
       app.use('/api/users',User)
}

module.exports = route;
