const app = require("./app");
const env = require("./config/env");
const prisma = require("./config/database");

const server = app.listen(env.port, () => {
  console.log(`RBAC Dashboard API listening on port ${env.port}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
