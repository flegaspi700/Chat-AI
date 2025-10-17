import { Dispatch, ReactNode, SetStateAction } from "react";
import { Logo } from "./icons";
import { SettingsMenu } from "./settings-menu";
import { ThemeToggleButton } from "./theme-toggle-button";
import { ConversationTitle } from "./conversation-title";
import type { AITheme } from "@/lib/types";

interface ChatHeaderProps {
  children?: ReactNode;
  setAiTheme?: Dispatch<SetStateAction<AITheme | null>>;
  onClearData?: () => void;
  conversationTitle?: string;
  onTitleChange?: (newTitle: string) => void;
  isNewConversation?: boolean;
}

export function ChatHeader({ 
  children, 
  setAiTheme, 
  onClearData,
  conversationTitle = "New Conversation",
  onTitleChange,
  isNewConversation = true,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b p-4">
      {children}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Logo className="h-6 w-6" />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <h1 className="text-lg font-bold font-headline">FileChat AI</h1>
        {onTitleChange ? (
          <ConversationTitle
            title={conversationTitle}
            onTitleChange={onTitleChange}
            isNewConversation={isNewConversation}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Chat with your documents</p>
        )}
      </div>
      <ThemeToggleButton />
      <SettingsMenu setAiTheme={setAiTheme} onClearData={onClearData} />
    </header>
  );
}
