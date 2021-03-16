import React, { createContext, useState } from 'react';
import { element } from 'prop-types';

import { generateContextHook } from '../utils/contextHelpers';

const initialState = {
    isStarted: false,
    boardSize: 10,
    marksToWin: 5,
    moveChangeVariant: 1,
};

const AppStateContext = createContext();
const AppDispatchContext = createContext();

const AppProvider = ({children}) => {
    const [state, setState] = useState(initialState);

    const setByField = fieldName => val => setState(prev => ({...prev, [fieldName]: val}))

    const dispatchValue = {
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

AppProvider.propTypes = {
    children: element.isRequired,
};

const useAppState = generateContextHook(AppStateContext, 'App');
const useAppActions = generateContextHook(AppDispatchContext, 'App');

export { AppProvider, useAppState, useAppActions };