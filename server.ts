import express from "express";
import cors from "cors";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import testRoutes from "./src/routes/test";
import uploadRoutes from "./src/routes/upload";
import projectRoutes from "./src/routes/project";

import {
  clerkMiddleware,
  clerkClient,
  requireAuth,
  getAuth,
} from "@clerk/express";

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use("/api", testRoutes);
app.use("/api", requireAuth(), uploadRoutes);
app.use("/api", requireAuth(), projectRoutes);

const PORT = process.env.PORT || 8080;
const db = drizzle(process.env.DATABASE_URL!);

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
