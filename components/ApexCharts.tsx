import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ApexCharts with SSR disabled
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-[230px]">
      <div className="text-sm text-gray-500">Memuat chart...</div>
    </div>
  )
});

export default function ApexCharts(props: any) {
  // Check if we're in browser environment
  const [isBrowser, setIsBrowser] = useState(false);
  
  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined');
  }, []);

  // If not in browser or no type provided, show loading or nothing
  if (!isBrowser) {
    return (
      <div className="flex justify-center items-center h-[230px]">
        <div className="text-sm text-gray-500">Memuat chart...</div>
      </div>
    );
  }

  // If we have a type, render the chart
  return props.type ? <ReactApexChart {...props} /> : null;
}
