import express from "express";
import Project from "../models/Project.js";
import { generateHarmony } from "../ai/gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const project = await Project.create(req.body);
  res.json(project);
});

router.get("/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.json(project);
});

router.post("/:id/ai-harmony", async (req, res) => {
  const suggestion = await generateHarmony(req.body.melody);
  res.json({ suggestion });
});

export default router;
