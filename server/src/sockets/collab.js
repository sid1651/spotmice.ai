import { Server } from "socket.io";
import { generateHarmony } from "../ai/gemini.js";
import { saveProject } from "../utils/saveProject.js";
import Project from "../models/Project.js";


export const rooms = {};
const COLORS = [
  "#ff6b6b",
  "#6bc5ff",
  "#6bff95",
  "#d36bff",
  "#ffc36b",
  "#ff9ff3",
  "#48dbfb",
];
const getColor = (index) => COLORS[index % COLORS.length];

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    socket.on("join-project", async ({ projectId, name }) => {
  if (!projectId || !name) return;
  socket.join(projectId);

  // 1️⃣ Create room if missing
  if (!rooms[projectId]) {
    rooms[projectId] = {
      users: {},
      notes: [],
      userColorMap: {} // ✅ NEW (internal only)
    };

    const project = await Project.findOne({ projectId });
    if (project) {
      rooms[projectId].notes = project.notes;
      console.log("📂 Loaded project from DB:", projectId);
    }
  }

    // OPTIONAL: load notes from DB here later
    // const project = await Project.findOne({ projectId });
    // if (project) rooms[projectId].notes = project.notes;
    
  

  const room = rooms[projectId];

  // 2️⃣ Assign stable color per username
  if (!room.userColorMap[name]) {
    const usedColors = Object.values(room.userColorMap);
    const nextColor = getColor(usedColors.length);
    room.userColorMap[name] = nextColor;
  }

  // 3️⃣ Register user
  room.users[socket.id] = {
    id: socket.id,
    name,
    color: room.userColorMap[name], // ✅ STABLE COLOR
    status: "online",
  };

  // 4️⃣ Send state to joining user
  socket.emit("room-init", {
    notes: room.notes,
    users: Object.values(room.users),
  });

  // 5️⃣ Notify others
  socket.to(projectId).emit("presence-update", {
    users: Object.values(room.users),
  });
});


    socket.on("ai-suggest", async ({ projectId }) => {
      const room = rooms[projectId];
      if (!room || room.notes.length === 0) return;

      try {
        const melody = room.notes
          .filter((n) => n.source !== "ai")
          .map((n) => ({ id: n.id, x: n.x, y: n.y, duration: n.width }));

        const aiResult = await generateHarmony(melody);
        if (!aiResult || !Array.isArray(aiResult.harmonies)) return;

        const SEMITONE_HEIGHT = 20; // Ensure this matches your CSS/Grid height
        const newNotes = aiResult.harmonies
          .map((h) => {
            const base = room.notes.find((n) => n.id === h.baseNoteId);
            if (!base) return null;

            return {
              ...base,
              id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              x: base.x + (h.timeOffset || 0),
              // We subtract because in most Piano Rolls, Y=0 is the top (higher notes)
              y: base.y - h.interval * SEMITONE_HEIGHT,
              userId: "ai-bot",
              userName: "AI Composer",
              color: "#00e5ff",
              source: "ai",
              status: "pending",
            };
          })
          .filter(Boolean);

        if (newNotes.length > 0) {
          room.notes.push(...newNotes);
          console.log("📤 Sending new notes to frontend:", newNotes);
          io.to(projectId).emit("notes-update", { notes: room.notes });
        }
        saveProject(projectId, room.notes);
      } catch (err) {
        console.error("Gemini AI error:", err);
      }
    });

    socket.on("accept-ai", ({ projectId }) => {
      const room = rooms[projectId];
      if (!room) return;

      // ✅ Update status to 'accepted' so they aren't filtered out by rejection later
      room.notes = room.notes.map((note) =>
        note.source === "ai" && note.status === "pending"
          ? { ...note, status: "accepted" }
          : note
      );

      io.to(projectId).emit("notes-update", { notes: room.notes });
      
    });

    socket.on("reject-ai", ({ projectId }) => {
      const room = rooms[projectId];
      if (!room) return;

      room.notes = room.notes.filter(
        (note) => !(note.source === "ai" && note.status === "pending")
      );

      io.to(projectId).emit("notes-update", { notes: room.notes });
      saveProject(projectId, room.notes);
    });

    socket.on("midi-update", ({ projectId, event }) => {
      if (!rooms[projectId]) return;
      const user = rooms[projectId].users[socket.id];
      if (!user) return;

      const noteWithOwner = {
        ...event,
        userId: socket.id,
        userName: user.name,
        color: user.color,
      };
      const index = rooms[projectId].notes.findIndex((n) => n.id === event.id);

      if (index === -1) rooms[projectId].notes.push(noteWithOwner);
      else rooms[projectId].notes[index] = noteWithOwner;

      io.to(projectId).emit("remote-midi-update", noteWithOwner);
      saveProject(projectId, rooms[projectId].notes);
    });

    // server/socket.js
    // server/socket.js

// 1. DELETE SINGLE NOTE
socket.on("delete-note", ({ projectId, noteId }) => {
  if (!rooms[projectId]) return;

  rooms[projectId].notes = rooms[projectId].notes.filter(
    n => String(n.id) !== String(noteId)
  );

  io.to(projectId).emit("notes-update", {
    notes: rooms[projectId].notes
    
  });
  saveProject(projectId, rooms[projectId].notes);
});


// 2. CLEAR ALL NOTES
socket.on("clear-all-notes", ({ projectId }) => {
  if (!rooms[projectId]) return;

  console.log(`🧨 Clearing all notes in room ${projectId}`);

  // 🔥 UPDATE SERVER MEMORY
  rooms[projectId].notes = [];

  // Notify everyone
  io.to(projectId).emit("notes-update", { notes: [] });
});

    socket.on("disconnect", () => {
      for (const projectId in rooms) {
        if (rooms[projectId].users[socket.id]) {
          delete rooms[projectId].users[socket.id];
          io.to(projectId).emit("presence-update", {
            users: Object.values(rooms[projectId].users),
          });
          if (Object.keys(rooms[projectId].users).length === 0)
            delete rooms[projectId];
        }
      }
    });
  });
};
