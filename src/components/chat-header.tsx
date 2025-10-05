import { ReactNode } from "react";
import { Logo } from "./icons";
import { ThemeToggle } from "./theme-toggle";

export function ChatHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="flex items-center gap-3 border-b p-4">
      {children}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Logo className="h-6 w-6" />
      </div>
      <div className="flex-1 flex flex-col">
        <h1 className="text-lg font-bold font-headline">FileChat AI</h1>
        <p className="text-sm text-muted-foreground">Chat with your documents</p>
      </div>
      <ThemeToggle />
    </header>
  );
}
