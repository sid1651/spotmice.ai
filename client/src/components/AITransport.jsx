import React, { useState } from "react";
import { exportToWav } from "../utils/exportAudio";



export default function AITransport({ notes, setNotes, socket, projectId }) {
  const [isLoading, setIsLoading] = useState(false);

  
  if (typeof setNotes !== "function") {
    console.error("❌ AITransport Error: setNotes is not a function");
    return null;
  }

  
  const pendingNotes = (notes || []).filter(
    (n) => n.source === "ai" && n.status === "pending"
  );
  const hasPendingAI = pendingNotes.length > 0;

 
  const requestAI = async () => {
    try {
      setIsLoading(true);

      const res = await fetch("http://localhost:5000/api/ai/harmony", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: notes
            .filter((n) => n.source !== "ai")
            .map((n) => ({
              id: n.id,
              x: n.x,
              y: n.y,
              width: n.width,
            })),
        }),
      });

      const data = await res.json();
      console.log("🧠 Gemini Response Received:", data);

      if (!data.harmonies || !Array.isArray(data.harmonies)) {
        throw new Error("Invalid response format from AI");
      }

      const SEMITONE = 20;
      const STAGE_HEIGHT = 400; // Adjust based on your actual piano roll height

      setNotes((prevNotes) => {
        const currentNotes = prevNotes || [];

        const newAINotes = data.harmonies
          .map((h) => {
            
            const base = currentNotes.find(
              (n) => String(n.id) === String(h.baseNoteId)
            );

            if (!base) {
              console.warn(
                `⚠️ Could not find base note for AI ID: ${h.baseNoteId}`
              );
              return null;
            }

          
            let calculatedY = base.y - h.interval * SEMITONE;
            const clampedY = Math.max(
              0,
              Math.min(calculatedY, STAGE_HEIGHT - 20)
            );

            return {
              ...base,
              id: `ai-${base.id}-${Date.now()}-${Math.random()
                .toString(36)
                .substr(2, 5)}`,
              y: clampedY,
              source: "ai",
              status: "pending",
              userName: "AI Suggestion",
              color: "#00e5ff", // Bright Cyan
            };
          })
          .filter(Boolean);

        console.log("🎵 Successfully created AI notes:", newAINotes);
        return [...currentNotes, ...newAINotes];
      });
    } catch (err) {
      
    } finally {
      setIsLoading(false);
    }
  };

  
  const acceptAI = () => {
    setNotes((prev) => {
      const updated = (prev || []).map((n) =>
        n.source === "ai" && n.status === "pending"
          ? { ...n, status: "accepted" }
          : n
      );

     
      if (socket && projectId) {
        socket.emit("notes-update", { projectId, notes: updated });
      }

      return updated;
    });
  };

 
  const rejectAI = () => {
    setNotes((prev) => {
      const filtered = (prev || []).filter(
        (n) => !(n.source === "ai" && n.status === "pending")
      );

      if (socket && projectId) {
        socket.emit("notes-update", { projectId, notes: filtered });
      }

      return filtered;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: "10px",
        background: "#222",
        borderRadius: "8px",
        alignItems: "center",
      }}
    >
            <button onClick={() => exportToWav(notes)}>⬇ Export WAV</button>

      
      <button
        onClick={requestAI}
        disabled={isLoading || hasPendingAI}
        style={{
          padding: "8px 16px",
          cursor: isLoading ? "not-allowed" : "pointer",
          background: isLoading ? "#555" : "#444",
          color: "white",
          border: "1px solid #666",
          borderRadius: "4px",
        }}
      >
        {isLoading ? "⌛ AI is Thinking..." : "🤖 AI Harmony"}
      </button>
      
      {hasPendingAI && (
        <div
          style={{
            display: "flex",
            gap: 8,
            marginLeft: "10px",
            borderLeft: "1px solid #444",
            paddingLeft: "15px",
          }}
        >
          <button
            onClick={acceptAI}
            style={{
              background: "#27ae60",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Accept
          </button>
          <button
            onClick={rejectAI}
            style={{
              background: "#c0392b",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reject
          </button>
        </div>
      )}
     
      
      
    </div>
  );
}
