import { create } from 'zustand';

interface AppState {
  isStarted: boolean;
}

interface AppActions {
  setIsStarted: (value: boolean) => void;
}

const useAppStore = create<AppState & AppActions>((set) => ({
  isStarted: false,
  setIsStarted: (value) => set({ isStarted: value }),
}));

export default useAppStore;