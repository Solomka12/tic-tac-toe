import { useEffect, useReducer } from 'react';
import { GameMode, PlayerSign } from "@/types";
import useGameConfigStore from '@/state/gameConfigStore';
import { getWinnerRow } from '@/utils/game.utils';
import { fireConfetti } from '@/utils/confetti.utils';
import { getAIMove } from '@/utils/ai';
import Board from './Board';
import StatusPanel from './StatusPanel';

const initialScore = { [PlayerSign.X]: 0, [PlayerSign.O]: 0 };
const initialTimers = { [PlayerSign.X]: 600, [PlayerSign.O]: 600 }; // 10 minutes in seconds

interface GameState {
  board: (PlayerSign | null)[];
  currentPlayer: PlayerSign | null;
  startPlayerSign: PlayerSign;
  score: Record<PlayerSign, number>;
  timers: Record<PlayerSign, number>;
  winnerSign: PlayerSign | 'draw' | null;
  winnerRow: number[] | null;
  lastMove: number | null;
  isAiThinking: boolean;
}

type GameAction =
  | { type: 'RESET'; payload: { startPlayerSign: PlayerSign; boardSize: number; initialTimers: Record<PlayerSign, number>; score: Record<PlayerSign, number> } }
  | { type: 'MAKE_MOVE'; payload: { index: number; isAgent?: boolean; boardSize: number; marksToWin: number; isAiTurn: boolean } }
  | { type: 'AI_THINKING_START' }
  | { type: 'AI_THINKING_END' }
  | { type: 'TIMER_TICK' };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'RESET': {
      const { startPlayerSign, boardSize, initialTimers, score } = action.payload;
      return {
        board: new Array(boardSize * boardSize).fill(null),
        currentPlayer: startPlayerSign,
        startPlayerSign,
        score,
        timers: { ...initialTimers },
        winnerSign: null,
        winnerRow: null,
        lastMove: null,
        isAiThinking: false,
      };
    }
    case 'MAKE_MOVE': {
      const { index, isAgent, boardSize, marksToWin, isAiTurn } = action.payload;
      if (state.winnerSign || !state.currentPlayer) return state; // Game over
      if (isAiTurn && !isAgent) return state; // Ignore manual clicks during AI turn
      if (state.board[index] !== null) return state; // Cell occupied

      const newBoard = [...state.board];
      newBoard[index] = state.currentPlayer;

      const winnerRow = getWinnerRow(newBoard, boardSize, marksToWin);
      let winnerSign: PlayerSign | 'draw' | null = null;
      let newScore = state.score;

      if (winnerRow && winnerRow.length > 0) {
        winnerSign = state.currentPlayer;
        newScore = { ...state.score, [winnerSign]: state.score[winnerSign] + 1 };
      } else if (newBoard.every((c) => c !== null)) {
        winnerSign = 'draw';
      }

      return {
        ...state,
        board: newBoard,
        currentPlayer: state.currentPlayer === PlayerSign.X ? PlayerSign.O : PlayerSign.X,
        timers: { ...state.timers, [state.currentPlayer]: state.timers[state.currentPlayer] + 5 },
        lastMove: index,
        winnerRow,
        winnerSign,
        isAiThinking: false,
        score: newScore,
      };
    }
    case 'AI_THINKING_START':
      return { ...state, isAiThinking: true };
    case 'AI_THINKING_END':
      return { ...state, isAiThinking: false };
    case 'TIMER_TICK': {
      if (state.winnerSign || !state.currentPlayer) return state;

      const newTimers = {
        ...state.timers,
        [state.currentPlayer]: Math.max(0, state.timers[state.currentPlayer] - 1),
      };

      let newWinnerSign: PlayerSign | 'draw' | null = state.winnerSign;
      let newScore = state.score;
      if (newTimers[state.currentPlayer] === 0) {
        const timeoutWinner = state.currentPlayer === PlayerSign.X ? PlayerSign.O : PlayerSign.X;
        newWinnerSign = timeoutWinner;
        newScore = { ...state.score, [timeoutWinner]: state.score[timeoutWinner] + 1 };
      }

      return {
        ...state,
        timers: newTimers,
        winnerSign: newWinnerSign,
        score: newScore,
      };
    }
    default:
      return state;
  }
};

const Game: React.FC = () => {
  const { boardSize, marksToWin, moveChangeVariant, gameMode, difficulty } = useGameConfigStore();

  const getInitialStartPlayer = () => (moveChangeVariant === 2 ? PlayerSign.O : PlayerSign.X);

  const [state, dispatch] = useReducer(gameReducer, {
    board: new Array(boardSize * boardSize).fill(null),
    currentPlayer: getInitialStartPlayer(),
    startPlayerSign: getInitialStartPlayer(),
    score: { ...initialScore },
    timers: { ...initialTimers },
    winnerSign: null,
    winnerRow: null,
    lastMove: null,
    isAiThinking: false,
  });

  const isAiTurn = gameMode === GameMode.Ai && state.currentPlayer === PlayerSign.O;

  useEffect(() => {
    if (state.winnerSign && state.winnerSign !== 'draw') {
      fireConfetti(120, { y: 0.8, x: 1 });
      fireConfetti(60, { y: 0.8, x: 0 });
    }
  }, [state.winnerSign]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'TIMER_TICK' });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    if (isAiTurn && !state.winnerSign) {
      dispatch({ type: 'AI_THINKING_START' });

      getAIMove(state.board, boardSize, marksToWin, PlayerSign.O, difficulty).then((result) => {
        if (isCancelled) return;

        console.log(`AI move: cell ${result.move}, depth ${result.depthReached}, time ${result.searchTimeMs.toFixed(1)}ms`);
        if (result.move >= 0) {
          dispatch({
            type: 'MAKE_MOVE',
            payload: { index: result.move, isAgent: true, boardSize, marksToWin, isAiTurn },
          });
        } else {
          dispatch({ type: 'AI_THINKING_END' });
        }
      });
    }

    return () => {
      isCancelled = true;
    };
  }, [state.board, isAiTurn, state.winnerSign, boardSize, marksToWin, difficulty]);

  const getNextStartPlayer = (currentStartSign: PlayerSign) => {
    switch (moveChangeVariant) {
      case 1:
        return currentStartSign === PlayerSign.X ? PlayerSign.O : PlayerSign.X;
      case 2:
        return PlayerSign.O;
      case 0:
      default:
        return PlayerSign.X;
    }
  };

  const reset = () => {
    const nextStartPlayerSign = getNextStartPlayer(state.startPlayerSign);

    dispatch({
      type: 'RESET',
      payload: {
        startPlayerSign: nextStartPlayerSign,
        boardSize,
        initialTimers,
        score: state.score,
      },
    });
  };

  useEffect(() => {
    if (state.board.length !== boardSize * boardSize) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSize]);

  const handleCellSet = (index: number, isAgent?: boolean) => {
    dispatch({
      type: 'MAKE_MOVE',
      payload: { index, isAgent, boardSize, marksToWin, isAiTurn },
    });
  };

  return (
    <div className="game">
      <StatusPanel
        score={state.score}
        currentPlayer={state.currentPlayer}
        winnerSign={state.winnerSign}
        playerTimers={state.timers}
      />

      <Board
        cells={state.board}
        boardSize={boardSize}
        ended={!!state.winnerSign}
        isOpponentsMove={isAiTurn}
        isAiThinking={state.isAiThinking}
        winnerRow={state.winnerRow}
        lastMove={state.lastMove}
        handleCellSet={handleCellSet}
        reset={reset}
      />
    </div>
  );
};

export default Game;