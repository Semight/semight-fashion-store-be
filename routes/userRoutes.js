const express = require('express');
const router = express.Router();
const UserController = require("../controllers/user.controller");
const controller = new UserController();

router.post("/login", controller.signIn);
router.post("/register", controller.signUp);

module.exports = router;
