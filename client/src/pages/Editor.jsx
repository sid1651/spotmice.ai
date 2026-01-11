import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import PianoRollEditor from "../components/PianoRollEditor";
import Transport from "../components/Transport";
import CollaboratorSidebar from "../components/CollaboratorSidebar";
import { usePresence } from "../hooks/usePresence";
import { socket } from "../socket";
import AITransport from "../components/AITransport";

export default function Editor() {
  const { roomId } = useParams();
  const location = useLocation();

  const userName = location.state?.name || "Guest";

  const [notes, setNotes] = useState([]);

  // ✅ users is an ARRAY
  const { users, setEditing } = usePresence(roomId, userName, setNotes);

  return (
    <div className="editor">
      {/* ✅ PASS USERS ARRAY */}
      <CollaboratorSidebar users={users} />

      <div className="main">
        <div className="topbar">
          <span>🎹 Room: {roomId}</span>
          <Transport notes={notes}  />
        </div>

        <AITransport projectId={roomId} notes={notes} setNotes={setNotes} />

        <div className="canvas">
          <PianoRollEditor
            notes={notes}
            setNotes={setNotes}
            socket={socket}
            projectId={roomId}
            onEdit={setEditing}
            userName={userName}   
          />
        </div>
      </div>
    </div>
  );
}
