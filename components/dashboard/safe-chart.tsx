import React, { useEffect, useRef, useMemo } from "react";
import Chart from "chart.js/auto";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

interface SafeChartProps {
  id: string;
  title?: string;
  subtitle?: string;
  chartType: "line" | "bar" | "doughnut" | "pie";
  data: any;
  options?: any;
  chartHeight?: number;
  hideHeader?: boolean;
}

const SafeChart = ({
  id,
  title,
  subtitle,
  chartType,
  data,
  options = {},
  chartHeight = 300,
  hideHeader = false,
}: SafeChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Create unique ID using id prop and a random suffix to prevent collisions
  const uniqueId = useMemo(() => `${id}-${Math.random().toString(36).substring(2, 9)}`, [id]);

  useEffect(() => {
    if (chartRef.current) {
      // Safely destroy any existing chart instance first
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create the chart with the new configuration
      const ctx = chartRef.current.getContext("2d");
      
      if (ctx) {
        // Set default options for all chart types with orange/amber theme
        const defaultOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom" as const,
              labels: {
                usePointStyle: true,
                boxWidth: 8,
                font: {
                  size: 11,
                }
              }
            },
            title: {
              display: !!title,
              text: title || "",
              font: {
                size: 14,
                weight: "bold",
              },
              color: "#1f2937",
              padding: {
                bottom: subtitle ? 0 : 10,
              }
            },
            subtitle: {
              display: !!subtitle,
              text: subtitle || "",
              font: {
                size: 12,
              },
              color: "#6b7280",
              padding: {
                bottom: 10,
              }
            },
          },
        };

        // Apply specific options based on chart type
        const chartOptions = {
          ...defaultOptions,
          ...options,
        };

        // Create gradients for line charts
        if (chartType === "line" && ctx) {
          const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
          gradient.addColorStop(0, "rgba(249, 115, 22, 0.4)");
          gradient.addColorStop(1, "rgba(249, 115, 22, 0.0)");
          
          // Apply gradient fill to all datasets if they don't have custom backgroundColor
          if (data.datasets && data.datasets.length > 0) {
            data.datasets.forEach((dataset: any) => {
              if (dataset.fill && !dataset.backgroundColor) {
                dataset.backgroundColor = gradient;
              }
            });
          }
        }

        // Create the chart instance
        chartInstance.current = new Chart(ctx, {
          type: chartType,
          data: data,
          options: chartOptions,
        });
      }
    }

    // Clean up function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [chartType, data, options, title, subtitle, uniqueId, chartHeight]);

  return (
    <div>
      {!hideHeader && (title || subtitle) && (
        <div className="mb-2">
          {title && <h3 className="text-sm font-medium text-gray-900">{title}</h3>}
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div style={{ height: `${chartHeight}px` }}>
        <canvas id={uniqueId} ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default SafeChart;
