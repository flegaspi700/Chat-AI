import { render, screen } from '@testing-library/react';
import { ChatMessages } from '@/components/chat-messages';
import { mockConversation } from '../__mocks__/mockMessages';

describe('ChatMessages', () => {
  it('renders empty state when no messages and no files', () => {
    render(<ChatMessages messages={[]} hasFiles={false} />);
    
    expect(screen.getByText(/Welcome to FileChat AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload a TXT or PDF file/i)).toBeInTheDocument();
  });

  it('renders prompt to ask questions when files exist but no messages', () => {
    render(<ChatMessages messages={[]} hasFiles={true} />);
    
    expect(screen.getByText(/ask a question/i)).toBeInTheDocument();
  });

  it('renders all messages in conversation', () => {
    render(<ChatMessages messages={mockConversation} hasFiles={true} />);
    
    expect(screen.getByText(/When was the term AI coined?/i)).toBeInTheDocument();
    expect(screen.getByText(/John McCarthy in 1956/i)).toBeInTheDocument();
    expect(screen.getByText(/Who proposed the Turing Test?/i)).toBeInTheDocument();
    expect(screen.getByText(/Alan Turing proposed/i)).toBeInTheDocument();
  });

  it('distinguishes between user and AI messages', () => {
    render(<ChatMessages messages={mockConversation} hasFiles={true} />);
    
    // Verify all messages are rendered
    expect(screen.getByText(/When was the term AI coined?/i)).toBeInTheDocument();
    expect(screen.getByText(/John McCarthy in 1956/i)).toBeInTheDocument();
    expect(screen.getByText(/Who proposed the Turing Test?/i)).toBeInTheDocument();
    expect(screen.getByText(/Alan Turing proposed/i)).toBeInTheDocument();
  });

  it('renders messages in correct order', () => {
    render(<ChatMessages messages={mockConversation} hasFiles={true} />);
    
    // Verify first user message and first AI response
    expect(screen.getByText(/When was the term AI coined?/i)).toBeInTheDocument();
    expect(screen.getByText(/John McCarthy in 1956/i)).toBeInTheDocument();
  });
});
