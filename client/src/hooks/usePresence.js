import { useEffect, useState } from "react";
import { socket } from "../socket";

export function usePresence(projectId, name, setNotes) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!projectId || !name) return;

    socket.emit("join-project", { projectId, name });

    socket.on("room-init", ({ notes, users }) => {
      setNotes(notes);
      setUsers(users);
    });

    socket.on("presence-update", (data) => {
      setUsers(data.users);
    });

    // ✅ Authoritative update for full note list (AI suggest, Accept, Reject)
    socket.on("notes-update", ({ notes }) => {
      console.log("🎹 Full notes update received");
      setNotes(notes);
    });

    // ✅ Incremental updates for individual note movements
    socket.on("remote-midi-update", (payload) => {
      setNotes((prev) => {
        const map = new Map(prev.map((n) => [n.id, n]));
        map.set(payload.id, payload);
        return Array.from(map.values());
      });
    });

    socket.on("remote-delete-note", (deletedNoteId) => {
    console.log("🚫 Remote deletion received for:", deletedNoteId);
    setNotes((prev) => prev.filter((n) => String(n.id) !== String(deletedNoteId)));
  });

    return () => {
      socket.off("room-init");
      socket.off("presence-update");
      socket.off("notes-update");
      socket.off("remote-midi-update");
      socket.off("remote-delete-note");
    };
  }, [projectId, name, setNotes]);

  const setEditing = () => {
    socket.emit("editing", { projectId });
  };

  return { users, setEditing };
}