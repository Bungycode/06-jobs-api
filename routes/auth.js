const express = require("express");
const router = express();

const { register, login } = require("../controllers/auth");

// domain/api/v1/auth/register
router.route("/register").post(register);
// domain/api/v1/auth/login
router.route("/login").post(login);

module.exports = router;
