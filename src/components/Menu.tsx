import React from 'react';
import { UserIcon, BrainCircuitIcon, ZapIcon, GaugeIcon, CpuIcon } from "lucide-react";
import useAppStore from '@/state/appStore';
import useGameConfigStore from '@/state/gameConfigStore';
import { BOARD_SIZE } from '@/constants';
import { GameMode, Difficulty } from "@/types";
import XIcon from '@/assets/icons/x_icon.svg?react';
import OIcon from '@/assets/icons/o_icon.svg?react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

const Menu: React.FC = () => {
  const { boardSize, marksToWin, moveChangeVariant, gameMode, difficulty, setBoardSize, setMarksToWin, setMoveChangeVariant, setGameMode, setDifficulty } = useGameConfigStore();
  const { setIsStarted } = useAppStore();

  const onBoardSizeChange = ([value]: number[]) => {
    setBoardSize(value);
    setMarksToWin(Math.min(value, marksToWin));
  };

  const onMarksToWinChange = ([value]: number[]) => {
    setMarksToWin(value);
  };

  const onMoveVariantChange = (value: string) => {
    setMoveChangeVariant(Number(value));
  };

  return (
    <div className="menu">
      <div className="game-configs">
        <div className="config-item mb-2">
          <label className="config-item-label">Board size: {boardSize}</label>
          <Slider
              value={[boardSize]}
              max={BOARD_SIZE.MAX}
              min={BOARD_SIZE.MIN}
              onValueChange={onBoardSizeChange}
            />
        </div>

        <div className="config-item mb-2">
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
          <RadioGroup value={moveChangeVariant.toString()} onValueChange={onMoveVariantChange} className="grid grid-cols-3 gap-4">
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

        <div className="config-item">
          <label className="config-item-label">Game mode:</label>
          <RadioGroup value={gameMode} onValueChange={setGameMode} className="grid grid-cols-2 gap-4">
            <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
              <RadioGroupItem value={GameMode.Single} className="peer sr-only" />
              <UserIcon className="size-[3em]" />
              Single Player
            </Label>
            <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
              <RadioGroupItem value={GameMode.Ai} className="peer sr-only" />
              <BrainCircuitIcon className="size-[3em]" />
              Against AI
            </Label>
          </RadioGroup>
        </div>

        {gameMode === GameMode.Ai && (
          <div className="config-item">
            <label className="config-item-label">AI Difficulty:</label>
            <RadioGroup value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)} className="grid grid-cols-3 gap-4">
              <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value={Difficulty.Easy} className="peer sr-only" />
                <ZapIcon className="size-[3em]" />
                Easy
              </Label>
              <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value={Difficulty.Medium} className="peer sr-only" />
                <GaugeIcon className="size-[3em]" />
                Medium
              </Label>
              <Label className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value={Difficulty.Hard} className="peer sr-only" />
                <CpuIcon className="size-[3em]" />
                Hard
              </Label>
            </RadioGroup>
          </div>
        )}
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