const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roles = require("../enums/roles-enum");

router.post(
    "/register",
    authMiddleware([roles.ADMIN, roles.OWNER]),
    authController.register
);

router.post("/login", authController.login);

module.exports = router;
