export default function PianoRollGrid({ notes }) {
  return (
    <div className="piano-grid">
      {notes.map(note => (
        <div
          key={note.id}
          className="note"
          style={{
            left: note.time * 100,
            width: 80,
            backgroundColor: note.color
          }}
          title={`${note.userName} (${note.source})`}
        >
          {note.note}
        </div>
      ))}
    </div>
  );
}
