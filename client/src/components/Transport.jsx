import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

const CELL = 20;


const pitchFromY = (y) => {
  const maxMidi = 84; // C6
  return maxMidi - Math.floor(y / CELL);
};


const timeFromX = (x) => {
  return (x / CELL) * 0.25; // 16th note grid
};

export default function Transport({ notes }) {
  const synthRef = useRef(null);
  const [tempo, setTempo] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);

  // Init synth ONCE
  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, release: 0.5 },
    }).toDestination();

    return () => {
      synthRef.current.dispose();
    };
  }, []);

  // Update tempo live
  useEffect(() => {
    Tone.Transport.bpm.value = tempo;
  }, [tempo]);

  const play = async () => {
    if (!notes.length) return;

    await Tone.start();

    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.start();
    notes.forEach((note) => {
      Tone.Transport.schedule((time) => {
        synthRef.current.triggerAttackRelease(
          Tone.Frequency(pitchFromY(note.y), "midi"),
          "8n",
          time
        );
      }, timeFromX(note.x));
    });

    Tone.Transport.start("+0.1");
    console.log("▶ Transport started");
    setIsPlaying(true);
  };

  const stop = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setIsPlaying(false);
  };

  const exportMp3 = async () => {
    const res = await fetch(`http://localhost:5000/api/export/${roomId}/mp3`, {
      method: "POST",
    });
    const data = await res.json();

    if (data.url) {
      window.open(`http://localhost:5000${data.url}`);
    }
  };

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <button onClick={play} disabled={isPlaying}>
        ▶ Play
      </button>

      <button onClick={stop}>⏹ Stop</button>


      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span>Tempo</span>
        <input
          type="number"
          min="60"
          max="200"
          value={tempo}
          onChange={(e) => setTempo(Number(e.target.value))}
          style={{ width: 60 }}
        />
        <span>BPM</span>
      </div>
    </div>
  );
}
