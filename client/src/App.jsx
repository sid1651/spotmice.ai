import { Routes, Route, Link } from "react-router-dom";
import Editor from "./pages/Editor";
import Home from "./pages/Home";

// function landing() {
//   return (
//     <div style={{ padding: 40 }}>
//       <h1>🎵 Collaborative MIDI Composer</h1>
//       <p>Create music together in real time.</p>

//       <Link to="/editor">
//         <button style={{ padding: "10px 20px", fontSize: 16 }}>
//           Open Editor
//         </button>
//       </Link>
//     </div>
//   );
// }

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/" element={<landing />} /> */}
      <Route path="/editor/:roomId" element={<Editor />} />
    </Routes>
  );
}
