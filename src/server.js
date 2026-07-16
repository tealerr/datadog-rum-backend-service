import app from "./app.js";
import { loadEnvFile } from "node:process";

try {
  loadEnvFile();
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Mock API listening at http://localhost:${port}`);
});
