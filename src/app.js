import express from "express";
import router from "./router.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    [
      "Content-Type",
      "Authorization",
      "X-API-Key",

      // Datadog propagation headers
      "x-datadog-trace-id",
      "x-datadog-parent-id",
      "x-datadog-origin",
      "x-datadog-sampling-priority",

      // W3C trace propagation
      "traceparent",
      "tracestate",
      "baggage",
    ].join(", "),
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});
app.disable("x-powered-by");
app.use(express.json());
app.use(express.static(__dirname));
app.use("/api", router);

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

app.use((req, res) => {
  res.status(404).json({
    error: "not_found",
    message: `Route ${req.method} ${req.originalUrl} was not found`,
  });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res
      .status(400)
      .json({ error: "invalid_json", message: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: "internal_server_error" });
});

export default app;
