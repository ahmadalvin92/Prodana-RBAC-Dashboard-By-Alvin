const express = require("express");
const productController = require("../controllers/product.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/authorize.middleware");
const { ROLES } = require("../utils/roles");

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles(ROLES.ADMIN));

router.get("/", productController.listProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
