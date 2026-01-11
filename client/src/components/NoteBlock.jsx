import { Rect, Text, Group, Circle } from "react-konva";
import { socket } from "../socket";

export default function NoteBlock({ note, 
  onChange, 
  onUpdateNotes, 
  isOwner,
  projectId }) {
  
  

  // components/NoteBlock.jsx
const handleDelete = (e) => {
  e.cancelBubble = true;
  if (!isOwner) return;

  socket.emit("delete-note", { 
    projectId,
    noteId: note.id 
  });
};


  return (
    <Group>
      
      <Rect
        x={note.x}
        y={note.y}
        width={note.width}
        height={note.height}
        fill={note.source === "ai" ? "#00e5ff" : note.color}
        draggable={isOwner}
        onDragEnd={(e) => {
          onChange({
            ...note,
            x: Math.round(e.target.x() / 20) * 20,
            y: Math.round(e.target.y() / 20) * 20,
          });
        }}
      />

     
      <Group 
        x={note.x + note.width - 15} 
        y={note.y + 2} 
        onClick={handleDelete}
        tap={handleDelete} // for mobile
        style={{ cursor: 'pointer' }}
      >
        <Circle radius={6} fill="rgba(0,0,0,0.5)" />
        <Text 
          text="×" 
          fontSize={12} 
          fill="white" 
          x={-4} 
          y={-6} 
        />
      </Group>

      <Text text={note.userName} x={note.x + 2} y={note.y + 2} fontSize={8} fill="#000" />
    </Group>
  );
}