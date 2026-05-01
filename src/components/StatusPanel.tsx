import React from 'react';
import cn from 'classnames';

import { PlayerSign } from "@/types";
import { formatTime } from '@/utils/helpers';

import oIcon from '@/assets/icons/o_icon.svg';
import xIcon from '@/assets/icons/x_icon.svg';

interface StatusPanelProps {
  score: { [key: string]: number };
  currentPlayer: PlayerSign | null;
  winnerSign: PlayerSign | 'draw' | null;
  playerTimers: Record<PlayerSign, number>;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ score, currentPlayer, winnerSign, playerTimers }) => {
  const getSignIcon = (sign: PlayerSign | null) => (sign === PlayerSign.X ? xIcon : oIcon);

  return (
    <div className={cn('status-panel', `${currentPlayer}-move`)}>
      <div className="flex flex-col gap-[0.4em]">
        <span className="panel-x-block">
          {score[PlayerSign.X]}
          <img src={xIcon} alt="x" />
        </span>
        <span className={cn('player-timer text-sm text-gray-700', { 'opacity-40': currentPlayer === PlayerSign.O })}>
          {formatTime(playerTimers[PlayerSign.X])}
        </span>
      </div>
      <div className="info-content">
        {winnerSign === 'draw' ? (
          'Draw!'
        ) : (
          <>
            <img src={getSignIcon(winnerSign || currentPlayer)} alt={winnerSign || currentPlayer || ''} />
            {winnerSign ? "'s win!" : "'s move"}
          </>
        )}
      </div>
      <div className="flex flex-col gap-[0.4em]">
        <span className="panel-o-block">
          <img src={oIcon} alt="o" />
          {score[PlayerSign.O]}
        </span>
        <span className={cn('player-timer text-sm text-gray-700 text-right', { 'opacity-40': currentPlayer === PlayerSign.X })}>
          {formatTime(playerTimers[PlayerSign.O])}
        </span>
      </div>
    </div>
  );
};

export default StatusPanel;