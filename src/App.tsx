import useAppStore from './state/appStore';
import Game from './components/Game';
import Menu from './components/Menu';
import './App.scss';

function App() {
  const { isStarted } = useAppStore();
  return isStarted ? <Game /> : <Menu />;
}

export default App;
