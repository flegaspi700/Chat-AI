import type { Conversation, TagMetadata } from './types';

// Predefined color palette for tags (12 colors)
const TAG_COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
  '#6366F1', // indigo
  '#84CC16', // lime
  '#06B6D4', // cyan
  '#A855F7', // purple
];

const MAX_TAGS_PER_CONVERSATION = 5;
const MAX_TAG_LENGTH = 20;

/**
 * Add a tag to a conversation
 * @param conversation - Conversation to add tag to
 * @param tag - Tag name to add
 * @returns Updated conversation
 */
export function addTagToConversation(
  conversation: Conversation,
  tag: string
): Conversation {
  // Normalize tag: trim and lowercase
  const normalizedTag = tag.trim().toLowerCase();

  // Don't add if empty
  if (!normalizedTag) {
    return conversation;
  }

  // Truncate to max length
  const truncatedTag = normalizedTag.slice(0, MAX_TAG_LENGTH);

  const currentTags = conversation.tags || [];

  // Don't add duplicates
  if (currentTags.includes(truncatedTag)) {
    return conversation;
  }

  // Respect max tag limit
  if (currentTags.length >= MAX_TAGS_PER_CONVERSATION) {
    return conversation;
  }

  return {
    ...conversation,
    tags: [...currentTags, truncatedTag],
    updatedAt: Date.now(),
  };
}

/**
 * Remove a tag from a conversation
 * @param conversation - Conversation to remove tag from
 * @param tag - Tag name to remove
 * @returns Updated conversation
 */
export function removeTagFromConversation(
  conversation: Conversation,
  tag: string
): Conversation {
  if (!conversation.tags) {
    return conversation;
  }

  const updatedTags = conversation.tags.filter((t) => t !== tag);

  return {
    ...conversation,
    tags: updatedTags,
    updatedAt: Date.now(),
  };
}

/**
 * Get a consistent color for a tag name
 * Uses simple hash function to map tag name to color
 * @param tagName - Name of the tag
 * @returns Hex color string
 */
export function getTagColor(tagName: string): string {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Map to color palette
  const index = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[index];
}

/**
 * Filter conversations by tags (AND logic - must have all tags)
 * @param conversations - Array of conversations
 * @param tags - Array of tag names to filter by
 * @returns Filtered conversations
 */
export function filterConversationsByTags(
  conversations: Conversation[],
  tags: string[]
): Conversation[] {
  if (tags.length === 0) {
    return conversations;
  }

  // Normalize filter tags to lowercase
  const normalizedTags = tags.map((t) => t.toLowerCase());

  return conversations.filter((conversation) => {
    if (!conversation.tags || conversation.tags.length === 0) {
      return false;
    }

    // Check if conversation has ALL the specified tags (AND logic)
    return normalizedTags.every((tag) =>
      conversation.tags!.some((convTag) => convTag.toLowerCase() === tag)
    );
  });
}

/**
 * Extract all unique tags from conversations, sorted alphabetically
 * @param conversations - Array of conversations
 * @returns Array of unique tag names
 */
export function getTagsFromConversations(conversations: Conversation[]): string[] {
  const tagSet = new Set<string>();

  conversations.forEach((conversation) => {
    if (conversation.tags) {
      conversation.tags.forEach((tag) => tagSet.add(tag));
    }
  });

  return Array.from(tagSet).sort();
}

/**
 * Get all tags with metadata (count, color, timestamps)
 * @param conversations - Array of conversations
 * @returns Array of tag metadata sorted by count (desc), then name (asc)
 */
export function getAllTags(conversations: Conversation[]): TagMetadata[] {
  const tagMap = new Map<string, { count: number; lastUsed: number }>();

  conversations.forEach((conversation) => {
    if (conversation.tags) {
      conversation.tags.forEach((tag) => {
        const existing = tagMap.get(tag);
        if (existing) {
          tagMap.set(tag, {
            count: existing.count + 1,
            lastUsed: Math.max(existing.lastUsed, conversation.updatedAt),
          });
        } else {
          tagMap.set(tag, {
            count: 1,
            lastUsed: conversation.updatedAt,
          });
        }
      });
    }
  });

  const tagMetadata: TagMetadata[] = Array.from(tagMap.entries()).map(
    ([name, data]) => ({
      name,
      color: getTagColor(name),
      count: data.count,
      createdAt: Date.now(), // We don't track this separately, use current time
      lastUsed: data.lastUsed,
    })
  );

  // Sort by count descending, then by name ascending
  return tagMetadata.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.name.localeCompare(b.name);
  });
}
