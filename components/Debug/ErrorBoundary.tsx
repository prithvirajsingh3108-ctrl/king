import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
          <div className="max-w-xl w-full bg-neutral-900 border border-red-900/50 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center space-x-3 text-red-500 mb-4">
                <AlertTriangle size={32} />
                <h1 className="text-2xl font-bold">Something went wrong</h1>
            </div>
            
            <p className="text-gray-300 mb-6">
                The application encountered an unexpected error.
            </p>

            {this.state.error && (
                <div className="bg-black/50 p-4 rounded-lg font-mono text-xs text-red-300 overflow-x-auto mb-6">
                    <p className="font-bold border-b border-red-900/30 pb-2 mb-2">{this.state.error.toString()}</p>
                    <pre>{this.state.errorInfo?.componentStack}</pre>
                </div>
            )}

            <button 
                onClick={() => window.location.reload()}
                className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
            >
                <RefreshCw size={20} />
                <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}