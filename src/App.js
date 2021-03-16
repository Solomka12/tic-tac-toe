import React from "react";

import Game from './components/Game';
import Menu from './components/Menu';

import {useAppState} from './contexts/AppStateContext';

import './App.scss';

function App() {
  const {isStarted} = useAppState();
  return isStarted ? <Game/> : <Menu />;
}

export default App;
