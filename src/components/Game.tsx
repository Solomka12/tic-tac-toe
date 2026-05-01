import { useState, useEffect, use } from 'react';
import { set } from 'lodash-es';
import useGameConfigStore from '@/state/gameConfigStore';
import { getWinnerRow, fireConfetti } from '@/utils';
import { PlayerSign } from '@/constants';
import Board from './Board';
import StatusPanel from './StatusPanel';

const initialScore = { [PlayerSign.X]: 0, [PlayerSign.O]: 0 };

const initialTimers = { [PlayerSign.X]: 600, [PlayerSign.O]: 600 }; // 10 minutes in seconds

const Game: React.FC = () => {
  const { boardSize, marksToWin, moveChangeVariant } = useGameConfigStore();
  const [board, setBoard] = useState<(PlayerSign | null)[]>([]);
  const [winnerRow, setWinnerRow] = useState<number[] | null>(null);
  const [winnerSign, setWinnerSign] = useState<PlayerSign | 'draw' | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerSign | null>(null);
  const [startPlayerSign, setStartPlayerSign] = useState<PlayerSign>(moveChangeVariant === 2 ? PlayerSign.O : PlayerSign.X);
  const [score, setScore] = useState(initialScore);
  const [timers, setTimers] = useState(initialTimers);

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (winnerSign && winnerSign !== 'draw') {
      setScore((prev) => ({ ...prev, [winnerSign]: prev[winnerSign] + 1 }));
    }
  }, [winnerSign]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentPlayer && !winnerSign) {
        setTimers((prev) => {
          const updatedTimers = { ...prev, [currentPlayer]: Math.max(prev[currentPlayer] - 1, 0) };

          if (updatedTimers[currentPlayer] === 0) {
            const opponent = currentPlayer === PlayerSign.X ? PlayerSign.O : PlayerSign.X;
            setWinnerSign(opponent);
          }

          return updatedTimers;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayer, winnerSign]);

  useEffect(() => {
    const row = getWinnerRow(board, boardSize, marksToWin);
    if (row) setWinnerRow(row);
  }, [board, boardSize, marksToWin]);

  useEffect(() => {
    if (winnerRow) {
      if (winnerRow.length) {
        const sign = board[winnerRow[0]];
        setWinnerSign(sign!);
        fireConfetti(120, { y: 0.8, x: 1 });
        fireConfetti(60, { y: 0.8, x: 0 });
      } else {
        setWinnerSign('draw');
      }

      switchFirstPlayer();
    }
  }, [winnerRow]);

  const reset = () => {
    setCurrentPlayer(startPlayerSign);
    setBoard(new Array(boardSize * boardSize).fill(null));
    setWinnerRow(null);
    setWinnerSign(null);
    setTimers(initialTimers);
  };

  const handleCellSet = (index: number) => {
    setBoard((prevBoard) => [...set(prevBoard, index, currentPlayer)]);
    setTimers((prev) => ({ ...prev, [currentPlayer!]: prev[currentPlayer!] + 5 }));
    togglePlayer();
  };

  const togglePlayer = () => {
    setCurrentPlayer((p) => (p === PlayerSign.X ? PlayerSign.O : PlayerSign.X));
  };

  const switchFirstPlayer = () => {
    switch (moveChangeVariant) {
      case 1:
        setStartPlayerSign(startPlayerSign === PlayerSign.X ? PlayerSign.O : PlayerSign.X);
        break;
      case 2:
        setStartPlayerSign(PlayerSign.O);
        break;
      case 0:
      default:
        setStartPlayerSign(PlayerSign.X);
    }
  };

  return (
    <div className="game">
      <StatusPanel
        score={score}
        currentPlayer={currentPlayer}
        winnerSign={winnerSign}
        playerTimers={timers}
      />

      <Board
        cells={board}
        boardSize={boardSize}
        ended={!!winnerSign}
        winnerRow={winnerRow}
        handleCellSet={handleCellSet}
        reset={reset}
      />
    </div>
  );
};

export default Game;