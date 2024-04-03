// import { join } from 'path'
const express = require('express')
const http = require('http')
const morgan = require('morgan')
const route = require('./routes')
const database = require('./models')



const app = express()
const port = 3001 || process.env.PORT

//Khai báo middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(morgan('dev'))


route(app)

app.set('port', port)
database.sequelize.sync().then(() => {
  http.createServer(app).listen(port)
});


