import { Line } from "react-konva";
import { useEffect, useRef } from "react";
import * as Tone from "tone";

export default function Playhead({ height, cellSize }) {
  const lineRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      // ✅ Only animate when playing
      console.log("Transport state:", Tone.Transport.state);
      if (Tone.Transport.state === "started") {
        const seconds = Tone.Transport.seconds || 0;
        const x = seconds * cellSize * 4;

        if (lineRef.current) {
          lineRef.current.x(x);
          lineRef.current.getLayer()?.batchDraw();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cellSize]);

  return (
    <Line
      ref={lineRef}
      points={[0, 0, 0, height]}
      stroke="#00e5ff"
      strokeWidth={2}
      shadowBlur={10}
      shadowColor="#00e5ff"
      listening={false}
    />
  );
}
