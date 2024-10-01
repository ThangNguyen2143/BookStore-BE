// import { join } from 'path'
const express = require('express')
const http = require('http')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require("cors");
const route = require('./routes')
const database = require('./models')


const app = express()
const port = 3001 || process.env.PORT

//Khai báo middleware
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

route(app)

app.set('port', port)
database.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log("Server running on port "+ port);
  });
  // http.createServer(app).listen(port)
});


