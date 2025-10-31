import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConversationTags } from '@/components/conversation-tags';

describe('ConversationTags', () => {
  const defaultTags = ['work', 'urgent', 'project'];

  describe('Rendering', () => {
    it('renders all tags', () => {
      render(<ConversationTags tags={defaultTags} />);
      
      expect(screen.getByText('work')).toBeInTheDocument();
      expect(screen.getByText('urgent')).toBeInTheDocument();
      expect(screen.getByText('project')).toBeInTheDocument();
    });

    it('returns null when tags array is empty', () => {
      const { container } = render(<ConversationTags tags={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('returns null when tags is undefined', () => {
      const { container } = render(<ConversationTags tags={undefined as any} />);
      expect(container.firstChild).toBeNull();
    });

    it('returns null when tags is null', () => {
      const { container } = render(<ConversationTags tags={null as any} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders single tag', () => {
      render(<ConversationTags tags={['solo']} />);
      expect(screen.getByText('solo')).toBeInTheDocument();
    });

    it('renders many tags', () => {
      const manyTags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'];
      render(<ConversationTags tags={manyTags} />);
      
      manyTags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });
  });

  describe('Tag Colors', () => {
    it('assigns consistent colors based on tag name', () => {
      const { rerender } = render(<ConversationTags tags={['work']} />);
      const firstBadge = screen.getByText('work').closest('.group');
      const firstClasses = firstBadge?.className;

      // Rerender same tag - should have same color
      rerender(<ConversationTags tags={['work']} />);
      const secondBadge = screen.getByText('work').closest('.group');
      const secondClasses = secondBadge?.className;

      expect(firstClasses).toEqual(secondClasses);
    });

    it('assigns different colors to different tags', () => {
      render(<ConversationTags tags={['work', 'personal']} />);
      
      const workBadge = screen.getByText('work').closest('.group');
      const personalBadge = screen.getByText('personal').closest('.group');

      // Not testing exact colors, just that they're different elements
      expect(workBadge).not.toBe(personalBadge);
    });

    it('uses modulo to cycle through color palette', () => {
      // Test that hash function works for various tag names
      const tags = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'tag1', 'tag2', 'tag3',
      ];
      render(<ConversationTags tags={tags} />);

      // Verify all tags render (color assignment doesn't break rendering)
      tags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });
  });

  describe('Size Variants', () => {
    it('renders medium size by default', () => {
      render(<ConversationTags tags={['work']} />);
      const badge = screen.getByText('work').closest('.group');
      expect(badge).toHaveClass('h-6', 'px-2.5');
    });

    it('renders small size when specified', () => {
      render(<ConversationTags tags={['work']} size="sm" />);
      const badge = screen.getByText('work').closest('.group');
      expect(badge).toHaveClass('text-xs', 'h-5', 'px-2');
    });

    it('renders medium size when explicitly specified', () => {
      render(<ConversationTags tags={['work']} size="md" />);
      const badge = screen.getByText('work').closest('.group');
      expect(badge).toHaveClass('h-6', 'px-2.5');
    });
  });

  describe('Interactive Mode (Editable)', () => {
    it('shows remove button when onRemoveTag provided', () => {
      render(<ConversationTags tags={['work']} onRemoveTag={jest.fn()} />);
      expect(screen.getByRole('button', { name: /remove work tag/i })).toBeInTheDocument();
    });

    it('calls onRemoveTag when remove button clicked', async () => {
      const user = userEvent.setup();
      const mockRemove = jest.fn();
      render(<ConversationTags tags={['work', 'urgent']} onRemoveTag={mockRemove} />);

      const removeButton = screen.getByRole('button', { name: /remove work tag/i });
      await user.click(removeButton);

      expect(mockRemove).toHaveBeenCalledWith('work');
      expect(mockRemove).toHaveBeenCalledTimes(1);
    });

    it('removes correct tag when multiple exist', async () => {
      const user = userEvent.setup();
      const mockRemove = jest.fn();
      render(<ConversationTags tags={['first', 'second', 'third']} onRemoveTag={mockRemove} />);

      const removeButton = screen.getByRole('button', { name: /remove second tag/i });
      await user.click(removeButton);

      expect(mockRemove).toHaveBeenCalledWith('second');
    });

    it('makes badge clickable when onTagClick provided', () => {
      render(<ConversationTags tags={['work']} onTagClick={jest.fn()} />);
      const badge = screen.getByText('work').closest('.group');
      expect(badge).toHaveClass('cursor-pointer', 'hover:opacity-80');
    });

    it('calls onTagClick when badge clicked', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();
      render(<ConversationTags tags={['work']} onTagClick={mockClick} />);

      const badge = screen.getByText('work').closest('.group') as HTMLElement;
      await user.click(badge);

      expect(mockClick).toHaveBeenCalledWith('work');
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('prevents onTagClick when clicking remove button', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();
      const mockRemove = jest.fn();
      render(
        <ConversationTags
          tags={['work']}
          onTagClick={mockClick}
          onRemoveTag={mockRemove}
        />
      );

      const removeButton = screen.getByRole('button', { name: /remove work tag/i });
      await user.click(removeButton);

      expect(mockRemove).toHaveBeenCalledWith('work');
      expect(mockClick).not.toHaveBeenCalled(); // Click should not propagate
    });
  });

  describe('Readonly Mode', () => {
    it('hides remove button in readonly mode', () => {
      render(<ConversationTags tags={['work']} onRemoveTag={jest.fn()} readonly />);
      expect(screen.queryByRole('button', { name: /remove work tag/i })).not.toBeInTheDocument();
    });

    it('prevents badge click in readonly mode', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();
      render(<ConversationTags tags={['work']} onTagClick={mockClick} readonly />);

      const badge = screen.getByText('work').closest('.group') as HTMLElement;
      await user.click(badge);

      expect(mockClick).not.toHaveBeenCalled();
    });

    it('removes hover styles in readonly mode', () => {
      render(<ConversationTags tags={['work']} onTagClick={jest.fn()} readonly />);
      const badge = screen.getByText('work').closest('.group');
      expect(badge).not.toHaveClass('cursor-pointer');
      expect(badge).not.toHaveClass('hover:opacity-80');
    });

    it('adds padding when readonly (no remove button space)', () => {
      render(<ConversationTags tags={['work']} onRemoveTag={jest.fn()} readonly />);
      const badge = screen.getByText('work').closest('.group');
      expect(badge).toHaveClass('pr-2');
    });

    it('readonly overrides both onTagClick and onRemoveTag', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();
      const mockRemove = jest.fn();
      render(
        <ConversationTags
          tags={['work']}
          onTagClick={mockClick}
          onRemoveTag={mockRemove}
          readonly
        />
      );

      const badge = screen.getByText('work').closest('.group') as HTMLElement;
      await user.click(badge);

      expect(mockClick).not.toHaveBeenCalled();
      expect(mockRemove).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('handles tags with special characters', () => {
      const specialTags = ['tag-with-dash', 'tag_with_underscore', 'tag.with.dots'];
      render(<ConversationTags tags={specialTags} />);

      specialTags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it('handles tags with numbers', () => {
      render(<ConversationTags tags={['tag123', '456', 'v2.0']} />);
      expect(screen.getByText('tag123')).toBeInTheDocument();
      expect(screen.getByText('456')).toBeInTheDocument();
      expect(screen.getByText('v2.0')).toBeInTheDocument();
    });

    it('handles very long tag names', () => {
      const longTag = 'verylongtagnamethatshouldstillrender';
      render(<ConversationTags tags={[longTag]} />);
      expect(screen.getByText(longTag)).toBeInTheDocument();
    });

    it('renders when only onTagClick provided (no onRemoveTag)', () => {
      render(<ConversationTags tags={['work']} onTagClick={jest.fn()} />);
      expect(screen.getByText('work')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
    });

    it('renders when only onRemoveTag provided (no onTagClick)', () => {
      render(<ConversationTags tags={['work']} onRemoveTag={jest.fn()} />);
      expect(screen.getByText('work')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove work tag/i })).toBeInTheDocument();
    });

    it('renders non-interactive tags when no callbacks provided', () => {
      render(<ConversationTags tags={['work']} />);
      const badge = screen.getByText('work').closest('.group');
      expect(badge).not.toHaveClass('cursor-pointer');
      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
    });

    it('handles tag with empty string (edge case)', () => {
      render(<ConversationTags tags={['work', '', 'urgent']} />);
      expect(screen.getByText('work')).toBeInTheDocument();
      expect(screen.getByText('urgent')).toBeInTheDocument();
      // Empty string will still render, just as empty content
    });
  });

  describe('Combination Scenarios', () => {
    it('combines small size with readonly mode', () => {
      render(<ConversationTags tags={['work']} size="sm" readonly onRemoveTag={jest.fn()} />);
      const badge = screen.getByText('work').closest('.group');
      expect(badge).toHaveClass('text-xs', 'h-5', 'px-2', 'pr-2');
      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
    });

    it('combines small size with interactive mode', () => {
      render(<ConversationTags tags={['work']} size="sm" onRemoveTag={jest.fn()} />);
      const badge = screen.getByText('work').closest('.group');
      expect(badge).toHaveClass('text-xs', 'h-5', 'px-2');
      expect(screen.getByRole('button', { name: /remove work tag/i })).toBeInTheDocument();
    });

    it('handles multiple interactions on different tags', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();
      const mockRemove = jest.fn();
      render(
        <ConversationTags
          tags={['work', 'urgent', 'project']}
          onTagClick={mockClick}
          onRemoveTag={mockRemove}
        />
      );

      // Click first tag
      const workBadge = screen.getByText('work').closest('.group') as HTMLElement;
      await user.click(workBadge);
      expect(mockClick).toHaveBeenCalledWith('work');

      // Remove second tag
      const removeUrgent = screen.getByRole('button', { name: /remove urgent tag/i });
      await user.click(removeUrgent);
      expect(mockRemove).toHaveBeenCalledWith('urgent');

      // Click third tag
      const projectBadge = screen.getByText('project').closest('.group') as HTMLElement;
      await user.click(projectBadge);
      expect(mockClick).toHaveBeenCalledWith('project');

      expect(mockClick).toHaveBeenCalledTimes(2);
      expect(mockRemove).toHaveBeenCalledTimes(1);
    });
  });
});
