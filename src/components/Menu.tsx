import React from 'react';
import useAppStore from '@/state/appStore';
import useGameConfigStore from '@/state/gameConfigStore';
import { BOARD_SIZE } from '@/constants';
import XIcon from '@/assets/icons/x_icon.svg?react';
import OIcon from '@/assets/icons/o_icon.svg?react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

const Menu: React.FC = () => {
  const { boardSize, marksToWin, moveChangeVariant, setBoardSize, setMarksToWin, setMoveChangeVariant } = useGameConfigStore();
  const { setIsStarted } = useAppStore();

  const onBoardSizeChange = ([value]: number[]) => {
    setBoardSize(value);
    setMarksToWin(Math.min(value, marksToWin));
  };

  const onMarksToWinChange = ([value]: number[]) => {
    setMarksToWin(value);
  };

  const onRadioChange = (value: string) => {
    setMoveChangeVariant(Number(value));
  };

  return (
    <div className="menu">
      <div className="game-configs">
        <div className="config-item">
          <label className="config-item-label">Board size: {boardSize}</label>
          <Slider
              value={[boardSize]}
              max={BOARD_SIZE.MAX}
              min={BOARD_SIZE.MIN}
              onValueChange={onBoardSizeChange}
            />
        </div>

        <div className="config-item">
          <label className="config-item-label">Marks to win: {marksToWin}</label>
          <Slider
              value={[marksToWin]}
              max={boardSize}
              min={BOARD_SIZE.MIN}
              onValueChange={onMarksToWinChange}
            />
        </div>

        <div className="config-item">
          <label className="config-item-label">Move Change Variant:</label>
          <RadioGroup value={moveChangeVariant.toString()} onValueChange={onRadioChange} className="grid grid-cols-3 gap-4">
            <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
              <RadioGroupItem value="0" className="peer sr-only" />
              <XIcon className="size-[3em]" />
              First
            </Label>
            <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
              <RadioGroupItem value="1" className="peer sr-only" />
              <span className="flex">
                <XIcon className="size-[3em]" />
                <OIcon className="size-[3em]" />
              </span>
              Switch
            </Label>
            <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
              <RadioGroupItem value="2" className="peer sr-only" />
              <OIcon className="size-[3em]" />
              First
            </Label>
          </RadioGroup>
        </div>
      </div>

      <div className="menu-items">
        <Button onClick={() => setIsStarted(true)} variant="default" size="lg" className="menu-btn">
          Play
        </Button>
      </div>
    </div>
  );
};

export default Menu;