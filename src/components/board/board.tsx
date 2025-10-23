"use client";

import { type User } from "firebase/auth";
import { collection, onSnapshot, doc, addDoc, deleteDoc, setDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { type Note, type Line } from "@/lib/types";
import StickyNote from "./sticky-note";
import Toolbar from "./toolbar";
import { Loader2 } from "lucide-react";

interface BoardProps {
  user: User;
}

export default function Board({ user }: BoardProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingLine, setDrawingLine] = useState<Line | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const notesCollectionRef = collection(db, "boards", user.uid, "notes");
  const linesCollectionRef = collection(db, "boards", user.uid, "lines");

  useEffect(() => {
    const unsubscribeNotes = onSnapshot(notesCollectionRef, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
      setNotes(notesData);
      setLoading(false);
    });

    const unsubscribeLines = onSnapshot(linesCollectionRef, (snapshot) => {
        const linesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Line));
        setLines(linesData);
    });

    return () => {
      unsubscribeNotes();
      unsubscribeLines();
    };
  }, [user.uid]);

  const addNote = async () => {
    await addDoc(notesCollectionRef, {
      text: "New note...",
      position: { x: 100, y: 100 },
      color: "#FBEA7E", // A nice yellow for sticky notes
    });
  };

  const updateNotePosition = useCallback(async (id: string, position: { x: number, y: number }) => {
    const noteDoc = doc(db, "boards", user.uid, "notes", id);
    await setDoc(noteDoc, { position }, { merge: true });
  }, [user.uid]);

  const deleteNote = async (id: string) => {
    const noteDoc = doc(db, "boards", user.uid, "notes", id);
    await deleteDoc(noteDoc);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const startPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDrawingLine({
      id: "temp",
      start: startPos,
      end: startPos,
      color: "#333333",
      strokeWidth: 2,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawingLine || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const currentPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setDrawingLine({ ...drawingLine, end: currentPos });
  };

  const handleMouseUp = async () => {
    if (!drawingLine) return;
    const { id, ...lineData } = drawingLine;
    if (Math.hypot(lineData.end.x - lineData.start.x, lineData.end.y - lineData.start.y) > 10) {
        await addDoc(linesCollectionRef, lineData);
    }
    setDrawingLine(null);
  };
  
  const clearLines = async () => {
    // A batched write would be more efficient for large numbers of lines.
    // For this use case, individual deletes are acceptable.
    lines.forEach(async (line) => {
        const lineDoc = doc(db, "boards", user.uid, "lines", line.id);
        await deleteDoc(lineDoc);
    });
  }

  if (loading) {
    return <div className="flex h-full w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="relative h-full w-full">
      <Toolbar addNote={addNote} isDrawing={isDrawing} setIsDrawing={setIsDrawing} clearLines={clearLines} />
      <div 
        ref={boardRef}
        className="absolute inset-0"
        style={{ cursor: isDrawing ? 'crosshair' : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg className="absolute h-full w-full pointer-events-none">
          {lines.map((line) => (
            <line
              key={line.id}
              x1={line.start.x}
              y1={line.start.y}
              x2={line.end.x}
              y2={line.end.y}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
            />
          ))}
          {drawingLine && (
            <line
                x1={drawingLine.start.x}
                y1={drawingLine.start.y}
                x2={drawingLine.end.x}
                y2={drawingLine.end.y}
                stroke={drawingLine.color}
                strokeWidth={drawingLine.strokeWidth}
                strokeDasharray="5,5"
            />
          )}
        </svg>
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            boardRef={boardRef}
            onDragStop={updateNotePosition}
            onDelete={deleteNote}
            userUid={user.uid}
          />
        ))}
      </div>
    </div>
  );
}
