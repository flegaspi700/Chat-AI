"use client"

import * as React from "react"
import { Monitor, Moon, Settings, Sun, Trash2, Keyboard } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AiThemeGenerator } from "./ai-theme-generator"
import type { AITheme } from "@/lib/types"
import { clearAllData } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

interface SettingsMenuProps {
  setAiTheme?: React.Dispatch<React.SetStateAction<AITheme | null>>;
  onClearData?: () => void;
}

export function SettingsMenu({ setAiTheme, onClearData }: SettingsMenuProps) {
  const { setTheme } = useTheme()
  const { toast } = useToast()
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false)

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all saved data? This will remove all messages, sources, and themes.')) {
      clearAllData();
      if (onClearData) {
        onClearData();
      }
      toast({
        title: 'Data cleared',
        description: 'All saved messages, sources, and themes have been removed.',
      });
    }
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings and preferences</p>
          </TooltipContent>
        </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("gray")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>Gray</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AiThemeGenerator setAiTheme={setAiTheme} />
        <DropdownMenuSeparator />
        <Dialog open={shortcutsOpen} onOpenChange={setShortcutsOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Keyboard className="mr-2 h-4 w-4" />
              <span>Keyboard Shortcuts</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Keyboard Shortcuts</DialogTitle>
              <DialogDescription>
                Use these keyboard shortcuts to navigate and interact with DocuNote quickly.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div>
                <h3 className="font-semibold mb-3 text-sm">Navigation</h3>
                <div className="space-y-2">
                  <ShortcutRow 
                    keys={["Ctrl", "K"]} 
                    description="Open conversation search" 
                  />
                  <ShortcutRow 
                    keys={["Esc"]} 
                    description="Close search / Cancel actions" 
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-sm">Actions</h3>
                <div className="space-y-2">
                  <ShortcutRow 
                    keys={["Ctrl", "N"]} 
                    description="Start a new conversation" 
                  />
                  <ShortcutRow 
                    keys={["Ctrl", "E"]} 
                    description="Export current conversation" 
                  />
                  <ShortcutRow 
                    keys={["Ctrl", "Shift", "T"]} 
                    description="Toggle theme" 
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Data</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleClearData} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Clear All Data</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </TooltipProvider>
  )
}

// Helper component for displaying keyboard shortcuts
function ShortcutRow({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{description}</span>
      <div className="flex gap-1">
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-muted-foreground mx-1">+</span>}
            <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">
              {key}
            </kbd>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
