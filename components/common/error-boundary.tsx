import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      errorInfo
    });
    // Log more detailed error information to help with debugging
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-5 text-center border rounded-lg bg-gray-50">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">
            Maaf, terjadi kesalahan saat memuat komponen ini.
          </p>
          <div className="text-left bg-gray-100 p-4 rounded mb-6 max-w-full overflow-auto">
            <p className="font-medium text-red-600 mb-2">{this.state.error?.message || 'Unknown error'}</p>
            {this.state.errorInfo && (
              <details className="mt-2">
                <summary className="text-sm font-medium text-blue-600 cursor-pointer">Lihat detail teknis</summary>
                <pre className="text-xs text-gray-700 mt-2 whitespace-pre-wrap overflow-auto max-h-64">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
          <div className="flex space-x-4">
            <Button onClick={this.resetError} variant="default">
              Coba Lagi
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Halaman
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
