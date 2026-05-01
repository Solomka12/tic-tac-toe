import { create } from 'zustand';
import { GameMode, Difficulty } from "@/types";

interface AppState {
  boardSize: number;
  marksToWin: number;
  moveChangeVariant: number;
  gameMode: GameMode;
  difficulty: Difficulty;
}

interface AppActions {
  setBoardSize: (value: number) => void;
  setMarksToWin: (value: number) => void;
  setMoveChangeVariant: (value: number) => void;
  setGameMode: (value: GameMode) => void;
  setDifficulty: (value: Difficulty) => void;
}

const useGameConfigStore = create<AppState & AppActions>((set) => ({
  boardSize: 10,
  marksToWin: 5,
  moveChangeVariant: 1,
  gameMode: GameMode.Ai,
  difficulty: Difficulty.Medium,
  setBoardSize: (value) => set({ boardSize: value }),
  setMarksToWin: (value) => set({ marksToWin: value }),
  setMoveChangeVariant: (value) => set({ moveChangeVariant: value }),
  setGameMode: (value) => set({ gameMode: value }),
  setDifficulty: (value) => set({ difficulty: value }),
}));

export default useGameConfigStore;