import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConversationHistory } from '@/components/conversation-history';
import type { Conversation } from '@/lib/types';
import * as storage from '@/lib/storage';

// Mock the storage module
jest.mock('@/lib/storage', () => ({
  loadConversations: jest.fn(),
  deleteConversation: jest.fn(),
}));

// Mock window.confirm
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('ConversationHistory', () => {
  const mockOnNewConversation = jest.fn();
  const mockOnLoadConversation = jest.fn();

  const mockConversations: Conversation[] = [
    {
      id: 'conv-1',
      title: 'First Conversation',
      messages: [
        { id: 'msg-1', role: 'user', content: 'Hello' },
        { id: 'msg-2', role: 'ai', content: 'Hi there' },
      ],
      sources: [],
      createdAt: Date.now() - 1000 * 60 * 5, // 5 minutes ago
      updatedAt: Date.now() - 1000 * 60 * 5,
    },
    {
      id: 'conv-2',
      title: 'Second Conversation',
      messages: [
        { id: 'msg-3', role: 'user', content: 'Test' },
      ],
      sources: [],
      createdAt: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
      updatedAt: Date.now() - 1000 * 60 * 60 * 3,
    },
    {
      id: 'conv-3',
      title: 'Old Conversation',
      messages: [
        { id: 'msg-4', role: 'user', content: 'Old message' },
      ],
      sources: [],
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(true);
    (storage.loadConversations as jest.Mock).mockReturnValue([]);
  });

  describe('Rendering', () => {
    it('should render the New Conversation button', () => {
      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      expect(screen.getByRole('button', { name: /new conversation/i })).toBeInTheDocument();
    });

    it('should render empty state when no conversations exist', () => {
      (storage.loadConversations as jest.Mock).mockReturnValue([]);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      expect(screen.getByText('No conversations yet')).toBeInTheDocument();
      expect(screen.getByText(/start chatting to create your first conversation/i)).toBeInTheDocument();
    });

    it('should render list of conversations', () => {
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      expect(screen.getByText('First Conversation')).toBeInTheDocument();
      expect(screen.getByText('Second Conversation')).toBeInTheDocument();
      expect(screen.getByText('Old Conversation')).toBeInTheDocument();
    });

    it('should display message count for each conversation', () => {
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      expect(screen.getByText('2 messages')).toBeInTheDocument(); // First conversation
      const oneMessageElements = screen.getAllByText('1 messages');
      expect(oneMessageElements.length).toBeGreaterThan(0); // Second and third conversations
    });

    it('should highlight active conversation', () => {
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      const { container } = render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId="conv-1"
        />
      );

      const activeConversation = container.querySelector('.bg-primary\\/10');
      expect(activeConversation).toBeInTheDocument();
      expect(activeConversation).toHaveTextContent('First Conversation');
    });
  });

  describe('Date Formatting', () => {
    it('should format date as "Just now" for very recent conversations', () => {
      const recentConversation: Conversation = {
        id: 'conv-recent',
        title: 'Recent Chat',
        messages: [],
        sources: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      (storage.loadConversations as jest.Mock).mockReturnValue([recentConversation]);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      expect(screen.getByText('Just now')).toBeInTheDocument();
    });

    it('should format date as minutes ago', () => {
      (storage.loadConversations as jest.Mock).mockReturnValue([mockConversations[0]]);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      expect(screen.getByText(/5m ago/)).toBeInTheDocument();
    });

    it('should format date as hours ago', () => {
      (storage.loadConversations as jest.Mock).mockReturnValue([mockConversations[1]]);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      expect(screen.getByText(/3h ago/)).toBeInTheDocument();
    });

    it('should format date as days ago', () => {
      (storage.loadConversations as jest.Mock).mockReturnValue([mockConversations[2]]);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      expect(screen.getByText(/2d ago/)).toBeInTheDocument();
    });

    it('should format date as full date for old conversations', () => {
      const oldConversation: Conversation = {
        id: 'conv-old',
        title: 'Very Old Chat',
        messages: [],
        sources: [],
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 days ago
        updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
      };

      (storage.loadConversations as jest.Mock).mockReturnValue([oldConversation]);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      // Should show date in format like "Oct 10" or "Oct 10, 2024"
      const dateElements = screen.getAllByText(/oct|nov|dec|jan|feb|mar|apr|may|jun|jul|aug|sep/i);
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });

  describe('New Conversation Button', () => {
    it('should call onNewConversation when clicked', async () => {
      const user = userEvent.setup();

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      const button = screen.getByRole('button', { name: /new conversation/i });
      await user.click(button);

      expect(mockOnNewConversation).toHaveBeenCalledTimes(1);
    });

    it('should display MessageSquarePlus icon', () => {
      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      const button = screen.getByRole('button', { name: /new conversation/i });
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Load Conversation', () => {
    it('should call onLoadConversation when conversation is clicked', async () => {
      const user = userEvent.setup();
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      const conversationButton = screen.getByRole('button', { name: /first conversation/i });
      await user.click(conversationButton);

      expect(mockOnLoadConversation).toHaveBeenCalledTimes(1);
      expect(mockOnLoadConversation).toHaveBeenCalledWith(mockConversations[0]);
    });

    it('should load conversation on Enter key press', async () => {
      const user = userEvent.setup();
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      const conversationButton = screen.getByRole('button', { name: /first conversation/i });
      conversationButton.focus();
      await user.keyboard('{Enter}');

      expect(mockOnLoadConversation).toHaveBeenCalledWith(mockConversations[0]);
    });

    it('should load conversation on Space key press', async () => {
      const user = userEvent.setup();
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      const conversationButton = screen.getByRole('button', { name: /first conversation/i });
      conversationButton.focus();
      await user.keyboard(' ');

      expect(mockOnLoadConversation).toHaveBeenCalledWith(mockConversations[0]);
    });
  });

  describe('Delete Conversation', () => {
    it('should show delete button for conversations', () => {
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      const deleteButtons = screen.getAllByLabelText(/delete conversation/i);
      expect(deleteButtons).toHaveLength(mockConversations.length);
    });

    it('should show confirm dialog before deleting', async () => {
      const user = userEvent.setup();
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      const deleteButtons = screen.getAllByLabelText(/delete conversation/i);
      await user.click(deleteButtons[0]);

      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this conversation?');
    });

    it('should delete conversation when confirmed', async () => {
      const user = userEvent.setup();
      mockConfirm.mockReturnValue(true);
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      const deleteButtons = screen.getAllByLabelText(/delete conversation/i);
      await user.click(deleteButtons[0]);

      expect(storage.deleteConversation).toHaveBeenCalledWith('conv-1');
    });

    it('should not delete conversation when cancelled', async () => {
      const user = userEvent.setup();
      mockConfirm.mockReturnValue(false);
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      const deleteButtons = screen.getAllByLabelText(/delete conversation/i);
      await user.click(deleteButtons[0]);

      expect(storage.deleteConversation).not.toHaveBeenCalled();
    });

    it('should reload conversations after deletion', async () => {
      const user = userEvent.setup();
      mockConfirm.mockReturnValue(true);
      (storage.loadConversations as jest.Mock)
        .mockReturnValueOnce(mockConversations)
        .mockReturnValueOnce(mockConversations) // Second call from currentConversationId effect
        .mockReturnValueOnce([mockConversations[1], mockConversations[2]]); // After deletion

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      const deleteButtons = screen.getAllByLabelText(/delete conversation/i);
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        // Initial render: 2 calls, after deletion: 1 more call = 3 total
        expect(storage.loadConversations).toHaveBeenCalledTimes(3);
      });
    });

    it('should start new conversation when deleting current conversation', async () => {
      const user = userEvent.setup();
      mockConfirm.mockReturnValue(true);
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId="conv-1"
        />
      );

      const deleteButtons = screen.getAllByLabelText(/delete conversation/i);
      await user.click(deleteButtons[0]);

      expect(mockOnNewConversation).toHaveBeenCalledTimes(1);
    });

    it('should not start new conversation when deleting non-current conversation', async () => {
      const user = userEvent.setup();
      mockConfirm.mockReturnValue(true);
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId="conv-1"
        />
      );

      const deleteButtons = screen.getAllByLabelText(/delete conversation/i);
      await user.click(deleteButtons[1]); // Delete second conversation

      expect(mockOnNewConversation).not.toHaveBeenCalled();
    });

    it('should stop event propagation when delete button is clicked', async () => {
      const user = userEvent.setup();
      mockConfirm.mockReturnValue(true);
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      const deleteButtons = screen.getAllByLabelText(/delete conversation/i);
      await user.click(deleteButtons[0]);

      // onLoadConversation should not be called when delete button is clicked
      expect(mockOnLoadConversation).not.toHaveBeenCalled();
    });
  });

  describe('Effects and Updates', () => {
    it('should load conversations on mount', () => {
      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      // Called twice: once on mount, once when currentConversationId changes (from undefined to null)
      expect(storage.loadConversations).toHaveBeenCalledTimes(2);
    });

    it('should reload conversations when currentConversationId changes', () => {
      const { rerender } = render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      // Initial render: 2 calls (mount + currentConversationId effect)
      expect(storage.loadConversations).toHaveBeenCalledTimes(2);

      rerender(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId="conv-1"
        />
      );

      // After rerender: 3 calls total (initial 2 + 1 more when currentConversationId changes)
      expect(storage.loadConversations).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible delete buttons', () => {
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      const deleteButtons = screen.getAllByLabelText(/delete conversation/i);
      deleteButtons.forEach((button) => {
        expect(button).toHaveAttribute('type', 'button');
        expect(button).toHaveAttribute('aria-label', 'Delete conversation');
      });
    });

    it('should have keyboard navigable conversation items', () => {
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      const conversationButtons = screen.getAllByRole('button');
      // Filter out the "New Conversation" button and delete buttons
      const conversationItems = conversationButtons.filter(
        (button) => !button.textContent?.includes('New Conversation') && button.getAttribute('tabIndex') === '0'
      );

      conversationItems.forEach((item) => {
        expect(item).toHaveAttribute('tabIndex', '0');
        expect(item).toHaveAttribute('role', 'button');
      });
    });

    it('should have screen reader text for delete buttons', () => {
      (storage.loadConversations as jest.Mock).mockReturnValue(mockConversations);

      render(
        <ConversationHistory
          onNewConversation={mockOnNewConversation}
          onLoadConversation={mockOnLoadConversation}
          currentConversationId={null}
        />
      );

      const srTexts = screen.getAllByText('Delete conversation', { selector: '.sr-only' });
      expect(srTexts).toHaveLength(mockConversations.length);
    });
  });
});
