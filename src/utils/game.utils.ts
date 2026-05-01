import { PlayerSign } from "@/types";

/**
 * Determines the winning row in a Tic Tac Toe game.
 * @param board - The game board.
 * @param boardSize - The size of the board.
 * @param marksToWin - The number of marks required to win.
 * @returns The indices of the winning row, or an empty array if it's a draw, or null if no winner yet.
 */
export const getWinnerRow = (
  board: (string | null)[],
  boardSize: number,
  marksToWin: number
): number[] | null => {
  const fitsVertically = (i: number) => i + boardSize * (marksToWin - 1) < boardSize * boardSize;
  const fitsHorizontally = (i: number) => i % boardSize + marksToWin <= boardSize;
  const fitsBackHorizontally = (i: number) => i % boardSize - (marksToWin - 1) >= 0;

  const getHorizontalRow = (i: number, cell: string, board: (string | null)[]) => {
    if (!fitsHorizontally(i)) return null;

    const currWinnerRow = [i];
    let currRowCount = 1;

    for (let j = i + 1; currRowCount < marksToWin; j++) {
      if (board[j] === cell) {
        currWinnerRow.push(j);
        currRowCount++;
      } else {
        break;
      }
    }

    return currWinnerRow.length >= marksToWin ? currWinnerRow : null;
  };

  const getVerticalRow = (i: number, cell: string, board: (string | null)[]) => {
    if (!fitsVertically(i)) return null;

    const currWinnerRow = [i];
    let currRowCount = 1;

    for (let j = i + boardSize; currRowCount < marksToWin; j += boardSize) {
      if (board[j] === cell) {
        currWinnerRow.push(j);
        currRowCount++;
      } else {
        break;
      }
    }

    return currWinnerRow.length >= marksToWin ? currWinnerRow : null;
  };

  const getDiagonalLTRRow = (i: number, cell: string, board: (string | null)[]) => {
    if (!fitsHorizontally(i) || !fitsVertically(i)) return null;

    const currWinnerRow = [i];
    let currRowCount = 1;

    for (let j = i + boardSize + 1; currRowCount < marksToWin; j += boardSize + 1) {
      if (board[j] === cell) {
        currWinnerRow.push(j);
        currRowCount++;
      } else {
        break;
      }
    }

    return currWinnerRow.length >= marksToWin ? currWinnerRow : null;
  };

  const getDiagonalRTLRow = (i: number, cell: string, board: (string | null)[]) => {
    if (!fitsVertically(i) || !fitsBackHorizontally(i)) return null;

    const currWinnerRow = [i];
    let currRowCount = 1;

    for (let j = i + boardSize - 1; currRowCount < marksToWin; j += boardSize - 1) {
      if (board[j] === cell) {
        currWinnerRow.push(j);
        currRowCount++;
      } else {
        break;
      }
    }

    return currWinnerRow.length >= marksToWin ? currWinnerRow : null;
  };

  let emptyCellCount = board.length;

  for (let i = 0; i < board.length; i++) {
    const cell = board[i];

    if (cell) {
      emptyCellCount--;

      const horizontalRow = getHorizontalRow(i, cell, board);
      if (horizontalRow) return horizontalRow;

      const verticalRow = getVerticalRow(i, cell, board);
      if (verticalRow) return verticalRow;

      const diagonalLTRRow = getDiagonalLTRRow(i, cell, board);
      if (diagonalLTRRow) return diagonalLTRRow;

      const diagonalRTLRow = getDiagonalRTLRow(i, cell, board);
      if (diagonalRTLRow) return diagonalRTLRow;
    }
  }

  if (board.length && emptyCellCount <= 0) return [];
  return null;
};

export const getWinnerSign = (
  board: (PlayerSign | null)[],
  boardSize: number,
  marksToWin: number
): PlayerSign | null => {
  const winnerRow = getWinnerRow(board, boardSize, marksToWin);
  return winnerRow ? board[winnerRow[0]] : null;
};