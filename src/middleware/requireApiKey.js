const API_KEY = process.env.SYNTHETIC_API_KEY || "synthetic-api-key";
const ACCESS_TOKEN = "synthetic-test-token";

export function requireApiKey(req, res, next) {
  const hasApiKey = req.get("x-api-key") === API_KEY;
  const hasBearerToken = req.get("authorization") === `Bearer ${ACCESS_TOKEN}`;

  if (!hasApiKey && !hasBearerToken) {
    return res.status(401).json({
      error: "unauthorized",
      message: "A valid x-api-key or Bearer token is required",
    });
  }

  return next();
}
