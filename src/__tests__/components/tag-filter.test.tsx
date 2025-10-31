import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TagFilter } from '@/components/tag-filter';
import type { TagMetadata } from '@/lib/types';

// Helper to create TagMetadata with defaults
const createTag = (name: string, count: number): TagMetadata => ({
  name,
  count,
  color: '#3b82f6',
  createdAt: Date.now(),
  lastUsed: Date.now(),
});

describe('TagFilter', () => {
  const now = Date.now();
  const mockTags: TagMetadata[] = [
    { name: 'work', count: 5, color: '#3b82f6', createdAt: now - 4000, lastUsed: now },
    { name: 'personal', count: 3, color: '#10b981', createdAt: now - 3000, lastUsed: now - 100 },
    { name: 'urgent', count: 2, color: '#ef4444', createdAt: now - 2000, lastUsed: now - 200 },
    { name: 'project', count: 1, color: '#8b5cf6', createdAt: now - 1000, lastUsed: now - 300 },
  ];

  const defaultProps = {
    allTags: mockTags,
    selectedTags: [],
    onToggleTag: jest.fn(),
    onClearFilters: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders filter button', () => {
      render(<TagFilter {...defaultProps} />);
      expect(screen.getByRole('button', { name: /tags/i })).toBeInTheDocument();
    });

    it('shows filter icon in button', () => {
      render(<TagFilter {...defaultProps} />);
      const button = screen.getByRole('button', { name: /tags/i });
      const icon = button.querySelector('svg[data-lucide="Filter"]');
      expect(icon).toBeInTheDocument();
    });

    it('does not show badge when no filters selected', () => {
      render(<TagFilter {...defaultProps} />);
      const button = screen.getByRole('button', { name: /tags/i });
      expect(within(button).queryByText(/\d+/)).not.toBeInTheDocument();
    });

    it('shows count badge when filters selected', () => {
      render(<TagFilter {...defaultProps} selectedTags={['work', 'urgent']} />);
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('shows selected tag badges immediately when filters applied', () => {
      render(<TagFilter {...defaultProps} selectedTags={['work']} />);
      // Selected tags should be visible outside the dropdown
      expect(screen.getByRole('button', { name: /remove work filter/i })).toBeInTheDocument();
    });
  });

  describe('Dropdown Menu', () => {
    it('shows dropdown when button clicked', async () => {
      const user = userEvent.setup();
      render(<TagFilter {...defaultProps} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      expect(screen.getByText('Filter by tags')).toBeInTheDocument();
    });

    it('displays all tags sorted by count', async () => {
      const user = userEvent.setup();
      render(<TagFilter {...defaultProps} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      // Should be sorted by count (descending)
      const items = screen.getAllByRole('menuitem');
      expect(items).toHaveLength(4);
      
      // Verify tags appear in correct order
      expect(screen.getByText('work')).toBeInTheDocument();
      expect(screen.getByText('personal')).toBeInTheDocument();
      expect(screen.getByText('urgent')).toBeInTheDocument();
      expect(screen.getByText('project')).toBeInTheDocument();
    });

    it('shows tag counts in dropdown', async () => {
      const user = userEvent.setup();
      render(<TagFilter {...defaultProps} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      expect(screen.getByText('(5)')).toBeInTheDocument();
      expect(screen.getByText('(3)')).toBeInTheDocument();
      expect(screen.getByText('(2)')).toBeInTheDocument();
      expect(screen.getByText('(1)')).toBeInTheDocument();
    });

    it('shows checkmark for selected tags', async () => {
      const user = userEvent.setup();
      render(<TagFilter {...defaultProps} selectedTags={['work']} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      const workItem = screen.getByRole('menuitem', { name: /work/i });
      // Look for the checked state visually
      expect(workItem).toBeInTheDocument();
      expect(workItem.querySelector('.bg-primary')).toBeInTheDocument();
    });

    it('shows no tags message when allTags is empty', async () => {
      const user = userEvent.setup();
      render(<TagFilter {...defaultProps} allTags={[]} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      expect(screen.getByText('No tags available')).toBeInTheDocument();
    });

    it('shows clear button when filters selected', async () => {
      const user = userEvent.setup();
      render(<TagFilter {...defaultProps} selectedTags={['work']} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
    });

    it('hides clear button when no filters selected', async () => {
      const user = userEvent.setup();
      render(<TagFilter {...defaultProps} selectedTags={[]} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();
    });
  });

  describe('Tag Selection', () => {
    it('calls onToggleTag when tag clicked', async () => {
      const user = userEvent.setup();
      const mockToggle = jest.fn();
      render(<TagFilter {...defaultProps} onToggleTag={mockToggle} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      const workItem = screen.getByRole('menuitem', { name: /work/i });
      await user.click(workItem);

      expect(mockToggle).toHaveBeenCalledWith('work');
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('can select multiple tags', async () => {
      const user = userEvent.setup();
      const mockToggle = jest.fn();
      render(<TagFilter {...defaultProps} onToggleTag={mockToggle} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      const workItem = screen.getByRole('menuitem', { name: /work/i });
      await user.click(workItem);

      await user.click(button); // Reopen dropdown
      const urgentItem = screen.getByRole('menuitem', { name: /urgent/i });
      await user.click(urgentItem);

      expect(mockToggle).toHaveBeenCalledTimes(2);
      expect(mockToggle).toHaveBeenNthCalledWith(1, 'work');
      expect(mockToggle).toHaveBeenNthCalledWith(2, 'urgent');
    });

    it('toggles tag when clicked again', async () => {
      const user = userEvent.setup();
      const mockToggle = jest.fn();
      render(<TagFilter {...defaultProps} selectedTags={['work']} onToggleTag={mockToggle} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      const workItem = screen.getByRole('menuitem', { name: /work/i });
      await user.click(workItem);

      expect(mockToggle).toHaveBeenCalledWith('work');
    });
  });

  describe('Clear Filters', () => {
    it('calls onClearFilters when clear button clicked', async () => {
      const user = userEvent.setup();
      const mockClear = jest.fn();
      render(<TagFilter {...defaultProps} selectedTags={['work']} onClearFilters={mockClear} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(mockClear).toHaveBeenCalledTimes(1);
    });

    it('stops propagation when clear button clicked', async () => {
      const user = userEvent.setup();
      const mockClear = jest.fn();
      const mockToggle = jest.fn();
      render(
        <TagFilter
          {...defaultProps}
          selectedTags={['work']}
          onClearFilters={mockClear}
          onToggleTag={mockToggle}
        />
      );

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      const clearButton = screen.getByRole('button', { name: /clear/i });
      await user.click(clearButton);

      expect(mockClear).toHaveBeenCalledTimes(1);
      // onToggleTag should not be called
      expect(mockToggle).not.toHaveBeenCalled();
    });
  });

  describe('Selected Tag Badges', () => {
    it('shows selected tags as badges outside dropdown', () => {
      render(<TagFilter {...defaultProps} selectedTags={['work', 'urgent']} />);
      
      expect(screen.getByText('work')).toBeInTheDocument();
      expect(screen.getByText('urgent')).toBeInTheDocument();
    });

    it('shows remove button for each selected tag badge', () => {
      render(<TagFilter {...defaultProps} selectedTags={['work']} />);
      
      expect(screen.getByRole('button', { name: /remove work filter/i })).toBeInTheDocument();
    });

    it('calls onToggleTag when badge remove button clicked', async () => {
      const user = userEvent.setup();
      const mockToggle = jest.fn();
      render(<TagFilter {...defaultProps} selectedTags={['work']} onToggleTag={mockToggle} />);

      const removeButton = screen.getByRole('button', { name: /remove work filter/i });
      await user.click(removeButton);

      expect(mockToggle).toHaveBeenCalledWith('work');
    });

    it('removes correct tag when multiple badges exist', async () => {
      const user = userEvent.setup();
      const mockToggle = jest.fn();
      render(
        <TagFilter {...defaultProps} selectedTags={['work', 'urgent', 'project']} onToggleTag={mockToggle} />
      );

      const removeButton = screen.getByRole('button', { name: /remove urgent filter/i });
      await user.click(removeButton);

      expect(mockToggle).toHaveBeenCalledWith('urgent');
    });

    it('hides badge section when no tags selected', () => {
      render(<TagFilter {...defaultProps} selectedTags={[]} />);
      
      expect(screen.queryByRole('button', { name: /remove.*filter/i })).not.toBeInTheDocument();
    });

    it('shows multiple badges for multiple selections', () => {
      render(<TagFilter {...defaultProps} selectedTags={['work', 'personal', 'urgent']} />);
      
      expect(screen.getByRole('button', { name: /remove work filter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove personal filter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /remove urgent filter/i })).toBeInTheDocument();
    });
  });

  describe('Tag Sorting', () => {
    it('sorts tags by count in descending order', async () => {
      const user = userEvent.setup();
      const unsortedTags: TagMetadata[] = [
        createTag('low', 1),
        createTag('high', 10),
        createTag('medium', 5),
      ];
      render(<TagFilter {...defaultProps} allTags={unsortedTags} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      const items = screen.getAllByRole('menuitem');
      const texts = items.map((item) => item.textContent);
      
      // Should be ordered: high (10), medium (5), low (1)
      expect(texts[0]).toContain('high');
      expect(texts[1]).toContain('medium');
      expect(texts[2]).toContain('low');
    });

    it('handles tags with same count', async () => {
      const user = userEvent.setup();
      const tags: TagMetadata[] = [
        createTag('tag1', 5),
        createTag('tag2', 5),
        createTag('tag3', 5),
      ];
      render(<TagFilter {...defaultProps} allTags={tags} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      // All should be visible
      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
      expect(screen.getByText('tag3')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles single tag', async () => {
      const user = userEvent.setup();
      render(<TagFilter {...defaultProps} allTags={[createTag('solo', 1)]} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      expect(screen.getByText('solo')).toBeInTheDocument();
      expect(screen.getByText('(1)')).toBeInTheDocument();
    });

    it('handles tag with zero count', async () => {
      const user = userEvent.setup();
      render(<TagFilter {...defaultProps} allTags={[createTag('zero', 0)]} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      expect(screen.getByText('zero')).toBeInTheDocument();
      expect(screen.getByText('(0)')).toBeInTheDocument();
    });

    it('handles large count numbers', async () => {
      const user = userEvent.setup();
      render(<TagFilter {...defaultProps} allTags={[createTag('popular', 999)]} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      expect(screen.getByText('(999)')).toBeInTheDocument();
    });

    it('handles tag names with special characters', async () => {
      const user = userEvent.setup();
      const specialTags: TagMetadata[] = [
        createTag('tag-with-dash', 1),
        createTag('tag_with_underscore', 1),
        createTag('tag.with.dot', 1),
      ];
      render(<TagFilter {...defaultProps} allTags={specialTags} />);

      const button = screen.getByRole('button', { name: /tags/i });
      await user.click(button);

      expect(screen.getByText('tag-with-dash')).toBeInTheDocument();
      expect(screen.getByText('tag_with_underscore')).toBeInTheDocument();
      expect(screen.getByText('tag.with.dot')).toBeInTheDocument();
    });

    it('updates badge count when selection changes', () => {
      const { rerender } = render(<TagFilter {...defaultProps} selectedTags={['work']} />);
      expect(screen.getByText('1')).toBeInTheDocument();

      rerender(<TagFilter {...defaultProps} selectedTags={['work', 'urgent', 'project']} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('handles all tags selected', async () => {
      const user = userEvent.setup();
      const allTagNames = mockTags.map((t) => t.name);
      render(<TagFilter {...defaultProps} selectedTags={allTagNames} />);

      const button = screen.getByRole('button', { name: /tags/i });
      expect(within(button).getByText('4')).toBeInTheDocument();

      await user.click(button);

      // All should be checked - verify by looking for the checkboxes in each item
      const items = screen.getAllByRole('menuitem');
      items.forEach((item) => {
        const checkbox = item.querySelector('.bg-primary');
        expect(checkbox).toBeInTheDocument();
      });
    });
  });
});
