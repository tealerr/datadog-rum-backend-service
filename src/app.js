import express, { json } from "express";
import router from "./router.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3000;

// สร้าง __dirname สำหรับ ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname)));

app.use(json());
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Rum backend service is running");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
