import React from 'react';
import cn from 'classnames';

import { PlayerSign } from '@/constants';

import oIcon from '@/assets/icons/o_icon.svg';
import xIcon from '@/assets/icons/x_icon.svg';

interface StatusPanelProps {
  score: { [key: string]: number };
  currentPlayer: string | null;
  winnerSign: string | null;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ score, currentPlayer, winnerSign }) => {
  const getSignIcon = (sign: string | null) => (sign === PlayerSign.X ? xIcon : oIcon);

  return (
    <div className={cn('status-panel', `${currentPlayer}-move`)}>
      <span className="panel-x-block">
        {score[PlayerSign.X]}
        <img src={xIcon} alt="x" />
      </span>
      <span className="info-content">
        {winnerSign === 'draw' ? (
          'Draw!'
        ) : (
          <>
            <img src={getSignIcon(winnerSign || currentPlayer)} alt={winnerSign || currentPlayer || ''} />
            {winnerSign ? "'s win!" : "'s move"}
          </>
        )}
      </span>
      <span className="panel-o-block">
        <img src={oIcon} alt="o" />
        {score[PlayerSign.O]}
      </span>
    </div>
  );
};

export default StatusPanel;