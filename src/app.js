import express from "express";
import router from "./router.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
