import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInputForm } from '@/components/chat-input-form';

describe('ChatInputForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the input form', () => {
    render(<ChatInputForm onSubmit={mockOnSubmit} isPending={false} />);
    
    const input = screen.getByPlaceholderText(/ask a question/i);
    expect(input).toBeInTheDocument();
  });

  it('submits the form when user types and presses enter', async () => {
    const user = userEvent.setup();
    render(<ChatInputForm onSubmit={mockOnSubmit} isPending={false} />);
    
    const input = screen.getByPlaceholderText(/ask a question/i);
    await user.type(input, 'What is AI?{Enter}');
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('What is AI?');
    });
  });

  it('does not submit empty messages', async () => {
    const user = userEvent.setup();
    render(<ChatInputForm onSubmit={mockOnSubmit} isPending={false} />);
    
    const input = screen.getByPlaceholderText(/ask a question/i);
    await user.type(input, '   {Enter}');
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('disables input when pending', () => {
    render(<ChatInputForm onSubmit={mockOnSubmit} isPending={true} />);
    
    const input = screen.getByPlaceholderText(/ask a question/i);
    expect(input).toBeDisabled();
  });

  it('clears input after successful submission', async () => {
    const user = userEvent.setup();
    render(<ChatInputForm onSubmit={mockOnSubmit} isPending={false} />);
    
    const input = screen.getByPlaceholderText(/ask a question/i) as HTMLInputElement;
    await user.type(input, 'Test question{Enter}');
    
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
});
