import classNames from 'classnames';

import {useAppState, useAppActions} from '../contexts/AppStateContext';
import {PLAYER_SIGN, BOARD_SIZE} from "../constants";

import oIcon from '../assets/icons/o_icon.svg';
import xIcon from '../assets/icons/x_icon.svg';

export default function Menu({score, currentPlayer, winnerSign}) {
    const {boardSize, marksToWin} = useAppState();
    const {setBoardSize, setMarksToWin, setIsStarted} = useAppActions();

    const onBoardSizeChange = e => {
        setBoardSize(+e.target.value);
        setMarksToWin(Math.min(+e.target.value, marksToWin));
    }

    const onMarksToWinChange = e => setMarksToWin(+e.target.value);

    return (
        <div className="menu">
            <div className="menu-items">
                <button onClick={() => setIsStarted(true)} className="menu-item">Play</button>
            </div>
            <div className="game-configs">
                <div className="config-item">
                    <span className="config-item-label">Board size: {boardSize}</span>
                    <br/>
                    <input
                        type="range"
                        value={boardSize}
                        max={BOARD_SIZE.MAX}
                        min={BOARD_SIZE.MIN}
                        className="config-item-control"
                        onChange={onBoardSizeChange}
                    />
                </div>

                <div className="config-item">
                    <span className="config-item-label">Marks to win: {marksToWin}</span>
                    <br/>
                    <input
                        type="range"
                        value={marksToWin}
                        max={boardSize}
                        min={BOARD_SIZE.MIN}
                        className="config-item-control"
                        onChange={onMarksToWinChange}
                    />
                </div>
            </div>
        </div>
    );
}
