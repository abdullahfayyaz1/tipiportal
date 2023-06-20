const express = require("express");
const router = express.Router();
const registerController = require("../controllers/userController/registerController");
const logInController = require("../controllers/userController/logInController");
const logoutController = require("../controllers/userController/logoutController");
const usersController = require("../controllers/userController/usersController");

router.post("/login", logInController.handleLogin);
router.post("/register", registerController.handleNewUser);
router.get("/logout", logoutController.handleLogout);

router.get("/users/:id", usersController.getUser);

module.exports = router;
