import { create } from 'zustand';

interface AppState {
  boardSize: number;
  marksToWin: number;
  moveChangeVariant: number;
}

interface AppActions {
  setBoardSize: (value: number) => void;
  setMarksToWin: (value: number) => void;
  setMoveChangeVariant: (value: number) => void;
}

const useGameConfigStore = create<AppState & AppActions>((set) => ({
  boardSize: 10,
  marksToWin: 5,
  moveChangeVariant: 1,
  setBoardSize: (value) => set({ boardSize: value }),
  setMarksToWin: (value) => set({ marksToWin: value }),
  setMoveChangeVariant: (value) => set({ moveChangeVariant: value }),
}));

export default useGameConfigStore;