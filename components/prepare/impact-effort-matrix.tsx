"use client";

export interface ImpactEffortPoint {
  id: string;
  name: string;
  impactPercent: number;
  learningDays: number;
}

const CHART_WIDTH = 280;
const CHART_HEIGHT = 200;
const PADDING = { top: 16, right: 16, bottom: 32, left: 40 };

export interface ImpactEffortMatrixProps {
  points: ImpactEffortPoint[];
  className?: string;
}

export function ImpactEffortMatrix({ points, className = "" }: ImpactEffortMatrixProps) {
  if (points.length === 0) return null;

  const impactMax = Math.max(...points.map((p) => p.impactPercent), 15);
  const effortMax = Math.max(...points.map((p) => p.learningDays), 14);
  const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
  const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const x = (days: number) =>
    PADDING.left + (days / effortMax) * innerWidth;
  const y = (impact: number) =>
    PADDING.top + innerHeight - (impact / impactMax) * innerHeight;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-foreground-muted">학습 시간 (일) →</span>
        <span className="text-xs font-medium text-foreground-muted">↑ 매칭 영향 (%)</span>
      </div>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="w-full max-w-[280px] h-[200px]"
        aria-hidden
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={`v-${t}`}
            x1={x(effortMax * t)}
            y1={PADDING.top}
            x2={x(effortMax * t)}
            y2={PADDING.top + innerHeight}
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeDasharray="2 2"
          />
        ))}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={`h-${t}`}
            x1={PADDING.left}
            y1={y(impactMax * t)}
            x2={PADDING.left + innerWidth}
            y2={y(impactMax * t)}
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeDasharray="2 2"
          />
        ))}
        {/* Quadrant label - high impact, low effort */}
        <text
          x={PADDING.left + innerWidth * 0.25}
          y={PADDING.top + innerHeight * 0.2}
          className="fill-primary-500 text-[10px] font-medium"
          textAnchor="middle"
        >
          우선 추천
        </text>
        {/* Points */}
        {points.map((p) => (
          <g key={p.id}>
            <circle
              cx={x(p.learningDays)}
              cy={y(p.impactPercent)}
              r={6}
              className="fill-primary-500 stroke-card stroke-2"
            />
            <text
              x={x(p.learningDays)}
              y={y(p.impactPercent) - 10}
              className="fill-foreground text-[9px]"
              textAnchor="middle"
            >
              {p.name}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex justify-between mt-1 text-[10px] text-foreground-muted">
        <span>0</span>
        <span>{effortMax}일</span>
      </div>
    </div>
  );
}
