const prisma = require("../config/database");
const HttpError = require("../utils/httpError");
const { hashPassword } = require("../utils/password");
const { ROLES } = require("../utils/roles");

const userSelect = {
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
};

const getPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const getRoleByName = async (roleName) => {
  const role = await prisma.role.findUnique({
    where: { name: roleName || ROLES.VIEWER },
  });

  if (!role) {
    throw new HttpError(422, "Selected role is invalid.");
  }

  return role;
};

const listRoles = async () => {
  return prisma.role.findMany({
    orderBy: { id: "asc" },
  });
};

const listUsers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const search = query.search?.trim();
  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { role: { name: { contains: search } } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: userSelect,
  });

  if (!user) {
    throw new HttpError(404, "User was not found.");
  }

  return user;
};

const ensureWritableRole = (selectedRole, actorRole) => {
  if (selectedRole === ROLES.ADMIN && actorRole !== ROLES.ADMIN) {
    throw new HttpError(403, "Only administrators can assign the Admin role.");
  }
};

const createUser = async (payload, actorRole) => {
  const { name, email, password, roleName, isActive = true } = payload;

  if (!name || !email || !password) {
    throw new HttpError(422, "Name, email, and password are required.");
  }

  if (password.length < 8) {
    throw new HttpError(422, "Password must contain at least 8 characters.");
  }

  ensureWritableRole(roleName || ROLES.VIEWER, actorRole);
  const role = await getRoleByName(roleName);

  return prisma.user.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: await hashPassword(password),
      roleId: role.id,
      isActive: Boolean(isActive),
    },
    select: userSelect,
  });
};

const updateUser = async (id, payload, actorRole) => {
  await getUserById(id);

  const data = {};

  if (payload.name !== undefined) {
    data.name = payload.name.trim();
  }

  if (payload.email !== undefined) {
    data.email = payload.email.toLowerCase().trim();
  }

  if (payload.password) {
    if (payload.password.length < 8) {
      throw new HttpError(422, "Password must contain at least 8 characters.");
    }

    data.password = await hashPassword(payload.password);
  }

  if (payload.isActive !== undefined) {
    data.isActive = Boolean(payload.isActive);
  }

  if (payload.roleName) {
    ensureWritableRole(payload.roleName, actorRole);
    const role = await getRoleByName(payload.roleName);
    data.roleId = role.id;
  }

  return prisma.user.update({
    where: { id: Number(id) },
    data,
    select: userSelect,
  });
};

const deleteUser = async (id, actorId) => {
  if (Number(id) === actorId) {
    throw new HttpError(422, "You cannot delete your own account.");
  }

  await getUserById(id);

  return prisma.user.delete({
    where: { id: Number(id) },
    select: userSelect,
  });
};

module.exports = {
  listRoles,
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
