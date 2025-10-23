export type Note = {
  id: string;
  text: string;
  position: { x: number; y: number };
  color: string;
};

export type Line = {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  color: string;
  strokeWidth: number;
};
