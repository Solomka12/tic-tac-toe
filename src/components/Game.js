import React, {useState, useEffect} from 'react';
import {set} from 'lodash';

import {useAppState} from '../contexts/AppStateContext';
import {getWinnerRow} from '../utils';
import {PLAYER_SIGN} from '../constants';

import Board from './Board';
import StatusPanel from './StatusPanel';

const initialScore = {[PLAYER_SIGN.X]: 0, [PLAYER_SIGN.O]: 0}

export default function Game() {
    const {boardSize, marksToWin} = useAppState();
    const [board, setBoard] = useState([]);
    const [winnerRow, setWinnerRow] = useState(null);
    const [winnerSign, setWinnerSign] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [score, setScore] = useState(initialScore);

    useEffect(() => {
        initGame();
    }, []);

    useEffect(() => {
        const row = getWinnerRow(board, boardSize, marksToWin);
        if (row) setWinnerRow(row);
    }, [board]);

    useEffect(() => {
        if (winnerRow) {
            const sign = board[winnerRow[0]];
            setWinnerSign(sign);
            setScore(prev => ({...prev, [sign]: prev[sign] + 1}))
        }
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
