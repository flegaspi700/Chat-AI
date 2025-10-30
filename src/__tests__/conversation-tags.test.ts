/**
 * @jest-environment jsdom
 */

import {
  addTagToConversation,
  removeTagFromConversation,
  getTagColor,
  filterConversationsByTags,
  getAllTags,
  getTagsFromConversations,
} from '@/lib/conversation-tags';
import type { Conversation } from '@/lib/types';

describe('Conversation Tags Logic', () => {
  const mockConversations: Conversation[] = [
    {
      id: '1',
      title: 'Work Project',
      messages: [],
      sources: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: ['work', 'urgent'],
    },
    {
      id: '2',
      title: 'Research Notes',
      messages: [],
      sources: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: ['research', 'personal'],
    },
    {
      id: '3',
      title: 'Meeting Notes',
      messages: [],
      sources: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: ['work', 'meetings'],
    },
    {
      id: '4',
      title: 'No Tags',
      messages: [],
      sources: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  describe('addTagToConversation', () => {
    it('should add a tag to a conversation without tags', () => {
      const conversation: Conversation = {
        ...mockConversations[3],
      };

      const result = addTagToConversation(conversation, 'newtag');

      expect(result.tags).toEqual(['newtag']);
    });

    it('should add a tag to existing tags', () => {
      const conversation: Conversation = {
        ...mockConversations[0],
      };

      const result = addTagToConversation(conversation, 'important');

      expect(result.tags).toContain('important');
      expect(result.tags).toHaveLength(3);
    });

    it('should not add duplicate tags', () => {
      const conversation: Conversation = {
        ...mockConversations[0],
      };

      const result = addTagToConversation(conversation, 'work');

      expect(result.tags).toEqual(['work', 'urgent']);
    });

    it('should normalize tag names to lowercase', () => {
      const conversation: Conversation = {
        ...mockConversations[3],
      };

      const result = addTagToConversation(conversation, 'WorkTag');

      expect(result.tags).toEqual(['worktag']);
    });

    it('should trim whitespace from tags', () => {
      const conversation: Conversation = {
        ...mockConversations[3],
      };

      const result = addTagToConversation(conversation, '  trimmed  ');

      expect(result.tags).toEqual(['trimmed']);
    });

    it('should respect max tag limit of 5', () => {
      const conversation: Conversation = {
        id: '5',
        title: 'Max Tags',
        messages: [],
        sources: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
      };

      const result = addTagToConversation(conversation, 'tag6');

      expect(result.tags).toHaveLength(5);
      expect(result.tags).not.toContain('tag6');
    });

    it('should update updatedAt timestamp', () => {
      const conversation: Conversation = {
        ...mockConversations[3],
        updatedAt: 1000,
      };

      const result = addTagToConversation(conversation, 'newtag');

      expect(result.updatedAt).toBeGreaterThan(1000);
    });
  });

  describe('removeTagFromConversation', () => {
    it('should remove a tag from conversation', () => {
      const conversation: Conversation = {
        ...mockConversations[0],
      };

      const result = removeTagFromConversation(conversation, 'work');

      expect(result.tags).toEqual(['urgent']);
    });

    it('should handle removing non-existent tag', () => {
      const conversation: Conversation = {
        ...mockConversations[0],
      };

      const result = removeTagFromConversation(conversation, 'nonexistent');

      expect(result.tags).toEqual(['work', 'urgent']);
    });

    it('should handle conversation with no tags', () => {
      const conversation: Conversation = {
        ...mockConversations[3],
      };

      const result = removeTagFromConversation(conversation, 'anytag');

      expect(result.tags).toBeUndefined();
    });

    it('should remove last tag cleanly', () => {
      const conversation: Conversation = {
        id: '5',
        title: 'One Tag',
        messages: [],
        sources: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: ['onlytag'],
      };

      const result = removeTagFromConversation(conversation, 'onlytag');

      expect(result.tags).toEqual([]);
    });

    it('should update updatedAt timestamp', () => {
      const conversation: Conversation = {
        ...mockConversations[0],
        updatedAt: 1000,
      };

      const result = removeTagFromConversation(conversation, 'work');

      expect(result.updatedAt).toBeGreaterThan(1000);
    });
  });

  describe('getTagColor', () => {
    it('should return consistent color for same tag', () => {
      const color1 = getTagColor('work');
      const color2 = getTagColor('work');

      expect(color1).toBe(color2);
    });

    it('should return different colors for different tags', () => {
      const color1 = getTagColor('work');
      const color2 = getTagColor('personal');

      expect(color1).not.toBe(color2);
    });

    it('should return valid hex color', () => {
      const color = getTagColor('test');

      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should cycle through predefined colors', () => {
      const colors = new Set();
      for (let i = 0; i < 20; i++) {
        colors.add(getTagColor(`tag${i}`));
      }

      // Should have at least a few different colors but cycling
      expect(colors.size).toBeGreaterThan(5);
      expect(colors.size).toBeLessThanOrEqual(12); // Max 12 predefined colors
    });
  });

  describe('filterConversationsByTags', () => {
    it('should filter by single tag', () => {
      const result = filterConversationsByTags(mockConversations, ['work']);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('3');
    });

    it('should filter by multiple tags (AND logic)', () => {
      const result = filterConversationsByTags(mockConversations, ['work', 'urgent']);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should return empty array if no matches', () => {
      const result = filterConversationsByTags(mockConversations, ['nonexistent']);

      expect(result).toHaveLength(0);
    });

    it('should return all conversations if tags array is empty', () => {
      const result = filterConversationsByTags(mockConversations, []);

      expect(result).toHaveLength(4);
    });

    it('should not match conversations without tags when filtering', () => {
      const result = filterConversationsByTags(mockConversations, ['work']);

      expect(result.some((c) => c.id === '4')).toBe(false);
    });

    it('should handle case-insensitive tag matching', () => {
      const result = filterConversationsByTags(mockConversations, ['WORK']);

      expect(result).toHaveLength(2);
    });
  });

  describe('getTagsFromConversations', () => {
    it('should extract all unique tags', () => {
      const tags = getTagsFromConversations(mockConversations);

      expect(tags).toContain('work');
      expect(tags).toContain('urgent');
      expect(tags).toContain('research');
      expect(tags).toContain('personal');
      expect(tags).toContain('meetings');
    });

    it('should return unique tags only', () => {
      const tags = getTagsFromConversations(mockConversations);

      expect(tags.filter((t) => t === 'work')).toHaveLength(1);
    });

    it('should return empty array if no conversations have tags', () => {
      const conversations: Conversation[] = [mockConversations[3]];
      const tags = getTagsFromConversations(conversations);

      expect(tags).toEqual([]);
    });

    it('should sort tags alphabetically', () => {
      const tags = getTagsFromConversations(mockConversations);

      expect(tags).toEqual(['meetings', 'personal', 'research', 'urgent', 'work']);
    });
  });

  describe('getAllTags', () => {
    it('should return tag metadata with counts', () => {
      const tagMetadata = getAllTags(mockConversations);

      const workTag = tagMetadata.find((t) => t.name === 'work');
      expect(workTag?.count).toBe(2);

      const urgentTag = tagMetadata.find((t) => t.name === 'urgent');
      expect(urgentTag?.count).toBe(1);
    });

    it('should assign colors to tags', () => {
      const tagMetadata = getAllTags(mockConversations);

      tagMetadata.forEach((tag) => {
        expect(tag.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('should include lastUsed timestamp', () => {
      const tagMetadata = getAllTags(mockConversations);

      tagMetadata.forEach((tag) => {
        expect(tag.lastUsed).toBeDefined();
        expect(typeof tag.lastUsed).toBe('number');
      });
    });

    it('should sort by count descending, then name ascending', () => {
      const tagMetadata = getAllTags(mockConversations);

      // Work should be first (count 2)
      expect(tagMetadata[0].name).toBe('work');
      expect(tagMetadata[0].count).toBe(2);
    });

    it('should return empty array if no tags exist', () => {
      const conversations: Conversation[] = [mockConversations[3]];
      const tagMetadata = getAllTags(conversations);

      expect(tagMetadata).toEqual([]);
    });
  });
});
