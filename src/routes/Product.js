const express = require('express')
const router = express.Router()
const Product = require('../controllers/ProductController');

router.get('/get-products', Product.getProducts)
router.get('/:id', Product.getProduct)
// Add GET Filler product by product type

router.post('/update/:id', Product.updateProduct)
router.post('/delete/:id', Product.deleteProduct)
router.post('/create', Product.newProduct)


module.exports = router

