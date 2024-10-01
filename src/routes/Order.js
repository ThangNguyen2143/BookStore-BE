const express = require('express')
const router = express.Router()
const Order = require('../controllers/OrderController');
const { validateToken } = require('../middlewares/authormiddleware');

router.get('/',validateToken, Order.getOrders)

module.exports = router