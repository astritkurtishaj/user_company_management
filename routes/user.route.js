const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roles = require("../enums/roles-enum");

router.get(
    "/all",
    authMiddleware([roles.ADMIN, roles.MANAGER, roles.OWNER]),
    userController.getAllUsers
);

router.patch(
    "/:id",
    authMiddleware([roles.OWNER, roles.ADMIN]),
    userController.update
);

router.delete(
    "/:id",
    authMiddleware([roles.OWNER, roles.ADMIN]),
    userController.deleteUser
);

module.exports = router;
