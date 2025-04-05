import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface RechartsAreaChartProps {
  data: Array<Record<string, any>>;
  xAxisDataKey: string;
  areas: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
  height?: number | string;
  width?: number | string;
  formatter?: (value: number) => string;
}

/**
 * RechartsAreaChart
 * 
 * A component to render beautiful area charts with the orange/amber gradient theme
 */
const RechartsAreaChart: React.FC<RechartsAreaChartProps> = ({ 
  data,
  xAxisDataKey,
  areas,
  height = 350,
  width = '100%',
  formatter
}) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  if (!isMounted) {
    return (
      <div 
        style={{ height: typeof height === 'number' ? `${height}px` : height, width }} 
        className="flex items-center justify-center"
      >
        <div className="h-10 w-10 rounded-full border-3 border-t-transparent border-orange-500 animate-spin"></div>
      </div>
    );
  }

  // Generate color gradients for the areas
  const getGradientColors = () => {
    const colors = ["#f97316", "#fb923c", "#fdba74", "#fbbf24", "#fed7aa"];
    return areas.map((area, index) => ({
      ...area,
      color: area.color || colors[index % colors.length]
    }));
  };

  const areasWithColors = getGradientColors();

  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          {areasWithColors.map((area) => (
            <linearGradient 
              key={`gradient-${area.dataKey}`} 
              id={`color${area.dataKey}`} 
              x1="0" y1="0" x2="0" y2="1"
            >
              <stop offset="5%" stopColor={area.color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={area.color} stopOpacity={0.1}/>
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
        <XAxis 
          dataKey={xAxisDataKey} 
          tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fill: '#666' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fill: '#666' }}
          tickFormatter={formatter}
        />
        <Tooltip 
          formatter={formatter}
          contentStyle={{
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
            borderRadius: '4px'
          }}
        />
        <Legend 
          wrapperStyle={{
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif'
          }}
        />
        {areasWithColors.map((area) => (
          <Area 
            key={area.dataKey}
            type="monotone" 
            dataKey={area.dataKey} 
            name={area.name}
            stroke={area.color} 
            fillOpacity={1} 
            fill={`url(#color${area.dataKey})`} 
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RechartsAreaChart;
