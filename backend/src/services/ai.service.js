const prisma = require("../config/database");
const HttpError = require("../utils/httpError");

const normalizeQuestion = (question) => question.toLowerCase().trim();

const countUsersByRole = async (roleName) => {
  const total = await prisma.user.count({
    where: {
      role: {
        name: {
          equals: roleName,
        },
      },
    },
  });

  return {
    answer: `There are ${total} users with the ${roleName} role.`,
    data: {
      role: roleName,
      total,
    },
  };
};

const getRecentUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return {
    answer: users.length
      ? `The most recently registered users are ${users.map((user) => user.name).join(", ")}.`
      : "There are no registered users yet.",
    data: users,
  };
};

const getLowStockProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      stock: {
        lte: 10,
      },
    },
    select: {
      id: true,
      name: true,
      sku: true,
      stock: true,
    },
    orderBy: { stock: "asc" },
    take: 5,
  });

  return {
    answer: products.length
      ? `Low-stock products include ${products.map((product) => `${product.name} (${product.stock})`).join(", ")}.`
      : "There are no low-stock products at the moment.",
    data: products,
  };
};

const getOverview = async () => {
  const [users, products, activeUsers, activeProducts] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true } }),
  ]);

  return {
    answer: `The system currently has ${users} users, ${activeUsers} active users, ${products} products, and ${activeProducts} active products.`,
    data: {
      users,
      activeUsers,
      products,
      activeProducts,
    },
  };
};

const askDatabaseQuestion = async (question) => {
  if (!question) {
    throw new HttpError(422, "Question is required.");
  }

  const normalizedQuestion = normalizeQuestion(question);

  if (normalizedQuestion.includes("viewer")) {
    return countUsersByRole("Viewer");
  }

  if (normalizedQuestion.includes("editor")) {
    return countUsersByRole("Editor");
  }

  if (normalizedQuestion.includes("admin")) {
    return countUsersByRole("Admin");
  }

  if (normalizedQuestion.includes("recent") && normalizedQuestion.includes("user")) {
    return getRecentUsers();
  }

  if (normalizedQuestion.includes("low") && normalizedQuestion.includes("stock")) {
    return getLowStockProducts();
  }

  if (
    normalizedQuestion.includes("summary") ||
    normalizedQuestion.includes("overview") ||
    normalizedQuestion.includes("how many") ||
    normalizedQuestion.includes("total")
  ) {
    return getOverview();
  }

  return {
    answer:
      "I can answer questions about user role counts, recent users, low-stock products, and system totals. Try asking: How many users currently have the viewer role?",
    data: null,
  };
};

module.exports = { askDatabaseQuestion };
