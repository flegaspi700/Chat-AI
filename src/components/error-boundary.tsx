'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logError } from '@/lib/error-logger';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  FallbackComponent?: React.ComponentType<ErrorFallbackProps>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  resetError: () => void;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * @example With custom fallback
 * <ErrorBoundary FallbackComponent={CustomErrorUI}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to console and external service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to error tracking service
    logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error boundary when resetKeys change
    if (this.state.hasError && this.props.resetKeys) {
      const prevKeys = prevProps.resetKeys || [];
      const currentKeys = this.props.resetKeys;
      
      const hasResetKeyChanged = currentKeys.some(
        (key, index) => key !== prevKeys[index]
      );

      if (hasResetKeyChanged) {
        this.resetError();
      }
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback component
      if (this.props.FallbackComponent) {
        const FallbackComponent = this.props.FallbackComponent;
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            resetError={this.resetError}
          />
        );
      }

      // Custom fallback element
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 * 
 * Displays a user-friendly error message with options to retry or go home.
 */
function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-6">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
      
      <p className="text-muted-foreground mb-6 max-w-md">
        We encountered an unexpected error. Don't worry, your data is safe.
        Try refreshing or contact support if the problem persists.
      </p>

      {error && (
        <details className="mb-6 text-left w-full max-w-md">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground mb-2">
            Technical Details
          </summary>
          <div className="rounded-lg border bg-muted p-4 text-xs font-mono overflow-auto max-h-40">
            <div className="text-destructive font-semibold mb-2">
              {error.name}: {error.message}
            </div>
            {error.stack && (
              <pre className="text-muted-foreground whitespace-pre-wrap">
                {error.stack}
              </pre>
            )}
          </div>
        </details>
      )}

      <div className="flex gap-3">
        <Button onClick={resetError} variant="default">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          <Home className="mr-2 h-4 w-4" />
          Go Home
        </Button>
      </div>
    </div>
  );
}

/**
 * Minimal Error Fallback for compact spaces
 */
export function MinimalErrorFallback({ error, resetError }: ErrorFallbackProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center border rounded-lg bg-destructive/5">
      <AlertTriangle className="h-6 w-6 text-destructive mb-3" />
      <p className="text-sm text-muted-foreground mb-3">
        {error?.message || 'An error occurred'}
      </p>
      <Button onClick={resetError} size="sm" variant="outline">
        <RefreshCw className="mr-2 h-3 w-3" />
        Retry
      </Button>
    </div>
  );
}

/**
 * Chat-specific Error Fallback
 */
export function ChatErrorFallback({ error, resetError }: ErrorFallbackProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">Chat Error</h3>
      
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        The chat encountered an error. Your messages are saved. Try refreshing the chat.
      </p>

      <Button onClick={resetError} size="sm">
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh Chat
      </Button>
    </div>
  );
}

/**
 * Sidebar-specific Error Fallback
 */
export function SidebarErrorFallback({ resetError }: ErrorFallbackProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <AlertTriangle className="h-8 w-8 text-destructive mb-3" />
      <p className="text-sm text-muted-foreground mb-3">
        Unable to load sources
      </p>
      <Button onClick={resetError} size="sm" variant="outline">
        <RefreshCw className="mr-2 h-3 w-3" />
        Reload
      </Button>
    </div>
  );
}

/**
 * Hook to manually trigger error boundary (for testing)
 */
export function useThrowError() {
  const [error, setError] = React.useState<Error | null>(null);

  if (error) {
    throw error;
  }

  return (errorToThrow: Error) => {
    setError(errorToThrow);
  };
}
