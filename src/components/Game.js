import React, {useState, useEffect} from 'react';
import {set} from 'lodash';

import Board from './Board';
import StatusPanel from './StatusPanel';
import {PLAYER_SIGN} from '../constants';

const boardSize = 10;
const marksToWin = 5;

const fitsVertically = i => i + boardSize * (marksToWin - 1) < boardSize * boardSize;
const fitsHorizontally = i => i % boardSize + marksToWin <= boardSize;
const fitsBackHorizontally = i => i % boardSize - (marksToWin - 1) >= 0;

const getHorizontalRow = (i, cell, board = []) => {
    if (!fitsHorizontally(i)) return null;

    let currWinnerRow = [i];
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

const getVerticalRow = (i, cell, board = []) => {
    if (!fitsVertically(i)) return null;

    let currWinnerRow = [i];
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

const getDiagonalLTRRow = (i, cell, board = []) => {
    if (!fitsHorizontally(i) || !fitsVertically(i)) return null;

    let currWinnerRow = [i];
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

const getDiagonalRTLRow = (i, cell, board = []) => {
    if (!fitsVertically(i) || !fitsBackHorizontally(i)) return null;

    let currWinnerRow = [i];
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

export default function Game() {
    const [board, setBoard] = useState([]);
    const [winnerRow, setWinnerRow] = useState(null);
    const [winnerSign, setWinnerSign] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);

    useEffect(() => {
        initGame();
    }, []);

    useEffect(() => {
        const row = getWinnerRow();
        if (row) setWinnerRow(row);
    }, [board]);

    useEffect(() => {
        if (winnerRow) setWinnerSign(board[winnerRow[0]]);
    }, [winnerRow]);

    const initGame = () => {
        reset();
    };

    const reset = () => {
        setCurrentPlayer(PLAYER_SIGN.X);
        setBoard(new Array(boardSize * boardSize).fill(null));
        setWinnerRow(null);
        setWinnerSign(null);
    };

    const handleCellSet = index => {
        setBoard(prevBoard => [...set(prevBoard, index, currentPlayer)]);
        togglePlayer();
    };

    const togglePlayer = () => {
        setCurrentPlayer(p => p === PLAYER_SIGN.X ? PLAYER_SIGN.O : PLAYER_SIGN.X);
    };

    const getWinnerRow = () => {
        for (let i = 0; i < board.length; i++) {
            const cell = board[i];

            if (cell) {
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
    };

    return (
        <div className="game">
            <StatusPanel
                currentPlayer={currentPlayer}
                winnerSign={winnerSign}
            />

            <Board
                cells={board}
                boardSize={boardSize}
                winnerRow={winnerRow}
                handleCellSet={handleCellSet}
                reset={reset}
            />
        </div>
    );
}
