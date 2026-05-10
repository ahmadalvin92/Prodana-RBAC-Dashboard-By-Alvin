const express = require("express");
const authRoutes = require("./auth.routes");
const aiRoutes = require("./ai.routes");
const dashboardRoutes = require("./dashboard.routes");
const productRoutes = require("./product.routes");
const userRoutes = require("./user.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/ai", aiRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);

module.exports = router;
