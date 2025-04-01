import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaExpand, FaInfoCircle, FaCog } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  BarController,
  DoughnutController,
  PieController,
  ChartData,
  ChartOptions,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  BarController,
  DoughnutController,
  PieController
);

// Use already registered ChartJS instance
const Chart: typeof ChartJS | null = typeof window !== 'undefined' ? ChartJS : null;

interface AnalyticsChartProps {
  title: string;
  subtitle?: string;
  chartType: 'bar' | 'line' | 'doughnut' | 'area';
  chartHeight?: number;
  data: any;
  colorScheme?: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'orange' | 'amber';
  hasMenu?: boolean;
  className?: string;
  hideHeader?: boolean;
  gradient?: boolean;
  barThickness?: number;
  customGradient?: {
    start: string;
    end: string;
    opacity?: number;
  };
}

const getGradient = (ctx: CanvasRenderingContext2D, chartArea: any, colorScheme: string, customGradient?: {start: string, end: string, opacity?: number}) => {
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
  
  if (customGradient) {
    const opacity = customGradient.opacity || 0.8;
    const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
    
    gradient.addColorStop(0, `${customGradient.start}20`); // Light opacity at bottom
    gradient.addColorStop(1, `${customGradient.end}${opacityHex}`); // Full opacity at top
    return gradient;
  }
  
  switch (colorScheme) {
    case 'primary':
      gradient.addColorStop(0, 'rgba(36, 97, 238, 0.1)');
      gradient.addColorStop(1, 'rgba(36, 97, 238, 0.8)');
      return gradient;
    case 'success':
      gradient.addColorStop(0, 'rgba(29, 201, 183, 0.1)');
      gradient.addColorStop(1, 'rgba(29, 201, 183, 0.8)');
      return gradient;
    case 'info':
      gradient.addColorStop(0, 'rgba(137, 80, 252, 0.1)');
      gradient.addColorStop(1, 'rgba(137, 80, 252, 0.8)');
      return gradient;
    case 'warning':
      gradient.addColorStop(0, 'rgba(255, 184, 34, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 184, 34, 0.8)');
      return gradient;
    case 'danger':
      gradient.addColorStop(0, 'rgba(255, 82, 82, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 82, 82, 0.8)');
      return gradient;
    case 'orange':
      gradient.addColorStop(0, 'rgba(249, 115, 22, 0.1)');
      gradient.addColorStop(1, 'rgba(249, 115, 22, 0.8)');
      return gradient;
    case 'amber':
      gradient.addColorStop(0, 'rgba(245, 158, 11, 0.1)');
      gradient.addColorStop(1, 'rgba(245, 158, 11, 0.8)');
      return gradient;
    default:
      gradient.addColorStop(0, 'rgba(36, 97, 238, 0.1)');
      gradient.addColorStop(1, 'rgba(36, 97, 238, 0.8)');
      return gradient;
  }
};

const getColorForScheme = (colorScheme: string) => {
  switch (colorScheme) {
    case 'primary': return '#2461EE';
    case 'success': return '#1DC9B7';
    case 'info': return '#8950FC';
    case 'warning': return '#FFB822';
    case 'danger': return '#F64E60';
    case 'orange': return '#f97316';
    case 'amber': return '#f59e0b';
    default: return '#2461EE';
  }
};

const getMultipleColors = () => {
  return [
    '#f97316', // orange-500
    '#fb923c', // orange-400
    '#f59e0b', // amber-500
    '#fbbf24', // amber-400
    '#fcd34d', // amber-300
    '#fdba74', // orange-300
    '#fed7aa', // orange-200
  ];
};

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  title,
  subtitle,
  chartType,
  chartHeight = 300,
  data,
  colorScheme = 'primary',
  hasMenu = true,
  className = '',
  hideHeader = false,
  gradient = false,
  barThickness,
  customGradient
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || !Chart) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const isDoughnut = chartType === 'doughnut';
    const isArea = chartType === 'area';
    
    const config: any = {
      type: isArea ? 'line' : chartType,
      data: {
        labels: data.labels || [],
        datasets: isDoughnut ? 
          (data.datasets || []) : 
          (Array.isArray(data.datasets) ? data.datasets : 
           // Handle case where data is in the format {labels, datasetLabel, values}
           data.datasetLabel && Array.isArray(data.values) ? [{
             label: data.datasetLabel,
             data: data.values,
             backgroundColor: getColorForScheme(colorScheme),
             borderColor: getColorForScheme(colorScheme),
           }] : []).map((dataset: any, index: number) => {
            // If multiple datasets provided for line/bar charts, respect their properties
            if (data.datasets && data.datasets.length > 1) {
              return {
                ...dataset,
                backgroundColor: gradient && chartType === 'line' ? function(context: any) {
                  const chart = context.chart;
                  const {ctx, chartArea} = chart;
                  if (!chartArea) return null;
                  
                  // If dataset has its own backgroundColor, use it directly
                  if (dataset.backgroundColor) return dataset.backgroundColor;
                  
                  // Otherwise, use the color from our color array
                  const colorArray = getMultipleColors();
                  const datasetColor = colorArray[index % colorArray.length];
                  
                  // For a line chart, if gradient is enabled
                  if (gradient && chartType === 'line') {
                    // Create gradient based on dataset color
                    const gradientBg = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradientBg.addColorStop(0, `${datasetColor}20`); // 20 = 12% opacity in hex
                    gradientBg.addColorStop(1, `${datasetColor}80`); // 80 = 50% opacity in hex
                    return gradientBg;
                  }
                  
                  return datasetColor;
                } : dataset.backgroundColor || getMultipleColors()[index % getMultipleColors().length],
                borderColor: dataset.borderColor || getMultipleColors()[index % getMultipleColors().length],
              };
            }
            
            // Single dataset behavior (original)
            return {
              ...dataset,
              backgroundColor: gradient && (chartType === 'line' || chartType === 'area') ? function(context: any) {
                const chart = context.chart;
                const {ctx, chartArea} = chart;
                if (!chartArea) return null;
                return getGradient(ctx, chartArea, colorScheme, customGradient);
              } : getColorForScheme(colorScheme),
              borderColor: getColorForScheme(colorScheme),
              fill: chartType === 'area' ? 'origin' : false, // Enable fill for area charts
            };
          })
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: isDoughnut,
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 20,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 10,
            bodyFont: {
              size: 13
            },
            titleFont: {
              size: 14,
              weight: 'bold'
            }
          }
        },
        scales: !isDoughnut ? {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              font: {
                size: 12
              }
            }
          },
          y: {
            grid: {
              borderDash: [3, 3],
              drawBorder: false
            },
            ticks: {
              font: {
                size: 12
              },
              maxTicksLimit: 6,
              padding: 10
            },
            beginAtZero: true
          }
        } : undefined,
        elements: {
          line: {
            tension: 0.4, // Add some curve to the line
          },
          point: {
            radius: chartType === 'area' ? 2 : 3, // Smaller points for area chart
            hitRadius: 10, // Larger hit area for better hover experience
            hoverRadius: 5,
          }
        }
      }
    };
    
    chartInstance.current = new Chart(ctx, config);
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartType, data, colorScheme, title, gradient, barThickness, customGradient]);

  return (
    <Card className={`border shadow-sm h-full ${className}`}>
      {!hideHeader && (
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg font-semibold mb-1">{title}</CardTitle>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
            {hasMenu && (
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <FaInfoCircle className="h-4 w-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <FaCog className="h-4 w-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <FaExpand className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className={hideHeader ? '' : 'pt-4'}>
        <div style={{ height: `${chartHeight}px` }}>
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
