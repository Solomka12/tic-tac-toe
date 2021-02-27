import {getSplitArr} from '../utils'

import oIcon from '../assets/icons/o_icon.svg';
import xIcon from '../assets/icons/x_icon.svg';
import {PLAYER_SIGN} from "../constants";
import React from "react";

export default function Board({cells, handleCellSet, boardSize, winnerRow}) {

    const handleBoardClick = ({target: {classList, dataset}}) => {
        if (classList.contains('cell') && dataset.value === 'empty') {
            handleCellSet(dataset.key);
        }
    };

    return (
        <table className="board" onClick={handleBoardClick}>
            <tbody>
                {getSplitArr(cells, boardSize).map((row, i) => (
                    <tr key={i}>
                        {row.map((cell, cellIndex) => (
                            <td
                                key={cellIndex}
                                style={{height: `${100 / boardSize}%`}}
                                data-key={i * boardSize + cellIndex}
                                data-value={cell || 'empty'}
                                className={`cell ${winnerRow && winnerRow.includes(i) ? 'highlight' : ''}`}
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
