const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../../src/utils/password");
const { ROLES } = require("../../src/utils/roles");

const prisma = new PrismaClient();

const roles = [ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER];

const users = [
  {
    name: "Admin User",
    email: "admin@prodana.test",
    password: "AdminPass123",
    roleName: ROLES.ADMIN,
  },
  {
    name: "Editor User",
    email: "editor@prodana.test",
    password: "EditorPass123",
    roleName: ROLES.EDITOR,
  },
  {
    name: "Viewer User",
    email: "viewer@prodana.test",
    password: "ViewerPass123",
    roleName: ROLES.VIEWER,
  },
];

const products = [
  {
    name: "Enterprise Analytics Suite",
    sku: "PRD-ANALYTICS-001",
    description: "A reporting suite for operational business insights.",
    price: 2499000,
    stock: 12,
  },
  {
    name: "Inventory Control Module",
    sku: "PRD-INVENTORY-002",
    description: "A module for tracking stock movements and product availability.",
    price: 1599000,
    stock: 24,
  },
  {
    name: "Customer Portal License",
    sku: "PRD-PORTAL-003",
    description: "A license package for secure customer self-service portals.",
    price: 3299000,
    stock: 8,
  },
];

const seed = async () => {
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  for (const user of users) {
    const role = await prisma.role.findUnique({
      where: { name: user.roleName },
    });

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        roleId: role.id,
        isActive: true,
      },
      create: {
        name: user.name,
        email: user.email,
        password: await hashPassword(user.password),
        roleId: role.id,
        isActive: true,
      },
    });
  }

  const admin = await prisma.user.findUnique({
    where: { email: "admin@prodana.test" },
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: product,
      create: {
        ...product,
        createdById: admin.id,
      },
    });
  }
};

seed()
  .then(async () => {
    console.log("Database seed completed successfully.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
