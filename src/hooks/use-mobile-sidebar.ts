import { useEffect } from 'react';
import { useIsMobile } from './use-mobile';

/**
 * Custom hook to handle mobile sidebar behavior
 * 
 * On mobile devices, the sidebar should:
 * - Auto-close after selecting a source
 * - Close when tapping outside
 * - Be swipe-able
 */
export function useMobileSidebar(
  isOpen: boolean,
  setIsOpen: (open: boolean) => void,
  deps: React.DependencyList = []
) {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Auto-close sidebar on mobile when dependencies change
    // (e.g., when a file is added or URL is scraped)
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, isMobile]);

  return { isMobile };
}
