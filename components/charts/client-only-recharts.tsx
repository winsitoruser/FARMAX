import React, { useState, useEffect } from 'react';

/**
 * Props for the ClientOnlyRecharts component
 */
interface ClientOnlyRechartsProps {
  children: React.ReactNode;
  height?: string | number;
  width?: string | number;
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * ClientOnlyRecharts
 * 
 * A wrapper component that ensures Recharts components only render on the client side.
 * Prevents "Cannot read properties of undefined (reading 'node')" and other DOM-related
 * errors during server-side rendering.
 */
const ClientOnlyRecharts: React.FC<ClientOnlyRechartsProps> = ({ 
  children, 
  height = '100%', 
  width = '100%', 
  fallback,
  className = ''
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    return () => {
      // Add cleanup if needed in the future
    };
  }, []);

  if (!isMounted) {
    if (fallback) {
      return <div className={className}>{fallback}</div>;
    }
    
    return (
      <div 
        className={`flex justify-center items-center ${className}`} 
        style={{ 
          height: typeof height === 'number' ? `${height}px` : height,
          width: typeof width === 'number' ? `${width}px` : width 
        }}
      >
        <div className="h-10 w-10 rounded-full border-3 border-t-transparent border-orange-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div 
      className={className} 
      style={{ 
        height: typeof height === 'number' ? `${height}px` : height,
        width: typeof width === 'number' ? `${width}px` : width 
      }}
    >
      {children}
    </div>
  );
};

export default ClientOnlyRecharts;
