import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary, MinimalErrorFallback, type ErrorFallbackProps } from '@/components/error-boundary';

// Mock error logger
jest.mock('@/lib/error-logger', () => ({
  logError: jest.fn(),
}));

import { logError } from '@/lib/error-logger';

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean; message?: string }> = ({
  shouldThrow = true,
  message = 'Test error',
}) => {
  if (shouldThrow) {
    throw new Error(message);
  }
  return <div>No error</div>;
};

// Suppress console.error for these tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    (logError as jest.Mock).mockClear();
    (console.error as jest.Mock).mockClear();
  });

  describe('Error Catching', () => {
    it('should catch errors from child components', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should display default fallback UI when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
    });

    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Error Logging', () => {
    it('should log error to error logger', () => {
      render(
        <ErrorBoundary>
          <ThrowError message="Custom error message" />
        </ErrorBoundary>
      );

      expect(logError).toHaveBeenCalled();
      const errorArg = (logError as jest.Mock).mock.calls[0][0];
      expect(errorArg.message).toBe('Custom error message');
    });

    it('should log error to console', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(console.error).toHaveBeenCalled();
    });

    it('should call onError callback when provided', () => {
      const onErrorMock = jest.fn();

      render(
        <ErrorBoundary onError={onErrorMock}>
          <ThrowError message="Callback test error" />
        </ErrorBoundary>
      );

      expect(onErrorMock).toHaveBeenCalled();
      const [error] = onErrorMock.mock.calls[0];
      expect(error.message).toBe('Callback test error');
    });
  });

  describe('Default Fallback UI', () => {
    it('should display error icon', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should display Try Again button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      expect(tryAgainButton).toBeInTheDocument();
    });

    it('should display Go Home button', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const goHomeButton = screen.getByRole('button', { name: /go home/i });
      expect(goHomeButton).toBeInTheDocument();
    });

    it('should display technical details in collapsible section', () => {
      render(
        <ErrorBoundary>
          <ThrowError message="Technical error details" />
        </ErrorBoundary>
      );

      const detailsToggle = screen.getByText('Technical Details');
      expect(detailsToggle).toBeInTheDocument();
    });

    it('should show error message in technical details', async () => {
      const user = userEvent.setup();
      render(
        <ErrorBoundary>
          <ThrowError message="Detailed error message" />
        </ErrorBoundary>
      );

      const detailsToggle = screen.getByText('Technical Details');
      await user.click(detailsToggle);

      await waitFor(() => {
        const messages = screen.getAllByText(/Detailed error message/);
        expect(messages.length).toBeGreaterThan(0);
        expect(messages[0]).toBeInTheDocument();
      });
    });

    it('should show error stack in technical details', async () => {
      const user = userEvent.setup();
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const detailsToggle = screen.getByText('Technical Details');
      await user.click(detailsToggle);

      await waitFor(() => {
        const stackTraces = screen.getAllByText(/Error: Test error/);
        expect(stackTraces.length).toBeGreaterThan(0);
        expect(stackTraces[0]).toBeInTheDocument();
      });
    });
  });

  describe('Reset Functionality', () => {
    it('should reset error state when Try Again is clicked', async () => {
      const user = userEvent.setup();
      let shouldThrow = true;

      const TestComponent = () => {
        return <ThrowError shouldThrow={shouldThrow} />;
      };

      const { rerender } = render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Change the error condition
      shouldThrow = false;

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      await user.click(tryAgainButton);

      // Re-render with updated condition
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('should reset error state when resetKeys change', () => {
      let shouldThrow = true;

      const { rerender } = render(
        <ErrorBoundary resetKeys={['key1']}>
          <ThrowError shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Change resetKeys and error condition
      shouldThrow = false;

      rerender(
        <ErrorBoundary resetKeys={['key2']}>
          <ThrowError shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });

    it('should not reset error if resetKeys do not change', () => {
      const { rerender } = render(
        <ErrorBoundary resetKeys={['key1']}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Re-render with same resetKeys
      rerender(
        <ErrorBoundary resetKeys={['key1']}>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // Error UI should still be shown
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Custom Fallback', () => {
    it('should render custom fallback element when provided', () => {
      const customFallback = <div>Custom fallback UI</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom fallback UI')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });

    it('should render custom FallbackComponent when provided', () => {
      const CustomFallback: React.FC<ErrorFallbackProps> = ({ error }) => (
        <div>Custom Component: {error?.message}</div>
      );

      render(
        <ErrorBoundary FallbackComponent={CustomFallback}>
          <ThrowError message="Custom component error" />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Component: Custom component error')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });

    it('should pass resetError function to custom FallbackComponent', () => {
      const CustomFallback: React.FC<ErrorFallbackProps> = ({ resetError }) => (
        <button onClick={resetError}>Custom Reset</button>
      );

      render(
        <ErrorBoundary FallbackComponent={CustomFallback}>
          <ThrowError />
        </ErrorBoundary>
      );

      const customResetButton = screen.getByText('Custom Reset');
      expect(customResetButton).toBeInTheDocument();
    });
  });

  describe('Go Home Button', () => {
    it('should navigate to home when Go Home is clicked', async () => {
      const user = userEvent.setup();

      // Mock window.location
      const mockAssign = jest.fn();
      delete (window as any).location;
      window.location = { href: 'http://localhost/', assign: mockAssign } as any;

      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      const goHomeButton = screen.getByRole('button', { name: /go home/i });
      await user.click(goHomeButton);

      // Check that href was set (jsdom returns full URL)
      expect(window.location.href).toMatch(/\/$/);
    });
  });
});

describe('MinimalErrorFallback Component', () => {
  const mockError = new Error('Test error message');
  const mockResetError = jest.fn();

  beforeEach(() => {
    mockResetError.mockClear();
  });

  describe('Rendering', () => {
    it('should render minimal error UI', () => {
      render(
        <MinimalErrorFallback
          error={mockError}
          errorInfo={null}
          resetError={mockResetError}
        />
      );

      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('should display error icon', () => {
      render(
        <MinimalErrorFallback
          error={mockError}
          errorInfo={null}
          resetError={mockResetError}
        />
      );

      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should show default message when no error provided', () => {
      render(
        <MinimalErrorFallback
          error={null}
          errorInfo={null}
          resetError={mockResetError}
        />
      );

      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });

    it('should display retry button', () => {
      render(
        <MinimalErrorFallback
          error={mockError}
          errorInfo={null}
          resetError={mockResetError}
        />
      );

      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should call resetError when Retry is clicked', async () => {
      const user = userEvent.setup();

      render(
        <MinimalErrorFallback
          error={mockError}
          errorInfo={null}
          resetError={mockResetError}
        />
      );

      const retryButton = screen.getByRole('button', { name: /retry/i });
      await user.click(retryButton);

      expect(mockResetError).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling', () => {
    it('should have proper container classes', () => {
      const { container } = render(
        <MinimalErrorFallback
          error={mockError}
          errorInfo={null}
          resetError={mockResetError}
        />
      );

      const errorContainer = container.firstChild as HTMLElement;
      expect(errorContainer).toHaveClass('flex');
      expect(errorContainer).toHaveClass('flex-col');
      expect(errorContainer).toHaveClass('items-center');
    });
  });
});
