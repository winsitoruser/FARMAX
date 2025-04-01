import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that ensures its children are only rendered on the client side.
 * This helps prevent hydration errors and white blank screens.
 */
const ClientOnly = ({ children, fallback = null }: ClientOnlyProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ClientOnly;
