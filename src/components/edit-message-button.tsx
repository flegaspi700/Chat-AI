'use client';

import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EditMessageButtonProps {
  onEdit: () => void;
  disabled?: boolean;
}

export function EditMessageButton({
  onEdit,
  disabled = false,
}: EditMessageButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            disabled={disabled}
            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
            aria-label="Edit message"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit message</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
