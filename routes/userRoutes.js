const express = require('express');
const router = express.Router();
const UserController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const controller = new UserController();

router.post("/login", controller.signIn);
router.post("/register", controller.signUp);
router.get("/users", authMiddleware, controller.getAllUsers); // Get all users
router.get("/users/:id", authMiddleware, controller.getUserById); // Get user by ID
router.get("/profile", authMiddleware, controller.getProfile);
router.put("/profile", authMiddleware, controller.updateProfile);
router.delete("/users/byId/:id", authMiddleware, controller.deleteUser);

module.exports = router;
