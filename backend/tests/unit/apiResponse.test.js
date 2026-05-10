const assert = require("node:assert/strict");
const test = require("node:test");
const { sendError, sendSuccess } = require("../../src/utils/apiResponse");

const createResponseMock = () => {
  const response = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  return response;
};

test("sendSuccess returns a consistent success payload", () => {
  const response = createResponseMock();

  sendSuccess(response, "Done", { id: 1 }, 201, { total: 1 });

  assert.equal(response.statusCode, 201);
  assert.deepEqual(response.body, {
    success: true,
    status: "success",
    message: "Done",
    data: { id: 1 },
    meta: { total: 1 },
  });
});

test("sendError returns a consistent error payload", () => {
  const response = createResponseMock();

  sendError(response, "Unauthorized", 401, { token: "Missing" });

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.body, {
    success: false,
    status: "error",
    message: "Unauthorized",
    errors: { token: "Missing" },
  });
});
