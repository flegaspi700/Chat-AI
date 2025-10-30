import type { Message } from './types';

/**
 * Edit a message's content and add edit metadata
 * @param messages - Array of messages
 * @param messageId - ID of message to edit
 * @param newContent - New content for the message
 * @returns New array of messages with the edited message
 */
export function editMessage(
  messages: Message[],
  messageId: string,
  newContent: string
): Message[] {
  return messages.map((message) => {
    if (message.id === messageId) {
      return {
        ...message,
        content: newContent,
        editedAt: Date.now(),
        // Store original content only on first edit
        originalContent: message.originalContent || message.content,
      };
    }
    return message;
  });
}

/**
 * Remove all messages that come after the specified message
 * @param messages - Array of messages
 * @param messageId - ID of message to truncate after
 * @returns New array of messages up to and including the specified message
 */
export function truncateMessagesAfter(
  messages: Message[],
  messageId: string
): Message[] {
  const index = messages.findIndex((m) => m.id === messageId);
  
  if (index === -1) {
    return [];
  }
  
  return messages.slice(0, index + 1);
}

/**
 * Determine if a confirmation dialog should be shown before editing
 * Shows confirmation if more than 2 messages would be deleted
 * @param messages - Array of messages
 * @param messageId - ID of message being edited
 * @returns True if confirmation should be shown
 */
export function shouldShowConfirmation(
  messages: Message[],
  messageId: string
): boolean {
  const index = messages.findIndex((m) => m.id === messageId);
  
  if (index === -1) {
    return false;
  }
  
  const messagesAfter = messages.length - index - 1;
  return messagesAfter > 2;
}
