import express from "express";
import { generateHarmony } from "../ai/gemini.js";

const router = express.Router();

router.post("/harmony", async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || notes.length === 0) {
      return res.status(400).json({ error: "No notes provided" });
    }

    const result = await generateHarmony(notes);
    res.json(result);

  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({ error: "AI generation failed" });
  }
});

export default router;
