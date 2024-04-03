const express = require('express')
const router = express.Router()
const home = require('../controllers/HomeController');

router.post('/create/product-type', home.newType)
router.get('/', home.index) 



module.exports = router
