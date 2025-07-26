import create from 'zustand';

export type Note = {
  id: string;
  x: number;
  y: number;
  content: string;
};

type State = {
  notes: Note[];
  pan: { x: number; y: number };
  zoom: number;
  searchQuery: string;
  addNote: (note: Omit<Note, 'id'>) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  setPan: (x: number, y: number) => void;
  setZoom: (zoom: number) => void;
  setSearchQuery: (q: string) => void;
};

export const useStore = create<State>((set) => ({
  notes: [
    { id: '1', x: 100, y: 100, content: 'Welcome to your infinite canvas!' },
  ],
  pan: { x: 0, y: 0 },
  zoom: 1,
  searchQuery: '',
  addNote: (note) => set((state) => ({
    notes: [
      ...state.notes,
      { ...note, id: Date.now().toString() },
    ],
  })),
  updateNote: (id, data) => set((state) => ({
    notes: state.notes.map((n) => (n.id === id ? { ...n, ...data } : n)),
  })),
  setPan: (x, y) => set(() => ({ pan: { x, y } })),
  setZoom: (zoom) => set(() => ({ zoom })),
  setSearchQuery: (q) => set(() => ({ searchQuery: q })),
}));