const productService = require("../services/product.service");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const listProducts = asyncHandler(async (req, res) => {
  const data = await productService.listProducts(req.query);

  return sendSuccess(res, "Products retrieved successfully.", data.products, 200, data.meta);
});

const getProductById = asyncHandler(async (req, res) => {
  const data = await productService.getProductById(req.params.id);

  return sendSuccess(res, "Product retrieved successfully.", data);
});

const createProduct = asyncHandler(async (req, res) => {
  const data = await productService.createProduct(req.body, req.user.id);

  return sendSuccess(res, "Product created successfully.", data, 201);
});

const updateProduct = asyncHandler(async (req, res) => {
  const data = await productService.updateProduct(req.params.id, req.body);

  return sendSuccess(res, "Product updated successfully.", data);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const data = await productService.deleteProduct(req.params.id);

  return sendSuccess(res, "Product deleted successfully.", data);
});

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
