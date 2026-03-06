"use client";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface Props {
  data: number[];
}

export default function SparklineChart({ data }: Props) {
  if (!data || data.length === 0) return null;
  const chartData = data.map((price, index) => ({ index, price }));
  const isPositive = data[data.length - 1] > data[0];

  return (
    <div className="w-24 sm:w-32 h-10">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? "#16a34a" : "#ef4444"}
            dot={false}
            strokeWidth={2}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}