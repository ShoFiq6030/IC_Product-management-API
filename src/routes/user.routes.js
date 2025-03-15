const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { register, login } = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/user.middleware");

const router = require("express").Router();

// Register User
router.post("/register", register);

// Login User
router.post("/login", login);

module.exports = router;



