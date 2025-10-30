import '@testing-library/jest-dom';

// Mock environment variables
process.env.GOOGLE_GENAI_API_KEY = 'test-api-key-mock';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(7),
  },
});

// Mock TextEncoder and TextDecoder for jsPDF
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock lucide-react icons as React components
jest.mock('lucide-react', () => {
  const React = require('react');
  return new Proxy({}, {
    get: (target, prop) => {
      return React.forwardRef((props: any, ref: any) =>
        React.createElement('svg', { ...props, ref, 'data-lucide': prop.toString() })
      );
    }
  });
});

// Mock pdfjs-dist to avoid import.meta errors
jest.mock('pdfjs-dist', () => ({
  getDocument: jest.fn(() => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: jest.fn(() => 
        Promise.resolve({
          getTextContent: jest.fn(() => 
            Promise.resolve({
              items: [{ str: 'Mocked PDF content' }],
            })
          ),
        })
      ),
    }),
  })),
  GlobalWorkerOptions: {
    workerSrc: '',
  },
  version: '4.0.0',
}));

// Suppress console errors in tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
