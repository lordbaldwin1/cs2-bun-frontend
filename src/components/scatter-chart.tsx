"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { x: 100, y: 200 },
  { x: 120, y: 100 },
  { x: 170, y: 300 },
  { x: 140, y: 250 },
  { x: 150, y: 400 },
  { x: 110, y: 280 },
];

interface ExampleProps {
  name: string;
  aim: {
    aim: number;
    wr: number;
    id: string;
  }[];
  minX: number;
  maxX: number;
}

function Example({ name, aim, minX, maxX }: ExampleProps) {
  return (
    <ResponsiveContainer width="100%" height={600}>
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="aim"
          name="aim"
          label={{ value: "Aim Score", position: "bottom", offset: 0 }}
          domain={[minX, maxX]}
        />
        <YAxis
          type="number"
          dataKey="wr"
          name="wr"
          unit="%"
          label={{
            value: "Win Rate (%)",
            position: "left",
            angle: -90,
            offset: 0,
          }}
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name={`${name}`} data={aim} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export default Example;
