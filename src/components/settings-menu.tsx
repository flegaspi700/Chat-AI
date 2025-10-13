"use client"

import * as React from "react"
import { Monitor, Moon, Settings, Sun, Trash2 } from "lucide-react"
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
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
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AiThemeGenerator setAiTheme={setAiTheme} />
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Data</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleClearData} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Clear All Data</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
