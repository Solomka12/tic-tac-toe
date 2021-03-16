import React, {useState, useEffect} from 'react';
import {set} from 'lodash';

import {useAppState} from '../contexts/AppStateContext';
import {getWinnerRow, fireConfetti} from '../utils';
import {PLAYER_SIGN} from '../constants';

import Board from './Board';
import StatusPanel from './StatusPanel';

const initialScore = {[PLAYER_SIGN.X]: 0, [PLAYER_SIGN.O]: 0}

export default function Game() {
    const {boardSize, marksToWin, moveChangeVariant} = useAppState();
    const [board, setBoard] = useState([]);
    const [winnerRow, setWinnerRow] = useState(null);
    const [winnerSign, setWinnerSign] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [startPlayerSign, setStartPlayerSign] = useState(moveChangeVariant === 2 ? PLAYER_SIGN.O : PLAYER_SIGN.X);
    const [score, setScore] = useState(initialScore);

    useEffect(() => {
        reset();
    }, []);

    useEffect(() => {
        const row = getWinnerRow(board, boardSize, marksToWin);
        if (row) setWinnerRow(row);
    }, [board, boardSize, marksToWin]);

    useEffect(() => {
        if (winnerRow) {
            if (winnerRow.length) {
                const sign = board[winnerRow[0]];
                setWinnerSign(sign);
                setScore(prev => ({...prev, [sign]: prev[sign] + 1}));
                fireConfetti(120, {y: 0.8, x: 1});
                fireConfetti(60, {y: 0.8, x: 0});
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
    };

    const handleCellSet = index => {
        setBoard(prevBoard => [...set(prevBoard, index, currentPlayer)]);
        togglePlayer();
    };

    const togglePlayer = () => {
        setCurrentPlayer(p => p === PLAYER_SIGN.X ? PLAYER_SIGN.O : PLAYER_SIGN.X);
    };

    const switchFirstPlayer = () => {
        switch (moveChangeVariant) {
            case 1: setStartPlayerSign(startPlayerSign === PLAYER_SIGN.X ? PLAYER_SIGN.O : PLAYER_SIGN.X); break;
            case 2: setStartPlayerSign(PLAYER_SIGN.O); break;
            case 0:
            default: setStartPlayerSign(PLAYER_SIGN.X);
        }
    };

    return (
        <div className="game">
            <StatusPanel
                score={score}
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
