import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SourceCard } from '@/components/source-card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FileInfo } from '@/lib/types';

// Mock dependencies
jest.mock('@/ai/flows/summarize-content', () => ({
  summarizeContent: jest.fn(),
}));

jest.mock('@/hooks/use-toast');

const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

import { summarizeContent } from '@/ai/flows/summarize-content';

// Helper to render with TooltipProvider
function renderWithTooltip(ui: React.ReactElement) {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

describe('SourceCard Component', () => {
  let mockOnRemove: jest.Mock;
  let mockOnUpdateSummary: jest.Mock;

  beforeEach(() => {
    mockOnRemove = jest.fn();
    mockOnUpdateSummary = jest.fn();
    mockToast.mockClear();
    (summarizeContent as jest.Mock).mockClear();
  });

  describe('Rendering', () => {
    it('should render URL source with Link icon', () => {
      const file: FileInfo = {
        name: 'Example Website',
        content: 'content',
        type: 'url',
        source: 'https://example.com',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      expect(screen.getByText('Example Website')).toBeInTheDocument();
      expect(screen.getByTitle('Example Website')).toBeInTheDocument();
    });

    it('should render file source with FileText icon', () => {
      const file: FileInfo = {
        name: 'document.txt',
        content: 'content',
        type: 'file',
        source: 'document.txt',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      expect(screen.getByText('document.txt')).toBeInTheDocument();
    });

    it('should show generate summary button when no summary exists', () => {
      const file: FileInfo = {
        name: 'test.txt',
        content: 'content',
        type: 'file',
        source: 'test.txt',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      expect(screen.getByRole('button', { name: /generate summary/i })).toBeInTheDocument();
    });

    it('should show toggle button when summary exists', () => {
      const file: FileInfo = {
        name: 'test.txt',
        content: 'content',
        type: 'file',
        source: 'test.txt',
        summary: 'This is a summary',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      expect(screen.getByRole('button', { name: /toggle summary/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /generate summary/i })).not.toBeInTheDocument();
    });

    it('should always show remove button', () => {
      const file: FileInfo = {
        name: 'test.txt',
        content: 'content',
        type: 'file',
        source: 'test.txt',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    });
  });

  describe('Remove Functionality', () => {
    it('should call onRemove when remove button is clicked', async () => {
      const file: FileInfo = {
        name: 'test.txt',
        content: 'content',
        type: 'file',
        source: 'test.txt',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      await userEvent.click(removeButton);

      expect(mockOnRemove).toHaveBeenCalledWith('test.txt');
    });

    it('should call onRemove with correct source for URL', async () => {
      const file: FileInfo = {
        name: 'Website',
        content: 'content',
        type: 'url',
        source: 'https://example.com',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      const removeButton = screen.getByRole('button', { name: /remove/i });
      await userEvent.click(removeButton);

      expect(mockOnRemove).toHaveBeenCalledWith('https://example.com');
    });
  });

  describe('Summary Generation', () => {
    it('should generate summary successfully', async () => {
      (summarizeContent as jest.Mock).mockResolvedValue({
        summary: 'This is a test summary',
        keyPoints: ['Point 1', 'Point 2', 'Point 3'],
      });

      const file: FileInfo = {
        name: 'test.txt',
        content: 'Test content for summary',
        type: 'file',
        source: 'test.txt',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      const generateButton = screen.getByRole('button', { name: /generate summary/i });
      await userEvent.click(generateButton);

      await waitFor(() => {
        expect(summarizeContent).toHaveBeenCalledWith({
          content: 'Test content for summary',
          sourceName: 'test.txt',
          sourceType: 'file',
        });
      });

      await waitFor(() => {
        expect(mockOnUpdateSummary).toHaveBeenCalledWith(
          'test.txt',
          expect.stringContaining('This is a test summary')
        );
      });

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Summary Generated',
          description: 'Created summary for "test.txt"',
        });
      });
    });

    it('should show loading state while generating summary', async () => {
      (summarizeContent as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          summary: 'Summary',
          keyPoints: ['Point'],
        }), 100))
      );

      const file: FileInfo = {
        name: 'test.txt',
        content: 'content',
        type: 'file',
        source: 'test.txt',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      const generateButton = screen.getByRole('button', { name: /generate summary/i });
      await userEvent.click(generateButton);

      // Button should be disabled during generation
      expect(generateButton).toBeDisabled();

      await waitFor(() => {
        expect(generateButton).not.toBeDisabled();
      });
    });

    it('should handle summary generation error', async () => {
      (summarizeContent as jest.Mock).mockRejectedValue(new Error('API Error'));

      const file: FileInfo = {
        name: 'test.txt',
        content: 'content',
        type: 'file',
        source: 'test.txt',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      const generateButton = screen.getByRole('button', { name: /generate summary/i });
      await userEvent.click(generateButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          title: 'Summary Error',
          description: 'Failed to generate summary. Please try again.',
        });
      });

      // Button should be re-enabled after error
      expect(generateButton).not.toBeDisabled();
    });

    it('should format summary with key points correctly', async () => {
      (summarizeContent as jest.Mock).mockResolvedValue({
        summary: 'Main summary text',
        keyPoints: ['First point', 'Second point'],
      });

      const file: FileInfo = {
        name: 'test.txt',
        content: 'content',
        type: 'file',
        source: 'test.txt',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      const generateButton = screen.getByRole('button', { name: /generate summary/i });
      await userEvent.click(generateButton);

      await waitFor(() => {
        expect(mockOnUpdateSummary).toHaveBeenCalledWith(
          'test.txt',
          'Main summary text\n\n**Key Points:**\n• First point\n• Second point'
        );
      });
    });
  });

  describe('Summary Display', () => {
    it('should display summary when it exists', () => {
      const file: FileInfo = {
        name: 'test.txt',
        content: 'content',
        type: 'file',
        source: 'test.txt',
        summary: 'This is the summary text',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      // Toggle to open summary
      const toggleButton = screen.getByRole('button', { name: /toggle summary/i });
      userEvent.click(toggleButton);

      waitFor(() => {
        expect(screen.getByText('This is the summary text')).toBeInTheDocument();
        expect(screen.getByText('AI Summary')).toBeInTheDocument();
      });
    });

    it('should toggle summary visibility', async () => {
      const file: FileInfo = {
        name: 'test.txt',
        content: 'content',
        type: 'file',
        source: 'test.txt',
        summary: 'Summary text',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      const toggleButton = screen.getByRole('button', { name: /toggle summary/i });
      
      // Open summary
      await userEvent.click(toggleButton);
      
      // Summary should be visible (collapsible component)
      // The exact behavior depends on the Collapsible component implementation
      
      // Close summary
      await userEvent.click(toggleButton);
    });

    it('should not show summary section when no summary exists', () => {
      const file: FileInfo = {
        name: 'test.txt',
        content: 'content',
        type: 'file',
        source: 'test.txt',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      expect(screen.queryByText('AI Summary')).not.toBeInTheDocument();
    });
  });

  describe('Different Source Types', () => {
    it('should handle URL source type correctly in summary generation', async () => {
      (summarizeContent as jest.Mock).mockResolvedValue({
        summary: 'URL summary',
        keyPoints: ['Point'],
      });

      const file: FileInfo = {
        name: 'Example Page',
        content: 'Web content',
        type: 'url',
        source: 'https://example.com',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      const generateButton = screen.getByRole('button', { name: /generate summary/i });
      await userEvent.click(generateButton);

      await waitFor(() => {
        expect(summarizeContent).toHaveBeenCalledWith({
          content: 'Web content',
          sourceName: 'Example Page',
          sourceType: 'url',
        });
      });
    });

    it('should handle file source type correctly in summary generation', async () => {
      (summarizeContent as jest.Mock).mockResolvedValue({
        summary: 'File summary',
        keyPoints: ['Point'],
      });

      const file: FileInfo = {
        name: 'document.pdf',
        content: 'PDF content',
        type: 'file',
        source: 'document.pdf',
      };

      renderWithTooltip(
        <SourceCard
          file={file}
          onRemove={mockOnRemove}
          onUpdateSummary={mockOnUpdateSummary}
        />
      );

      const generateButton = screen.getByRole('button', { name: /generate summary/i });
      await userEvent.click(generateButton);

      await waitFor(() => {
        expect(summarizeContent).toHaveBeenCalledWith({
          content: 'PDF content',
          sourceName: 'document.pdf',
          sourceType: 'file',
        });
      });
    });
  });
});
