import { Stage, Layer, Rect, Text, Group } from "react-konva";
import { useState } from "react";

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function midiToNoteName(midi) {
  const note = NOTE_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}

export default function PianoKeys({ height, cell }) {
  const rows = Array.from({ length: height / cell }, (_, i) => i);
  const [hovered, setHovered] = useState(null);

  return (
    <Stage width={80} height={height}>
      <Layer>
        {rows.map((i) => {
          const midi = 84 - i; 
          const noteName = midiToNoteName(midi);
          const isBlack = [1, 3, 6, 8, 10].includes(midi % 12);

          return (
            <Group key={i}>
              
              <Rect
                x={0}
                y={i * cell}
                width={80}
                height={cell}
                fill={isBlack ? "#111" : "#eee"}
                stroke="#333"
                onMouseEnter={() =>
                  setHovered({ y: i * cell, note: noteName })
                }
                onMouseLeave={() => setHovered(null)}
              />
            </Group>
          );
        })}

        
        {hovered && (
          <Group>
            <Rect
              x={84}
              y={hovered.y + 2}
              width={40}
              height={16}
              fill="#000"
              opacity={0.85}
              cornerRadius={4}
            />
            <Text
              x={88}
              y={hovered.y + 4}
              text={hovered.note}
              fontSize={12}
              fill="#00e5ff"
            />
          </Group>
        )}
      </Layer>
    </Stage>
  );
}
