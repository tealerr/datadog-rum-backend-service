import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import app from "../src/app.js";

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("GET /health returns service health", async () => {
  const response = await fetch(`${baseUrl}/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  assert.equal(body.service, "synthetic-mock-api");
  assert.match(body.timestamp, /^\d{4}-\d{2}-\d{2}T/);
});

test("GET /status rejects informational status codes", async () => {
  for (const code of [198, 199]) {
    const response = await fetch(`${baseUrl}/status/${code}`);
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.error, "invalid_status_code");
    assert.equal(body.message, "Status code must be an integer between 200 and 599");
  }
});

test("POST /auth/token rejects invalid credentials", async () => {
  const response = await fetch(`${baseUrl}/auth/token`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: "wrong", password: "wrong" }),
  });

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "invalid_credentials" });
});

test("GET /protected requires and accepts an API key", async () => {
  const unauthorized = await fetch(`${baseUrl}/protected`);
  const authorized = await fetch(`${baseUrl}/protected`, {
    headers: { "x-api-key": "synthetic-api-key" },
  });

  assert.equal(unauthorized.status, 401);
  assert.equal(authorized.status, 200);
  assert.equal((await authorized.json()).authenticated, true);
});

test("GET /protected accepts the token returned by the auth endpoint", async () => {
  const response = await fetch(`${baseUrl}/protected`, {
    headers: { authorization: "Bearer synthetic-test-token" },
  });

  assert.equal(response.status, 200);
  assert.equal((await response.json()).authenticated, true);
});

test("POST /echo returns the request data", async () => {
  const response = await fetch(`${baseUrl}/echo?run=datadog`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ check: true }),
  });
  const body = await response.json();

  assert.equal(body.method, "POST");
  assert.equal(body.query.run, "datadog");
  assert.deepEqual(body.body, { check: true });
});
