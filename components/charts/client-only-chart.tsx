import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface ClientOnlyChartProps {
  data: Array<Record<string, any>>;
  xAxisDataKey: string;
  areas: Array<{
    dataKey: string;
    name: string;
    color: string;
    gradientId?: string;
  }>;
  height?: number | string;
  width?: number | string;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  formatter?: (value: number) => string;
}

/**
 * ClientOnlyChart
 * 
 * A component that ensures AreaChart from Recharts is only rendered on the client side
 * to prevent SSR rendering issues.
 */
const ClientOnlyChart: React.FC<ClientOnlyChartProps> = ({ 
  data,
  xAxisDataKey,
  areas,
  height = 350,
  width = '100%',
  margin = { top: 10, right: 30, left: 0, bottom: 0 },
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

  return (
    <ResponsiveContainer width={width} height={height}>
      <AreaChart
        data={data}
        margin={margin}
      >
        <defs>
          {areas.map((area, index) => (
            <linearGradient 
              key={`gradient-${area.dataKey}`} 
              id={area.gradientId || `color${area.dataKey}`} 
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
        {areas.map((area, index) => (
          <Area 
            key={area.dataKey}
            type="monotone" 
            dataKey={area.dataKey} 
            name={area.name}
            stroke={area.color} 
            fillOpacity={1} 
            fill={`url(#${area.gradientId || `color${area.dataKey}`})`} 
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ClientOnlyChart;
