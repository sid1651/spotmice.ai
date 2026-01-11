import express from "express";
import fs from "fs";
import { exec } from "child_process";
import MidiWriter from "midi-writer-js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { rooms } from "../sockets/collab.js";

ffmpeg.setFfmpegPath(ffmpegPath);

const router = express.Router();

router.post("/:projectId/mp3", async (req, res) => {
  const { projectId } = req.params;
  const room = rooms[projectId];

  if (!room || room.notes.length === 0) {
    return res.status(400).json({ error: "No notes to export" });
  }

  const exportsDir = "exports";
  if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir);

  const midiPath = `${exportsDir}/${projectId}.mid`;
  const wavPath = `${exportsDir}/${projectId}.wav`;
  const mp3Path = `${exportsDir}/${projectId}.mp3`;

  /* ---------- NOTES → MIDI ---------- */
  /* ---------- NOTES → MIDI ---------- */
const track = new MidiWriter.Track();
track.setTempo(120);

room.notes.forEach(note => {
  const pitch = 84 - Math.floor(note.y / 20); // MIDI number
  const startTick = note.x * 10;

  track.addEvent(
    new MidiWriter.NoteEvent({
      pitch: [pitch],   // ✅ CORRECT
      duration: "8",
      startTick
    })
  );
});

const writer = new MidiWriter.Writer([track]);
fs.writeFileSync(midiPath, writer.buildFile());


  /* ---------- MIDI → WAV ---------- */
  exec(
    `fluidsynth -ni soundfont.sf2 ${midiPath} -F ${wavPath} -r 44100`,
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      /* ---------- WAV → MP3 ---------- */
      ffmpeg(wavPath)
        .audioBitrate(192)
        .save(mp3Path)
        .on("end", () => {
          res.json({
            success: true,
            download: `/exports/${projectId}.mp3`
          });
        });
    }
  );
});

export default router;
