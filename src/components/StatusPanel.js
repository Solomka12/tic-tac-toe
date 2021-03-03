import classNames from 'classnames';

import {PLAYER_SIGN} from "../constants";

import oIcon from '../assets/icons/o_icon.svg';
import xIcon from '../assets/icons/x_icon.svg';

export default function StatusPanel({scores, currentPlayer, winnerSign}) {

    const getSignIcon = sign => sign === PLAYER_SIGN.X ? xIcon : oIcon;

    return (
        <div className={classNames('status-panel', `${currentPlayer}-move`)} >
            <span className="panel-x-block"><img src={xIcon} alt="x"/></span>
            <span className="info-content">
                <img src={getSignIcon(winnerSign || currentPlayer)} alt={winnerSign || currentPlayer}/>
                {winnerSign ? '\'s win!' : '\'s move'}
            </span>
            <span className="panel-o-block"><img src={oIcon} alt="o"/></span>
        </div>
    );
}
