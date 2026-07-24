import { Router } from "express";
import { requireApiKey } from "./middleware/requireApiKey.js";
import { users } from "./data/users.js";
import { decryptPassword } from "./utils/decryptPassword.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "synthetic-mock-api",
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.get("/status/:code", (req, res) => {
  const code = Number(req.params.code);

  if (!Number.isInteger(code) || code < 200 || code > 599) {
    return res.status(400).json({
      error: "invalid_status_code",
      message: "Status code must be an integer between 200 and 599",
    });
  }

  return res.status(code).json({
    statusCode: code,
    message: `Synthetic test response ${code}`,
    timestamp: new Date().toISOString(),
  });
});

router.get("/delay/:milliseconds", async (req, res) => {
  const milliseconds = Number(req.params.milliseconds);

  if (
    !Number.isInteger(milliseconds) ||
    milliseconds < 0 ||
    milliseconds > 10000
  ) {
    return res.status(400).json({
      error: "invalid_delay",
      message: "Delay must be an integer between 0 and 10000 milliseconds",
    });
  }

  await new Promise((resolve) => setTimeout(resolve, milliseconds));
  return res.json({
    delayedBy: milliseconds,
    timestamp: new Date().toISOString(),
  });
});

router.all("/echo", (req, res) => {
  res.json({
    method: req.method,
    query: req.query,
    headers: {
      "content-type": req.get("content-type") ?? null,
      "user-agent": req.get("user-agent") ?? null,
    },
    body: req.body ?? null,
  });
});

router.post("/auth/token", (req, res) => {
  const { username, password } = req.body ?? {};

  if (username !== "synthetic-user" || password !== "synthetic-password") {
    return res.status(401).json({ error: "invalid_credentials" });
  }

  return res.json({
    accessToken: "synthetic-test-token",
    tokenType: "Bearer",
    expiresIn: 3600,
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body ?? {};

  const user = users.find(
    (candidate) =>
      candidate.username === username && candidate.password === password,
  );

  if (!user) {
    return res.status(401).json({
      error: "invalid_credentials",
      message: "Invalid username or password",
    });
  }

  const { password: _password, ...safeUser } = user;

  return res.status(200).json({
    message: "Login successful",
    user: safeUser,
  });
});

router.get("/protected", requireApiKey, (req, res) => {
  res.json({
    authenticated: true,
    data: { id: 1, name: "Synthetic Test Data" },
  });
});

router.get("/profile/cpu", (req, res) => {
  const startedAt = performance.now();
  let result = 0;

  while (performance.now() - startedAt < 10_000) {
    result += Math.sqrt(Math.random() * 1_000_000);
  }

  res.json({
    message: "CPU profiling workload completed",
    result,
  });
});

export default router;
