const prisma = require("../config/database");
const HttpError = require("../utils/httpError");
const { verifyAccessToken } = require("../utils/token");

const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "Authentication token is required.");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new HttpError(401, "Authenticated user is no longer active.");
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    };

    return next();
  } catch (error) {
    return next(error.statusCode ? error : new HttpError(401, "Invalid or expired authentication token."));
  }
};

module.exports = authenticate;
