const express = require('express');
const router = express.Router();
const UserController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const controller = new UserController();

router.post("/login", controller.signIn);
router.post("/register", controller.signUp);
router.get("/profile", authMiddleware, controller.getProfile);
router.put("/profile", authMiddleware, controller.updateProfile);

module.exports = router;
