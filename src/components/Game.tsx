import { useState, useEffect, useRef } from 'react';
import { set } from 'lodash-es';
import { GameMode, PlayerSign } from "@/types";
import useGameConfigStore from '@/state/gameConfigStore';
import { getWinnerRow } from '@/utils/game.utils';
import { fireConfetti } from '@/utils/confetti.utils';
import { getAIMove } from '@/utils/ai';
import Board from './Board';
import StatusPanel from './StatusPanel';

const initialScore = { [PlayerSign.X]: 0, [PlayerSign.O]: 0 };

const initialTimers = { [PlayerSign.X]: 600, [PlayerSign.O]: 600 }; // 10 minutes in seconds

const Game: React.FC = () => {
  const { boardSize, marksToWin, moveChangeVariant, gameMode, difficulty } = useGameConfigStore();
  const [board, setBoard] = useState<(PlayerSign | null)[]>([]);
  const [winnerRow, setWinnerRow] = useState<number[] | null>(null);
  const [lastMove, setLastMove] = useState<number | null>(null);
  const [winnerSign, setWinnerSign] = useState<PlayerSign | 'draw' | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerSign | null>(null);
  const [startPlayerSign, setStartPlayerSign] = useState<PlayerSign>(moveChangeVariant === 2 ? PlayerSign.O : PlayerSign.X);
  const [score, setScore] = useState(initialScore);
  const [timers, setTimers] = useState(initialTimers);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [roundKey, setRoundKey] = useState(0);
  const gameOverRef = useRef(false);
  const isAiTurn = gameMode === GameMode.Ai && currentPlayer === PlayerSign.O; // TODO: Make User select sign

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (!winnerSign) return;
    gameOverRef.current = true;
    setIsAiThinking(false);
    if (winnerSign !== 'draw') setScore((prev) => ({ ...prev, [winnerSign]: prev[winnerSign] + 1 }));
    switchFirstPlayer();
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
    }
  }, [winnerRow]);

  useEffect(() => {
    if (isAiTurn && !winnerSign) {
      setIsAiThinking(true);

      getAIMove(board, boardSize, marksToWin, PlayerSign.O, difficulty).then((result) => {
        // Discard the move if the game ended while we were computing
        if (gameOverRef.current) return;

        console.log(`AI move: cell ${result.move}, depth ${result.depthReached}, time ${result.searchTimeMs.toFixed(1)}ms`);
        setIsAiThinking(false);
        if (result.move >= 0) {
          handleCellSet(result.move, true);
        }
      });
    }
  }, [isAiTurn, roundKey]);

  const reset = () => {
    gameOverRef.current = false;
    setRoundKey((k) => k + 1);
    setCurrentPlayer(startPlayerSign);
    setBoard(new Array(boardSize * boardSize).fill(null));
    setWinnerRow(null);
    setWinnerSign(null);
    setTimers(initialTimers);
    setIsAiThinking(false);
    setLastMove(null);
  };

  const handleCellSet = (index: number, isAgent?: boolean) => {
    if (isAiTurn && !isAgent) return;
    setBoard((prevBoard) => [...set(prevBoard, index, currentPlayer)]);
    setTimers((prev) => ({ ...prev, [currentPlayer!]: prev[currentPlayer!] + 5 }));
    setLastMove(index);
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
        isOpponentsMove={isAiTurn}
        isAiThinking={isAiThinking}
        winnerRow={winnerRow}
        lastMove={lastMove}
        handleCellSet={handleCellSet}
        reset={reset}
      />
    </div>
  );
};

export default Game;