import React, { createContext, useState, ReactNode } from 'react';
import { generateContextHook } from '@/utils/contextHelpers';

interface AppState {
  isStarted: boolean;
  boardSize: number;
  marksToWin: number;
  moveChangeVariant: number;
}

interface AppDispatch {
  setIsStarted: (value: boolean) => void;
  setBoardSize: (value: number) => void;
  setMarksToWin: (value: number) => void;
  setMoveChangeVariant: (value: number) => void;
}

const initialState: AppState = {
  isStarted: false,
  boardSize: 10,
  marksToWin: 5,
  moveChangeVariant: 1,
};

const AppStateContext = createContext<AppState | undefined>(undefined);
const AppDispatchContext = createContext<AppDispatch | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const setByField = <K extends keyof AppState>(fieldName: K) => (val: AppState[K]) =>
    setState((prev) => ({ ...prev, [fieldName]: val }));

  const dispatchValue: AppDispatch = {
    setIsStarted: setByField('isStarted'),
    setBoardSize: setByField('boardSize'),
    setMarksToWin: setByField('marksToWin'),
    setMoveChangeVariant: setByField('moveChangeVariant'),
  };

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatchValue}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

const useAppState = generateContextHook(AppStateContext, 'App');
const useAppActions = generateContextHook(AppDispatchContext, 'App');

export { AppProvider, useAppState, useAppActions };