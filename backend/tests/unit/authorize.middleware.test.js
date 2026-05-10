const assert = require("node:assert/strict");
const test = require("node:test");
const authorizeRoles = require("../../src/middlewares/authorize.middleware");
const { ROLES } = require("../../src/utils/roles");

test("authorizeRoles allows users with an accepted role", () => {
  const middleware = authorizeRoles(ROLES.ADMIN, ROLES.EDITOR);
  const req = {
    user: {
      id: 1,
      role: ROLES.ADMIN,
    },
  };

  let nextError = null;
  middleware(req, {}, (error) => {
    nextError = error;
  });

  assert.equal(nextError, undefined);
});

test("authorizeRoles rejects authenticated users without permission", () => {
  const middleware = authorizeRoles(ROLES.ADMIN);
  const req = {
    user: {
      id: 2,
      role: ROLES.VIEWER,
    },
  };

  let nextError = null;
  middleware(req, {}, (error) => {
    nextError = error;
  });

  assert.equal(nextError.statusCode, 403);
  assert.equal(nextError.message, "You do not have permission to access this resource.");
});

test("authorizeRoles rejects requests without an authenticated user", () => {
  const middleware = authorizeRoles(ROLES.ADMIN);

  let nextError = null;
  middleware({}, {}, (error) => {
    nextError = error;
  });

  assert.equal(nextError.statusCode, 401);
  assert.equal(nextError.message, "Authentication is required.");
});
