import express from "express";
import cors from "cors";
import projectRoutes from "./routes/projects.js";
import exportRoutes from "./routes/export.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// API routes
app.use("/api/projects", projectRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/ai", aiRoutes);
// Static exported audio
app.use("/exports", express.static("exports"));

export default app;
