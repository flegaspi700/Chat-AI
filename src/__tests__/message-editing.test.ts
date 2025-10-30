/**
 * @jest-environment jsdom
 */

import { editMessage, truncateMessagesAfter, shouldShowConfirmation } from '@/lib/message-editing';
import type { Message } from '@/lib/types';

describe('Message Editing Logic', () => {
  describe('editMessage', () => {
    it('should update message content', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'Hello' },
        { id: '2', role: 'ai', content: 'Hi there!' },
      ];

      const result = editMessage(messages, '1', 'Hello, how are you?');

      expect(result[0].content).toBe('Hello, how are you?');
    });

    it('should preserve message ID when editing', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'Hello' },
      ];

      const result = editMessage(messages, '1', 'Updated content');

      expect(result[0].id).toBe('1');
    });

    it('should add editedAt timestamp', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'Hello' },
      ];

      const result = editMessage(messages, '1', 'Updated');

      expect(result[0].editedAt).toBeDefined();
      expect(typeof result[0].editedAt).toBe('number');
    });

    it('should store original content on first edit', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'Original' },
      ];

      const result = editMessage(messages, '1', 'Edited');

      expect(result[0].originalContent).toBe('Original');
    });

    it('should preserve original content on subsequent edits', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'Second edit', originalContent: 'Original' },
      ];

      const result = editMessage(messages, '1', 'Third edit');

      expect(result[0].originalContent).toBe('Original');
    });

    it('should not modify other messages', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'First' },
        { id: '2', role: 'ai', content: 'Second' },
        { id: '3', role: 'user', content: 'Third' },
      ];

      const result = editMessage(messages, '2', 'Updated second');

      expect(result[0]).toEqual(messages[0]);
      expect(result[2]).toEqual(messages[2]);
    });

    it('should return new array reference', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'Hello' },
      ];

      const result = editMessage(messages, '1', 'Updated');

      expect(result).not.toBe(messages);
    });
  });

  describe('truncateMessagesAfter', () => {
    it('should remove all messages after specified message', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'First' },
        { id: '2', role: 'ai', content: 'Second' },
        { id: '3', role: 'user', content: 'Third' },
        { id: '4', role: 'ai', content: 'Fourth' },
      ];

      const result = truncateMessagesAfter(messages, '2');

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should return empty array if message not found', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'First' },
      ];

      const result = truncateMessagesAfter(messages, 'nonexistent');

      expect(result).toHaveLength(0);
    });

    it('should return all messages if truncating after last message', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'First' },
        { id: '2', role: 'ai', content: 'Second' },
      ];

      const result = truncateMessagesAfter(messages, '2');

      expect(result).toHaveLength(2);
    });

    it('should return new array reference', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'First' },
        { id: '2', role: 'ai', content: 'Second' },
      ];

      const result = truncateMessagesAfter(messages, '1');

      expect(result).not.toBe(messages);
    });
  });

  describe('shouldShowConfirmation', () => {
    it('should return true if more than 2 messages would be deleted', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'First' },
        { id: '2', role: 'ai', content: 'Second' },
        { id: '3', role: 'user', content: 'Third' },
        { id: '4', role: 'ai', content: 'Fourth' },
        { id: '5', role: 'user', content: 'Fifth' },
      ];

      const result = shouldShowConfirmation(messages, '1');

      expect(result).toBe(true);
    });

    it('should return false if 2 or fewer messages would be deleted', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'First' },
        { id: '2', role: 'ai', content: 'Second' },
        { id: '3', role: 'user', content: 'Third' },
      ];

      const result = shouldShowConfirmation(messages, '1');

      expect(result).toBe(false);
    });

    it('should return false if editing last message', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'First' },
        { id: '2', role: 'ai', content: 'Second' },
      ];

      const result = shouldShowConfirmation(messages, '2');

      expect(result).toBe(false);
    });

    it('should return false if message not found', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'First' },
      ];

      const result = shouldShowConfirmation(messages, 'nonexistent');

      expect(result).toBe(false);
    });
  });
});
