const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const authMiddleware = require("../middleware/authMiddleware");
const roles = require("../enums/roles-enum");

router.post(
    "/register",
    authMiddleware([roles.ADMIN]),
    companyController.register
);
router.patch(
    "/:id",
    authMiddleware([roles.ADMIN, roles.MANAGER, roles.OWNER]),
    companyController.update
);

module.exports = router;
