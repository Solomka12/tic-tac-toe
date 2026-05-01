import React, { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';
import { throttle } from 'lodash-es';

import { getSplitArr } from '@/utils/helpers';
import { PlayerSign } from "@/types";

import oIcon from '@/assets/icons/o_icon.svg';
import xIcon from '@/assets/icons/x_icon.svg';

interface BoardProps {
  cells: (string | null)[];
  handleCellSet: (index: number) => void;
  boardSize: number;
  ended?: boolean;
  isOpponentsMove?: boolean;
  isAiThinking?: boolean;
  winnerRow: number[] | null;
  lastMove: number | null;
  reset: () => void;
}

const Board: React.FC<BoardProps> = ({ cells, handleCellSet, boardSize, ended, isOpponentsMove, isAiThinking, winnerRow, lastMove, reset }) => {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);

  useEffect(() => {
    if (hoveredCell !== null) vibrate(15);
  }, [hoveredCell]);

  const vibrate = useCallback(
    throttle((duration: number) => {
      navigator.vibrate(0);
      navigator.vibrate(duration);
    }, 100),
    []
  );

  const handleBoardClick = ({ target }: React.MouseEvent<HTMLTableElement>) => {
    const element = target as HTMLElement;
    if (element.classList.contains('cell') && element.dataset.value === 'empty') {
      handleCellSet(Number(element.dataset.key));
      vibrate(25);
    }
  };

  const onTouchMove = (e: React.TouchEvent<HTMLTableElement>) => {
    const { clientX, clientY } = e.touches[0];
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement;
    setHoveredCell(el?.classList.contains('cell') ? Number(el.dataset.key) : null);
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLTableElement>) => {
    const { clientX, clientY } = e.changedTouches[0];
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement;
    const index = el?.dataset.key;
    const cell = cells[Number(index)];
    if (index && cell === null) {
      handleCellSet(Number(index));
      vibrate(25);
    }
    setHoveredCell(null);
  };

  const getCellClassNames = (index: number) => {
    const sameRow = Math.floor(index / boardSize) === Math.floor((hoveredCell ?? -1) / boardSize);
    const sameColumn = index % boardSize === (hoveredCell ?? -1) % boardSize;

    return {
      hovered: index === hoveredCell,
      highlighted: Number.isInteger(hoveredCell) && (sameRow || sameColumn),
      victorious: winnerRow?.includes(index),
      'last-move': index === lastMove,
    };
  };

  const getCellStyle = (index: number) => {
    const styles: React.CSSProperties = { height: `${100 / boardSize}%`, width: `${100 / boardSize}%` };

    if (winnerRow) {
      const winIndex = winnerRow.findIndex((i) => i === index);
      if (winIndex >= 0) styles.animationDelay = `${winIndex * (1 / boardSize)}s`;
    }

    return styles;
  };

  const getBoardIndex = (rowIndex: number, cellIndex: number) => rowIndex * boardSize + cellIndex;

  return (
    <div className={cn('board-wrapper', { ended, 'opponents-move': isOpponentsMove })}>
      <div className="reset-block" onClick={reset}>
        <span className="win-caption">Click to play</span>
      </div>

      {isAiThinking && (
        <div className="ai-thinking-overlay">
          <div className="ai-thinking-indicator">
            <span className="thinking-dot" />
            <span className="thinking-dot" />
            <span className="thinking-dot" />
          </div>
        </div>
      )}

      <table
        className="board"
        onClick={handleBoardClick}
        onTouchStart={onTouchMove}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <tbody>
          {getSplitArr(cells, boardSize).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={getCellStyle(getBoardIndex(rowIndex, cellIndex))}
                  data-key={getBoardIndex(rowIndex, cellIndex)}
                  data-value={cell || 'empty'}
                  className={cn('cell', getCellClassNames(getBoardIndex(rowIndex, cellIndex)))}
                >
                  {cell ? <img src={cell === PlayerSign.X ? xIcon : oIcon} alt={cell} /> : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Board;