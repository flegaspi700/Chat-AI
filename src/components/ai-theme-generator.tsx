"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useTheme } from "next-themes";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { generateAITheme } from "@/app/actions";
import type { AITheme } from "@/lib/types";
import { fetchUnsplashImage, generateGradientFallback } from "@/lib/unsplash";

interface AiThemeGeneratorProps {
  setAiTheme?: Dispatch<SetStateAction<AITheme | null>>;
}

export function AiThemeGenerator({ setAiTheme }: AiThemeGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { setTheme, themes, resolvedTheme } = useTheme();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!setAiTheme) return;

    setIsGenerating(true);
    const result = await generateAITheme(prompt);

    if (result.error || !result.theme) {
      setIsGenerating(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "Could not generate theme.",
      });
      return;
    }

    const { themeName, palette, imageHint } = result.theme;
    const themeId = `ai-${themeName.replace(/\s+/g, '-')}`;

    // Fetch background image from Unsplash
    const backgroundImageUrl = await fetchUnsplashImage(imageHint);
    const backgroundStyle = backgroundImageUrl 
      ? `url(${backgroundImageUrl})`
      : generateGradientFallback(palette.primary, palette.accent);

    setIsGenerating(false);

    // Remove any existing AI theme style elements
    document.querySelectorAll('[id^="theme-ai-"]').forEach((el) => el.remove());

    // Create a new style element
    const style = document.createElement('style');
    style.id = `theme-${themeId}`;
    style.innerHTML = `
      html[data-theme='${themeId}'] {
        --background: ${palette.background};
        --foreground: ${palette.foreground};
        --card: ${palette.card};
        --card-foreground: ${palette.foreground};
        --popover: ${palette.card};
        --popover-foreground: ${palette.foreground};
        --primary: ${palette.primary};
        --primary-foreground: ${palette.primaryForeground};
        --secondary: ${palette.secondary};
        --secondary-foreground: ${palette.foreground};
        --muted: ${palette.secondary};
        --muted-foreground: ${palette.foreground};
        --accent: ${palette.accent};
        --accent-foreground: ${palette.primaryForeground};
        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 0 0% 98%;
        --border: ${palette.border};
        --input: ${palette.border};
        --ring: ${palette.primary};
      }
      
      html[data-theme='${themeId}'] body {
        background-image: ${backgroundStyle};
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        background-repeat: no-repeat;
      }
      
      html[data-theme='${themeId}'] body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: hsl(${palette.background} / 0.85);
        z-index: -1;
      }
    `;
    
    // Add the new theme to the head
    document.head.appendChild(style);

    // Update parent state with background image URL
    setAiTheme({ 
      id: themeId, 
      name: themeName, 
      imageHint,
      backgroundImageUrl: backgroundImageUrl || undefined
    });

    // Update next-themes by adding the new theme to the list and setting it
    if (!themes.includes(themeId)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const newThemes = [...themes, themeId];
        // Force re-render with theme switches (known next-themes workaround)
        setTheme('light'); 
        setTheme('dark');
        setTimeout(() => {
            // @ts-expect-error - resolvedTheme may not be a valid theme string
            setTheme(resolvedTheme);
            setTheme(themeId)
        }, 10)
    } else {
        setTheme(themeId);
    }
    
    toast({
      title: "Theme Generated!",
      description: `The new theme "${themeName}" has been applied with background image.`,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          <span>Generate with AI</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate a New Theme</DialogTitle>
          <DialogDescription>
            Describe the look and feel of the theme you want to create. For
            example, &quot;a calm, oceanic theme with blues and greens&quot;.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="theme-prompt" className="text-right">
              Prompt
            </Label>
            <Input
              id="theme-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="col-span-3"
              placeholder="e.g., 'a futuristic neon city'"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
