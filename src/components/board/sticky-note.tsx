"use client";

import { useState, useRef, useEffect, type RefObject } from "react";
import { type Note } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface StickyNoteProps {
  note: Note;
  boardRef: RefObject<HTMLDivElement>;
  onDragStop: (id: string, position: { x: number, y: number }) => void;
  onDelete: (id:string) => void;
  userUid: string;
}

export default function StickyNote({ note, boardRef, onDragStop, onDelete, userUid }: StickyNoteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(note.position);
  const [text, setText] = useState(note.text);
  const debouncedText = useDebounce(text, 500);

  const noteRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isDragging) {
      setPosition(note.position);
    }
  }, [note.position, isDragging]);

  useEffect(() => {
    if (debouncedText !== note.text) {
      const noteDoc = doc(db, "boards", userUid, "notes", note.id);
      setDoc(noteDoc, { text: debouncedText }, { merge: true });
    }
  }, [debouncedText, note.id, note.text, userUid]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!noteRef.current || (e.target instanceof HTMLTextAreaElement)) return;
    setIsDragging(true);
    const noteRect = noteRef.current.getBoundingClientRect();
    offsetRef.current = {
      x: e.clientX - noteRect.left,
      y: e.clientY - noteRect.top,
    };
    document.body.style.cursor = 'grabbing';
    e.stopPropagation();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !boardRef.current) return;
    const boardRect = boardRef.current.getBoundingClientRect();
    let newX = e.clientX - boardRect.left - offsetRef.current.x;
    let newY = e.clientY - boardRect.top - offsetRef.current.y;

    // Boundary checks
    newX = Math.max(0, Math.min(newX, boardRect.width - (noteRef.current?.offsetWidth ?? 240)));
    newY = Math.max(0, Math.min(newY, boardRect.height - (noteRef.current?.offsetHeight ?? 240)));
    
    setPosition({ x: newX, y: newY });
  }, [isDragging, boardRef]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    onDragStop(note.id, position);
    document.body.style.cursor = 'default';
  }, [isDragging, note.id, onDragStop, position]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp, { once: true });
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <Card
      ref={noteRef}
      className={cn(
        "absolute w-60 h-60 p-4 flex flex-col shadow-lg transition-transform transform",
        isDragging ? "cursor-grabbing scale-105 shadow-2xl z-20" : "cursor-grab z-10"
        )}
      style={{ left: position.x, top: position.y, backgroundColor: note.color, borderColor: 'rgba(0,0,0,0.1)' }}
      onMouseDown={handleMouseDown}
    >
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-full bg-transparent border-none resize-none focus-visible:ring-0 text-sm p-2"
        placeholder="Type here..."
      />
      <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(note.id)}>
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>
    </Card>
  );
}
// Basic useCallback missing, adding it to fix potential build error
function useCallback(arg0: (e: MouseEvent) => void, arg1: (boolean | RefObject<HTMLDivElement>)[]) {
    return arg0;
}
