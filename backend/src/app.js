const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const apiRoutes = require("./routes");
const { sendSuccess } = require("./utils/apiResponse");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  return sendSuccess(res, "RBAC Dashboard API is running.", {
    environment: env.nodeEnv,
  });
});

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
