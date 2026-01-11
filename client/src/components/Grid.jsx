import { Line } from "react-konva";

export default function Grid({ width, height, cellSize }) {
  const lines = [];

  for (let i = 0; i < width / cellSize; i++) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i * cellSize, 0, i * cellSize, height]}
        stroke="#333"
      />
    );
  }

  for (let j = 0; j < height / cellSize; j++) {
    lines.push(
      <Line
        key={`h-${j}`}
        points={[0, j * cellSize, width, j * cellSize]}
        stroke="#222"
      />
    );
  }

  return <>{lines}</>;
}
