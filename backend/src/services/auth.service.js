const prisma = require("../config/database");
const HttpError = require("../utils/httpError");
const { comparePassword } = require("../utils/password");
const { signAccessToken } = require("../utils/token");

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  isActive: user.isActive,
  role: user.role,
});

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new HttpError(422, "Email and password are required.");
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: {
      role: true,
    },
  });

  if (!user || !user.isActive) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const token = signAccessToken({
    id: user.id,
    role: user.role.name,
  });

  return {
    token,
    user: sanitizeUser(user),
  };
};

const getAuthenticatedUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user) {
    throw new HttpError(404, "User was not found.");
  }

  return user;
};

module.exports = { login, getAuthenticatedUser };
