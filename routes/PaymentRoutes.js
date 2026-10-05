const express = require("express");
const router = express.Router();
const authorizationToken = require("../middlewares/auth");
const paymentController = require("../controllers/paymentControllers");
console.log("Payment route hit");

router.get("/page", paymentController.getPaymentPage);
router.post("/pay", authorizationToken, paymentController.processPayment);
router.get("/payment-status/:orderId", paymentController.updatePaymentStatus);

module.exports = router;
