const prisma = require("../config/database");

const getDashboardStats = async () => {
  const [userCount, productCount, activeUserCount, activeProductCount, recentUsers, recentProducts] =
    await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.findMany({
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
      }),
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          sku: true,
          price: true,
          stock: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return {
    cards: {
      users: userCount,
      activeUsers: activeUserCount,
      products: productCount,
      activeProducts: activeProductCount,
    },
    recentUsers,
    recentProducts: recentProducts.map((product) => ({
      ...product,
      price: Number(product.price),
    })),
  };
};

module.exports = { getDashboardStats };
