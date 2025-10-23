import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, PenLine, Eraser } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolbarProps {
  addNote: () => void;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  clearLines: () => void;
}

export default function Toolbar({ addNote, isDrawing, setIsDrawing, clearLines }: ToolbarProps) {
  return (
    <TooltipProvider>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-card p-2 rounded-lg shadow-md border flex gap-1 items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={addNote}>
              <Plus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add Note</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isDrawing ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setIsDrawing(!isDrawing)}
            >
              <PenLine className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isDrawing ? "Stop Drawing" : "Draw Line"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearLines}
            >
              <Eraser className="h-5 w-5 text-muted-foreground hover:text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear All Lines</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
