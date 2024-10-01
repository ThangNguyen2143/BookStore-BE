const express = require('express')
const router = express.Router()
const User = require('../controllers/UserController');
const { validateToken } = require('../middlewares/authormiddleware');

router.post('/register', User.register)
router.post('/login', User.login) 
router.get('/auth',validateToken, User.getUsers)

module.exports = router