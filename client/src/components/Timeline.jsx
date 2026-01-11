import { Stage, Layer, Line, Text } from "react-konva";

export default function Timeline({ width, cell }) {
  const bars = Array.from({ length: width / (cell * 4) }, (_, i) => i);

  return (
    <Stage width={width} height={40}>
      <Layer>
        {bars.map((i) => (
          <>
            <Line
              points={[i * cell * 4, 0, i * cell * 4, 40]}
              stroke="#444"
            />
            <Text
              text={i + 1}
              x={i * cell * 4 + 4}
              y={10}
              fill="#aaa"
              fontSize={12}
            />
          </>
        ))}
      </Layer>
    </Stage>
  );
}
