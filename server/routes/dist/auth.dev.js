"use strict";

var express = require("express");

var router = express.Router();

var _require = require("../controllers/authController"),
    registerUser = _require.registerUser,
    loginUser = _require.loginUser,
    sendOtp = _require.sendOtp,
    resetPassword = _require.resetPassword; // Define routes


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPassword);
module.exports = router;