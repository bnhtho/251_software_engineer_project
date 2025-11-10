import React from "react";

type DataPoint = {
  label: string;
  value: number;
};

type Props = {
  data: DataPoint[];
  height?: number;
};

const BarChart: React.FC<Props> = ({ data, height = 160 }) => {
  const max = Math.max(1, ...data.map((d) => d.value));
  const padding = 8;
  const barGap = 8;

  return (
    <div className="w-full">
      <svg
        className="w-full"
        viewBox={`0 0 ${data.length * (20 + barGap) + padding * 2} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="barGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="1" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
          </linearGradient>
        </defs>

        {data.map((d, idx) => {
          const barWidth = 20;
          const x = padding + idx * (barWidth + barGap);
          const barHeight = (d.value / max) * (height - 30); // leave room for labels
          const y = height - barHeight - 20;
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill="url(#barGrad)"
                className="transition-transform hover:scale-105"
              />
              <text
                x={x + barWidth / 2}
                y={height - 6}
                fontSize={10}
                textAnchor="middle"
                fill="#374151"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;
