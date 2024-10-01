const express = require('express')
const router = express.Router()
const Order = require('../controllers/OrderController');
const { validateToken } = require('../middlewares/authormiddleware');


router.get('/',validateToken, Order.getOrder)
router.post('/add-cart',validateToken, Order.addtoCart)

module.exports = router