import React, {useState, useEffect, useCallback} from 'react';
import classNames from 'classnames';
import {throttle} from 'lodash';

import {getSplitArr} from '../utils'
import {PLAYER_SIGN} from "../constants";

import oIcon from '../assets/icons/o_icon.svg';
import xIcon from '../assets/icons/x_icon.svg';

export default function Board({cells, handleCellSet, boardSize, winnerRow}) {
    const [hoveredCell, setHoveredCell] = useState(null);

    useEffect(() => {
        console.log(hoveredCell);
        if (hoveredCell !== null) vibrate(15);
    }, [hoveredCell]);

    const vibrate = useCallback(throttle((duration) => {
        navigator.vibrate(0);
        navigator.vibrate(duration);
    }, 100), []);

    const handleBoardClick = ({target: {classList, dataset}}) => {
        if (classList.contains('cell') && dataset.value === 'empty') {
            handleCellSet(dataset.key);
            vibrate(25);
        }
    };

    const onTouchMove = e => {
        const {clientX, clientY} = e.touches[0];
        const el = document.elementFromPoint(clientX, clientY);
        setHoveredCell(el?.classList.contains('cell') ? +el.dataset.key : null);
    };

    const onTouchEnd = e => {
        const {clientX, clientY} = e.changedTouches[0];
        const el = document.elementFromPoint(clientX, clientY);
        const index = el?.dataset.key;
        const cell = cells[index];
        if (index && cell === null) {
            handleCellSet(index);
            vibrate(25);
        }
        setHoveredCell(null);
    }

    const getCellClassNames = index => {
        const sameRow = Math.floor(index / boardSize) === Math.floor(hoveredCell / boardSize);
        const sameColumn = index % boardSize === hoveredCell % boardSize;

        return {
            hovered: index === hoveredCell,
            highlighted: Number.isInteger(hoveredCell) && (sameRow || sameColumn),
            victorious: winnerRow?.includes(index),
        };
    }

    return (
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
                                style={{height: `${100 / boardSize}%`}}
                                data-key={rowIndex * boardSize + cellIndex}
                                data-value={cell || 'empty'}
                                className={classNames('cell', getCellClassNames(rowIndex * boardSize + cellIndex))}
                            >
                                {cell ? <img src={cell === PLAYER_SIGN.X ? xIcon : oIcon} alt={cell}/> : null}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
