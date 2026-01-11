import { Stage, Layer } from "react-konva";
import Grid from "./Grid";
import NoteBlock from "./NoteBlock";
import Timeline from "./Timeline";
import Playhead from "./Playhead";

const CELL = 20;
const WIDTH = 1700;
const HEIGHT = 400;

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
    <div style={{ display: "flex", background: "#1e1e1e" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Timeline width={WIDTH} cell={CELL} />

        <Stage width={WIDTH} height={HEIGHT} onDblClick={addNote}>
          <Layer>
            <Grid width={WIDTH} height={HEIGHT} cellSize={CELL} />
            <Playhead height={HEIGHT} cellSize={CELL} />
            {notes.map((note) => (
              <NoteBlock
                key={note.id}
                note={note}
                projectId={projectId}
                isOwner={note.source !== "ai"}
                userName={userName}
                onChange={(updated) => {
                  const newNotes = notes.map((n) =>
                    n.id === updated.id ? updated : n
                  );
                  setNotes(newNotes);
                  socket.emit("midi-update", {
                    projectId,
                    event: updated,
                  });
                }}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
