const express = require("express");
const userController = require("../controllers/user.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");
const { ROLES } = require("../utils/roles");

const router = express.Router();

router.use(authenticate);

router.get("/roles", authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), userController.listRoles);
router.get("/", authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), userController.listUsers);
router.get("/:id", authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER), userController.getUserById);
router.post("/", authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), userController.createUser);
router.put("/:id", authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), userController.updateUser);
router.delete("/:id", authorizeRoles(ROLES.ADMIN, ROLES.EDITOR), userController.deleteUser);

module.exports = router;
