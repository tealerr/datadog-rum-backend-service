import { loadEnvFile } from "node:process";

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

// Initialize Datadog before loading Express and the application modules.
await import("./datadog-profiler.js");
const { default: app } = await import("./app.js");

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`🚀API listening at http://localhost:${port}`);
});
