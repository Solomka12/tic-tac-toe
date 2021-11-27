import {Button, Slider, Tabs, Tab} from '@mui/material';

import {useAppState, useAppActions} from '../contexts/AppStateContext';
import {BOARD_SIZE} from "../constants";

import { ReactComponent as XIcon } from '../assets/icons/x_icon.svg';
import { ReactComponent as OIcon } from '../assets/icons/o_icon.svg';

export default function Menu() {
    const {boardSize, marksToWin, moveChangeVariant} = useAppState();
    const {setBoardSize, setMarksToWin, setIsStarted, setMoveChangeVariant} = useAppActions();

    const onBoardSizeChange = (e, value) => {
        setBoardSize(value);
        setMarksToWin(Math.min(value, marksToWin));
    }

    const onMarksToWinChange = (e, value) => setMarksToWin(value);

    const onTabChange = (e, value) => setMoveChangeVariant(value);

    return (
        <div className="menu">
            <div className="game-configs">
                <div className="config-item">
                    <span className="config-item-label">Board size: {boardSize}</span>
                    <br/>
                    <Slider
                        value={boardSize}
                        max={BOARD_SIZE.MAX}
                        min={BOARD_SIZE.MIN}
                        onChange={onBoardSizeChange}
                        className="config-item-control"
                    />
                </div>

                <div className="config-item">
                    <span className="config-item-label">Marks to win: {marksToWin}</span>
                    <br/>
                    <Slider
                        value={marksToWin}
                        max={boardSize}
                        min={BOARD_SIZE.MIN}
                        onChange={onMarksToWinChange}
                        className="config-item-control"
                    />
                </div>

                <Tabs
                    value={moveChangeVariant}
                    onChange={onTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    className="config-item"
                >
                    <Tab className="menu-tab" icon={<span className="tab-icon"><XIcon /></span>} label="first" />
                    <Tab className="menu-tab" icon={<span className="tab-icon"><XIcon /><OIcon /></span>} label="switch" />
                    <Tab className="menu-tab" icon={<span className="tab-icon"><OIcon /></span>} label="first" />
                </Tabs>
            </div>

            <div className="menu-items">
                <Button onClick={() => setIsStarted(true)} className="menu-btn" size="large" variant="outlined">Play</Button>
            </div>
        </div>
    );
}
