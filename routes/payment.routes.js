const express = require("express");
const paymentController = require('../Controllers/payment.controller');



const router = express.Router();

router.post("/create-order", paymentController.createOrder);

router.get("/capture-order", paymentController.captureOrder);

router.get("/cancel-payment", paymentController.cancelPayment);

router.get("/manager-order", paymentController.managerOrder);


//Qr
router.post("/qrcreate-order", paymentController.QRcreateOrder);

router.post("/get-exchange_rates/", paymentController.GetExchangeReate);

module.exports = router;