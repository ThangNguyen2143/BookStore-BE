const express = require('express')
const router = express.Router()
const PaymentController = require('../controllers/PaymentController')

router.get("/vnpay_return",PaymentController.paymentResponse );
router.get("/vnpay_ipn", PaymentController.fastPayment);
router.post("/create_payment_url", PaymentController.create_payment_url) 
router.post("/querydr", PaymentController.querydr);
router.post("/refund", PaymentController.refund);

module.exports = router;