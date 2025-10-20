import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsMenu } from '@/components/theme-toggle';

// Mock next-themes
const mockSetTheme = jest.fn();
jest.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
    theme: 'light',
    systemTheme: 'light',
  }),
}));

describe('SettingsMenu Component', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  describe('Rendering', () => {
    it('should render settings button', () => {
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have accessible label', () => {
      render(<SettingsMenu />);
      
      const label = screen.getByText('Settings');
      expect(label).toBeInTheDocument();
    });

    it('should show settings icon', () => {
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Dropdown Menu', () => {
    it('should open menu when button is clicked', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      // Wait for dropdown to open
      await waitFor(() => {
        expect(screen.getByText('Theme')).toBeInTheDocument();
      });
    });

    it('should display all theme options', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Light')).toBeInTheDocument();
        expect(screen.getByText('Dark')).toBeInTheDocument();
        expect(screen.getByText('System')).toBeInTheDocument();
        // Gray theme is also available
        const grayOption = screen.getAllByText('Gray');
        expect(grayOption[0]).toBeInTheDocument();
      });
    });

    it('should display theme label', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        const label = screen.getByText('Theme');
        expect(label).toBeInTheDocument();
      });
    });

    it('should show separator after label', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        const separator = document.querySelector('[role="separator"]');
        expect(separator).toBeInTheDocument();
      });
    });
  });

  describe('Theme Switching', () => {
    it('should switch to light theme when Light is clicked', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        const lightOption = screen.getByText('Light');
        expect(lightOption).toBeInTheDocument();
      });
      
      const lightOption = screen.getByText('Light');
      await user.click(lightOption);
      
      expect(mockSetTheme).toHaveBeenCalledWith('light');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('should switch to dark theme when Dark is clicked', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        const darkOption = screen.getByText('Dark');
        expect(darkOption).toBeInTheDocument();
      });
      
      const darkOption = screen.getByText('Dark');
      await user.click(darkOption);
      
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('should switch to gray theme when Gray is clicked', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        const grayOptions = screen.getAllByText('Gray');
        expect(grayOptions[0]).toBeInTheDocument();
      });
      
      const grayOptions = screen.getAllByText('Gray');
      await user.click(grayOptions[0]);
      
      expect(mockSetTheme).toHaveBeenCalledWith('gray');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('should switch to system theme when System is clicked', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        const systemOption = screen.getByText('System');
        expect(systemOption).toBeInTheDocument();
      });
      
      const systemOption = screen.getByText('System');
      await user.click(systemOption);
      
      expect(mockSetTheme).toHaveBeenCalledWith('system');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icons', () => {
    it('should display Sun icon for Light theme option', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        const lightItem = screen.getByText('Light').closest('[role="menuitem"]');
        expect(lightItem).toBeInTheDocument();
        // Check for SVG icon
        const icon = lightItem?.querySelector('svg');
        expect(icon).toBeInTheDocument();
      });
    });

    it('should display Moon icon for Dark theme option', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        const darkItem = screen.getByText('Dark').closest('[role="menuitem"]');
        expect(darkItem).toBeInTheDocument();
        // Check for SVG icon
        const icon = darkItem?.querySelector('svg');
        expect(icon).toBeInTheDocument();
      });
    });

    it('should display Monitor icon for Gray theme option', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        const grayItems = screen.getAllByText('Gray');
        const grayItem = grayItems[0].closest('[role="menuitem"]');
        expect(grayItem).toBeInTheDocument();
        // Check for SVG icon
        const icon = grayItem?.querySelector('svg');
        expect(icon).toBeInTheDocument();
      });
    });

    it('should display Monitor icon for System theme option', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        const systemItem = screen.getByText('System').closest('[role="menuitem"]');
        expect(systemItem).toBeInTheDocument();
        // Check for SVG icon
        const icon = systemItem?.querySelector('svg');
        expect(icon).toBeInTheDocument();
      });
    });
  });

  describe('User Interaction', () => {
    it('should not call setTheme before any option is clicked', () => {
      render(<SettingsMenu />);
      
      expect(mockSetTheme).not.toHaveBeenCalled();
    });

    it('should close menu after selecting a theme', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByText('Light')).toBeInTheDocument();
      });
      
      const lightOption = screen.getByText('Light');
      await user.click(lightOption);
      
      // Menu should close after selection
      await waitFor(() => {
        expect(screen.queryByText('Theme')).not.toBeInTheDocument();
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      
      // Tab to button
      await user.tab();
      expect(button).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('should have proper button role', () => {
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should have screen reader text', () => {
      render(<SettingsMenu />);
      
      const srText = screen.getByText('Settings');
      expect(srText).toHaveClass('sr-only');
    });

    it('should have menu items with proper role', async () => {
      const user = userEvent.setup();
      render(<SettingsMenu />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        const menuItems = screen.getAllByRole('menuitem');
        expect(menuItems.length).toBeGreaterThanOrEqual(4); // At least 4 theme options
      });
    });
  });
});
