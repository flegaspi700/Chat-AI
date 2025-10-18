/**
 * Error Logging Utility
 * 
 * Provides centralized error logging with context and metadata.
 * Can be extended to send errors to external services (Sentry, LogRocket, etc.)
 */

export interface ErrorContext {
  componentStack?: string;
  errorBoundary?: boolean;
  userAction?: string;
  fileName?: string;
  timestamp?: string;
  url?: string;
  userAgent?: string;
  [key: string]: unknown;
}

export interface ErrorLog {
  message: string;
  stack?: string;
  name: string;
  timestamp: string;
  context: ErrorContext;
  level: 'error' | 'warning' | 'info';
}

/**
 * Store recent errors in memory for debugging
 */
const errorHistory: ErrorLog[] = [];
const MAX_ERROR_HISTORY = 50;

/**
 * Main error logging function
 */
export function logError(
  error: Error | string,
  context: ErrorContext = {},
  level: 'error' | 'warning' | 'info' = 'error'
): void {
  const errorLog: ErrorLog = {
    message: typeof error === 'string' ? error : error.message,
    stack: typeof error === 'object' ? error.stack : undefined,
    name: typeof error === 'object' ? error.name : 'Error',
    timestamp: new Date().toISOString(),
    context: {
      ...context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    },
    level,
  };

  // Add to error history
  errorHistory.push(errorLog);
  if (errorHistory.length > MAX_ERROR_HISTORY) {
    errorHistory.shift();
  }

  // Console logging with color coding
  if (typeof console !== 'undefined') {
    const consoleMethod = level === 'error' ? console.error : level === 'warning' ? console.warn : console.log;
    
    consoleMethod(
      `[${level.toUpperCase()}] ${errorLog.timestamp}`,
      `\n  Message: ${errorLog.message}`,
      errorLog.stack ? `\n  Stack: ${errorLog.stack}` : '',
      `\n  Context:`, errorLog.context
    );
  }

  // Send to external error tracking service (if configured)
  sendToErrorService(errorLog);

  // Store in localStorage for persistence (optional)
  persistErrorLog(errorLog);
}

/**
 * Log a warning
 */
export function logWarning(message: string, context?: ErrorContext): void {
  logError(message, context, 'warning');
}

/**
 * Log an info message
 */
export function logInfo(message: string, context?: ErrorContext): void {
  logError(message, context, 'info');
}

/**
 * Get recent error history
 */
export function getErrorHistory(): ErrorLog[] {
  return [...errorHistory];
}

/**
 * Clear error history
 */
export function clearErrorHistory(): void {
  errorHistory.length = 0;
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('error-logs');
  }
}

/**
 * Send errors to external service (Sentry, LogRocket, etc.)
 * Currently a placeholder - implement based on your service
 */
function sendToErrorService(errorLog: ErrorLog): void {
  // Example: Send to Sentry
  // if (typeof Sentry !== 'undefined') {
  //   Sentry.captureException(new Error(errorLog.message), {
  //     extra: errorLog.context,
  //   });
  // }

  // Example: Send to custom API endpoint
  // if (errorLog.level === 'error') {
  //   fetch('/api/log-error', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(errorLog),
  //   }).catch(() => {
  //     // Silently fail - don't want error logging to cause more errors
  //   });
  // }

  // For now, just log to console that we would send it
  if (process.env.NODE_ENV === 'development') {
    console.log('[Error Logger] Would send to external service:', errorLog.message);
  }
}

/**
 * Persist error logs to localStorage
 */
function persistErrorLog(errorLog: ErrorLog): void {
  if (typeof localStorage === 'undefined') return;

  try {
    const stored = localStorage.getItem('error-logs');
    const logs: ErrorLog[] = stored ? JSON.parse(stored) : [];
    
    logs.push(errorLog);
    
    // Keep only last 20 errors
    if (logs.length > 20) {
      logs.shift();
    }
    
    localStorage.setItem('error-logs', JSON.stringify(logs));
  } catch (error) {
    // Silently fail - localStorage might be full or unavailable
    console.warn('Failed to persist error log:', error);
  }
}

/**
 * Get persisted error logs from localStorage
 */
export function getPersistedErrorLogs(): ErrorLog[] {
  if (typeof localStorage === 'undefined') return [];

  try {
    const stored = localStorage.getItem('error-logs');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to retrieve error logs:', error);
    return [];
  }
}

/**
 * Format error for display
 */
export function formatError(error: Error | string): string {
  if (typeof error === 'string') {
    return error;
  }

  let formatted = `${error.name}: ${error.message}`;
  
  if (error.stack) {
    // Get first 3 lines of stack trace
    const stackLines = error.stack.split('\n').slice(0, 3);
    formatted += '\n' + stackLines.join('\n');
  }

  return formatted;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: Error): boolean {
  return (
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('Failed to fetch') ||
    error.name === 'NetworkError'
  );
}

/**
 * Check if error is a timeout
 */
export function isTimeoutError(error: Error): boolean {
  return (
    error.message.includes('timeout') ||
    error.message.includes('timed out') ||
    error.name === 'TimeoutError'
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: Error | string): string {
  const message = typeof error === 'string' ? error : error.message;

  // Network errors
  if (typeof error === 'object' && isNetworkError(error)) {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Timeout errors
  if (typeof error === 'object' && isTimeoutError(error)) {
    return 'The request took too long. Please try again.';
  }

  // Parse errors
  if (message.includes('JSON') || message.includes('parse')) {
    return 'We received an unexpected response. Please try again.';
  }

  // File errors
  if (message.includes('file') || message.includes('File')) {
    return 'There was a problem with the file. Please try a different file.';
  }

  // Generic fallback
  return 'Something went wrong. Please try again or contact support if the problem persists.';
}

/**
 * Download error logs as JSON file (for debugging)
 */
export function downloadErrorLogs(): void {
  const logs = getPersistedErrorLogs();
  const dataStr = JSON.stringify(logs, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `error-logs-${new Date().toISOString()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
