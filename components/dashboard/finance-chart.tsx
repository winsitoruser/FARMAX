import React, { useEffect, useRef } from 'react';
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
  ChartData,
  ChartOptions
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Define props for FinanceChart
interface FinanceChartProps {
  title: string;
  subtitle?: string;
  chartType: 'line' | 'bar' | 'area' | 'doughnut';
  data: ChartData<any>;
  chartHeight?: number;
  gradient?: boolean;
  hideHeader?: boolean;
  barThickness?: number;
  className?: string;
}

// FinanceChart component
const FinanceChart: React.FC<FinanceChartProps> = ({
  title,
  subtitle,
  chartType,
  data,
  chartHeight = 300,
  gradient = false,
  hideHeader = false,
  barThickness = 20,
  className = "",
}) => {
  // Create unique ID for each chart instance
  const chartId = useRef<string>(`chart-${Math.random().toString(36).substring(2, 9)}`);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  // Clean up chart instance when component unmounts or when dependencies change
  useEffect(() => {
    // Function to create a new chart instance
    const createChart = () => {
      if (!chartRef.current) return;
      
      // Destroy existing chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      // Configure chart options based on chart type
      const options: ChartOptions<any> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 12,
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle',
              color: '#4B5563',
              font: {
                size: 11,
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#1F2937',
            bodyColor: '#4B5563',
            borderColor: 'rgba(249, 115, 22, 0.3)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 4,
            displayColors: true,
            boxWidth: 8,
            boxHeight: 8,
            boxPadding: 3,
            usePointStyle: true,
            callbacks: {
              label: function(context: {
                dataset: { label?: string };
                parsed: { y: number | null };
              }) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        elements: {
          point: {
            radius: 3,
            hoverRadius: 5,
            backgroundColor: '#fff',
            borderWidth: 2,
            hoverBorderWidth: 2,
          },
          line: {
            tension: 0.3,
          },
          bar: {
            borderWidth: 0,
            borderRadius: 4,
          },
          arc: {
            borderWidth: 1,
            borderColor: '#fff',
          }
        }
      };

      // Add scales for specific chart types
      if (chartType !== 'doughnut') {
        options.scales = {
          x: {
            grid: {
              drawBorder: false,
              display: false,
            },
            ticks: {
              color: '#6B7280',
              padding: 10,
              font: {
                size: 11,
              },
            },
            border: {
              display: false,
            }
          },
          y: {
            grid: {
              color: 'rgba(243, 244, 246, 1)',
              borderDash: [5, 5],
              drawBorder: false,
            },
            ticks: {
              color: '#6B7280',
              padding: 10,
              font: {
                size: 11,
              },
              callback: function(value: number) {
                // Convert large numbers to more readable format with 'Rp' prefix
                return 'Rp' + value.toLocaleString('id-ID');
              }
            },
            border: {
              display: false,
            }
          }
        };
      }

      // Add specific options for doughnut chart
      if (chartType === 'doughnut') {
        options.cutout = '70%';
      }

      // Modify data based on chart type
      let chartData = { ...data };
      
      if (chartType === 'area') {
        // For area charts, modify datasets to include fill
        chartData = {
          ...data,
          datasets: data.datasets.map(dataset => ({
            ...dataset,
            fill: true
          }))
        };
      }

      if (chartType === 'bar') {
        // For bar charts, set bar thickness
        chartData = {
          ...data,
          datasets: data.datasets.map(dataset => ({
            ...dataset,
            barThickness: barThickness
          }))
        };
      }

      // Create the appropriate chart type
      let newChartInstance: ChartJS<any, any, any>;
      switch (chartType) {
        case 'bar':
          newChartInstance = new ChartJS(ctx, {
            type: 'bar',
            data: chartData,
            options: options
          });
          break;
        case 'doughnut':
          newChartInstance = new ChartJS(ctx, {
            type: 'doughnut',
            data: chartData,
            options: options
          });
          break;
        case 'area':
        case 'line':
        default:
          newChartInstance = new ChartJS(ctx, {
            type: 'line',
            data: chartData,
            options: options
          });
          break;
      }

      // Apply gradients if requested
      if (gradient && newChartInstance && (chartType === 'area' || chartType === 'line')) {
        const datasets = newChartInstance.data.datasets;
        
        datasets.forEach((dataset, i) => {
          if (dataset.borderColor) {
            const color = dataset.borderColor.toString();
            const gradient = ctx.createLinearGradient(0, 0, 0, chartHeight);
            
            // Create a gradient from the color
            gradient.addColorStop(0, color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
            gradient.addColorStop(1, color.replace(')', ', 0.0)').replace('rgb', 'rgba'));
            
            // Apply the gradient as background
            newChartInstance.data.datasets[i].backgroundColor = gradient;
          }
        });
        
        newChartInstance.update();
      }

      // Store the chart instance
      chartInstance.current = newChartInstance;
    };

    // Create the chart
    createChart();

    // Clean up function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [chartType, data, gradient, barThickness, chartHeight]); // Re-create chart when these props change

  // Conditional rendering based on hideHeader prop
  if (hideHeader) {
    return (
      <div className={className}>
        <div style={{ height: chartHeight }}>
          <canvas ref={chartRef} id={chartId.current} />
        </div>
      </div>
    );
  }

  // Default render with card wrapper
  return (
    <div className={className}>
      <Card className="overflow-hidden neo-shadow border-orange-100">
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400"></div>
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 pb-3">
          <CardTitle className="text-lg font-bold text-orange-800">{title}</CardTitle>
          {subtitle && <CardDescription className="text-orange-600/70">{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent className="p-4">
          <div style={{ height: chartHeight }}>
            <canvas ref={chartRef} id={chartId.current} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceChart;
