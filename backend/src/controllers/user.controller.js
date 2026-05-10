const userService = require("../services/user.service");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const listRoles = asyncHandler(async (_req, res) => {
  const data = await userService.listRoles();

  return sendSuccess(res, "Roles retrieved successfully.", data);
});

const listUsers = asyncHandler(async (req, res) => {
  const data = await userService.listUsers(req.query);

  return sendSuccess(res, "Users retrieved successfully.", data.users, 200, data.meta);
});

const getUserById = asyncHandler(async (req, res) => {
  const data = await userService.getUserById(req.params.id);

  return sendSuccess(res, "User retrieved successfully.", data);
});

const createUser = asyncHandler(async (req, res) => {
  const data = await userService.createUser(req.body, req.user.role);

  return sendSuccess(res, "User created successfully.", data, 201);
});

const updateUser = asyncHandler(async (req, res) => {
  const data = await userService.updateUser(req.params.id, req.body, req.user.role);

  return sendSuccess(res, "User updated successfully.", data);
});

const deleteUser = asyncHandler(async (req, res) => {
  const data = await userService.deleteUser(req.params.id, req.user.id);

  return sendSuccess(res, "User deleted successfully.", data);
});

module.exports = {
  listRoles,
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
