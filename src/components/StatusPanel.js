import classNames from 'classnames';

import {PLAYER_SIGN} from "../constants";

import oIcon from '../assets/icons/o_icon.svg';
import xIcon from '../assets/icons/x_icon.svg';

export default function StatusPanel({score, currentPlayer, winnerSign}) {

    const getSignIcon = sign => sign === PLAYER_SIGN.X ? xIcon : oIcon;

    return (
        <div className={classNames('status-panel', `${currentPlayer}-move`)} >
            <span className="panel-x-block">
                {score.x}
                <img src={xIcon} alt="x"/>
            </span>
            <span className="info-content">
                {winnerSign === 'draw'
                    ? 'Draw!'
                    : <>
                        <img src={getSignIcon(winnerSign || currentPlayer)} alt={winnerSign || currentPlayer}/>
                        {winnerSign ? '\'s win!' : '\'s move'}
                    </>
                }
            </span>
            <span className="panel-o-block">
                <img src={oIcon} alt="o"/>
                {score.o}
            </span>
        </div>
    );
}
