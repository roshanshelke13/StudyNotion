const express = require("express");
const router = express.Router();

const {capturePayment,verifyPayment,sendPaymentSuccessEmail} = require("../controllers/Payments");

const {auth,isInstructor,isStudent,isAdmin} = require("../middlewares/auth");

// console.log({ capturePayment, verifyPayment, sendPaymentSuccessEmail ,auth ,isStudent}); // will help debug undefined functions


router.post("/capturePayment",auth,isStudent,capturePayment);
router.post("/verifyPayment",auth,isStudent, verifyPayment);
router.post("/sendPaymentSuccessEmail",auth,isStudent, sendPaymentSuccessEmail);

module.exports = router;