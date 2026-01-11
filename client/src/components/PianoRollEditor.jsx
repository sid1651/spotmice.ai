import { Stage, Layer } from "react-konva";
import Grid from "./Grid";
import NoteBlock from "./NoteBlock";

const CELL = 20;
const WIDTH = 800;
const HEIGHT = 800;

export default function PianoRollEditor({
  notes,
  setNotes,
  socket,
  projectId,
  onEdit,
  userName,
}) {
  const addNote = (e) => {
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (!pos) return;

    const x = Math.floor(pos.x / CELL) * CELL;
    const y = Math.floor(pos.y / CELL) * CELL;
    const note = {
      id: Date.now(),
      x,
      y,
      width: CELL * 2,
      height: CELL,
      source: "human",
    };

    setNotes((prev) => [...prev, note]);
    onEdit && onEdit();

    socket.emit("midi-update", {
      projectId,
      event: note,
    });
  };

  return (
    <Stage width={WIDTH} height={HEIGHT} onDblClick={addNote}>
      <Layer>
        <Grid width={WIDTH} height={HEIGHT} cellSize={CELL} />
        {notes.map((note) => (
          <NoteBlock
            key={note.id} // Ensure this is unique (ai-id includes Date.now)
            note={note}
            projectId={projectId}
            isOwner={note.source !== "ai"} // AI notes usually aren't draggable until accepted
            userName={userName}
            onUpdateNotes={(newNotesArrayOrFormula) => {
      // 1. Update Local State
      setNotes(prev => {
        const next = typeof newNotesArrayOrFormula === 'function' 
          ? newNotesArrayOrFormula(prev) 
          : newNotesArrayOrFormula;
        
        // 2. 🔥 BROADCAST DELETION
        socket.emit("notes-update", { projectId, notes: next });
        return next;
      });
    }}
            onChange={(updated) => {
              const newNotes = notes.map((n) =>
                n.id === updated.id ? updated : n
              );
              setNotes(newNotes);
              socket.emit("midi-update", { projectId, event: updated });
            }}
          />
        ))}
      </Layer>
    </Stage>
  );
}
