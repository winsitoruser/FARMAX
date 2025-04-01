import React from 'react';

interface ProgressChartProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'orange';
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  percentage,
  size = 'md',
  color = 'primary',
  showPercentage = true,
  label,
  animated = true
}) => {
  // Define sizes for the chart
  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { width: '50px', height: '50px', thickness: 4, fontSize: 'text-xs' };
      case 'md': return { width: '80px', height: '80px', thickness: 6, fontSize: 'text-sm' };
      case 'lg': return { width: '120px', height: '120px', thickness: 8, fontSize: 'text-base' };
      default: return { width: '80px', height: '80px', thickness: 6, fontSize: 'text-sm' };
    }
  };
  
  // Define colors for the chart
  const getColorStyles = () => {
    switch (color) {
      case 'primary': return '#2461EE';
      case 'success': return '#1DC9B7';
      case 'info': return '#8950FC';
      case 'warning': return '#FFB822';
      case 'danger': return '#F64E60';
      case 'orange': return '#FF5722';
      default: return '#2461EE';
    }
  };
  
  const { width, height, thickness, fontSize } = getSizeStyles();
  const colorValue = getColorStyles();
  
  // Calculate the circumference and offset
  const radius = 50 - thickness / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  // Animation props
  const animationProps = animated ? {
    style: {
      animation: 'progress-chart-fill 1.5s ease-in-out forwards',
    }
  } : {};
  
  return (
    <div className="inline-flex flex-col items-center">
      <div style={{ width, height, position: 'relative' }}>
        <svg width={width} height={height} viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#E6E6E6"
            strokeWidth={thickness}
          />
          
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={colorValue}
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            {...animationProps}
          />
          
          {/* Percentage Text */}
          {showPercentage && (
            <text
              x="50"
              y="50"
              dy=".35em"
              textAnchor="middle"
              fill="#333333"
              className={`font-semibold ${fontSize}`}
            >
              {percentage}%
            </text>
          )}
        </svg>
      </div>
      
      {label && <span className="mt-2 text-sm text-gray-600">{label}</span>}
      
      <style jsx>{`
        @keyframes progress-chart-fill {
          0% {
            stroke-dashoffset: ${circumference};
          }
          100% {
            stroke-dashoffset: ${offset};
          }
        }
      `}</style>
    </div>
  );
};

export default ProgressChart;
