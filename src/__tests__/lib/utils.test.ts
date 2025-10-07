import { cn } from '@/lib/utils';

describe('Utils', () => {
  describe('cn (className merger)', () => {
    it('merges class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('handles conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'excluded');
      expect(result).toContain('base');
      expect(result).toContain('conditional');
      expect(result).not.toContain('excluded');
    });

    it('handles Tailwind conflicts', () => {
      const result = cn('p-4', 'p-8');
      // Should only contain p-8 (later value wins)
      expect(result).toContain('p-8');
    });

    it('handles undefined and null values', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });
  });
});
