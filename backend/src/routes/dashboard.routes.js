const express = require("express");
const dashboardController = require("../controllers/dashboard.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");
const { ROLES } = require("../utils/roles");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizeRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER),
  dashboardController.getDashboardStats,
);

module.exports = router;
