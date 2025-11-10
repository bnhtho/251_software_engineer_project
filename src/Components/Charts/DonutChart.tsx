import React from "react";

type Slice = {
  label: string;
  value: number;
};

type Props = {
  data: Slice[];
  size?: number;
  strokeWidth?: number;
  colors?: string[];
};

const defaultColors = [
  "#6366f1",
  "#06b6d4",
  "#f97316",
  "#ef4444",
  "#10b981",
  "#8b5cf6",
];

const DonutChart: React.FC<Props> = ({
  data,
  size = 140,
  strokeWidth = 18,
  colors = defaultColors,
}) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          {data.map((slice, i) => {
            const portion = slice.value / total;
            const dash = portion * circumference;
            const strokeDasharray = `${dash} ${circumference - dash}`;
            const rotation = (offset / circumference) * 360;
            offset += dash;
            return (
              <circle
                key={slice.label}
                r={radius}
                fill="transparent"
                stroke={colors[i % colors.length]}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={0}
                transform={`rotate(${rotation})`}
                strokeLinecap="round"
              />
            );
          })}

          <circle r={radius - strokeWidth / 2} fill="white" />
        </g>
      </svg>

      <div className="flex flex-col text-sm">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded"
              style={{ background: colors[i % colors.length] }}
            />
            <span className="text-gray-700">{d.label}</span>
            <span className="ml-2 text-gray-500">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
