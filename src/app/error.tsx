'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logError } from '@/lib/error-logger';

/**
 * Next.js Error Component
 * 
 * This file handles errors that occur during server-side rendering
 * or in the root layout. It's automatically used by Next.js when
 * an error occurs in the app directory.
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to error tracking service
    logError(error, {
      digest: error.digest,
      errorPage: true,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    });
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-headline">
            Oops! Something went wrong
          </h1>
          <p className="text-muted-foreground">
            We encountered an unexpected error. Don't worry, your data is safe.
          </p>
        </div>

        {/* Error Details (Development Only) */}
        {isDevelopment && error && (
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 mb-3">
              <Bug className="h-4 w-4" />
              View Error Details (Development)
            </summary>
            <div className="rounded-lg border bg-muted p-4 text-left">
              <div className="mb-2">
                <span className="text-xs font-semibold text-muted-foreground">Error:</span>
                <p className="text-sm font-mono text-destructive mt-1">
                  {error.name}: {error.message}
                </p>
              </div>
              
              {error.digest && (
                <div className="mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">Digest:</span>
                  <p className="text-sm font-mono mt-1">{error.digest}</p>
                </div>
              )}

              {error.stack && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">Stack Trace:</span>
                  <pre className="text-xs font-mono mt-1 overflow-auto max-h-40 text-muted-foreground whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} size="lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="outline"
            size="lg"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-muted-foreground">
          If the problem persists, try clearing your browser cache or contact support.
        </p>
      </div>
    </div>
  );
}
