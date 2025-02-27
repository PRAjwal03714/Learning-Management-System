const express = require("express");
const { register, login } = require("../controllers/authController");
const { check } = require("express-validator");

const router = express.Router();

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("role", "Role is required").isIn(["student", "instructor", "admin"])
  ],
  register
);

router.post("/login", login);

module.exports = router;
