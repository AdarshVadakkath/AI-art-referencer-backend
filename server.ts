import express from "express";
import cors from "cors";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import testRoutes from "./src/routes/test";
import uploadRoutes from "./src/routes/upload";
import projectRoutes from "./src/routes/project";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", uploadRoutes);
app.use("/api", projectRoutes);

const PORT = process.env.PORT || 8080;
const db = drizzle(process.env.DATABASE_URL!);

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
