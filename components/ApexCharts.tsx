import React, { useEffect, useState } from 'react';


export default function ApexCharts(props: any) {
  const [Chart, setChart] = useState<any>();
  const hasType = typeof props?.type !== "undefined";

  useEffect(() => {
    import("react-apexcharts").then((mod) => {
      setChart(() => mod.default);
    });
  }, []);

  return hasType && Chart && <Chart {...props} />;
}
