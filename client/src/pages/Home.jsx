import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (!name || !room) return alert("Enter name & room");
    navigate(`/editor/${room}`, { state: { name } });
  };

  return (
    <div className="home">
      <div className="blob one"></div>
      <div className="blob two"></div>
      <div className="blob three"></div>
      <h1>🎵 Collaborative MIDI Studio</h1>

      <div className="card">
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Room ID (e.g. beat-101)"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}
