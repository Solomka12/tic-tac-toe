import { PlayerSign } from '@/types';

export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export interface AIConfig {
  /** Max search depth */
  depth: number;
  /** Neighborhood radius for candidate generation */
  radius: number;
  /** Number of top moves to randomly pick from (1 = always best) */
  topN: number;
  /** Time budget in ms for iterative deepening (0 = use fixed depth) */
  timeBudgetMs: number;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, AIConfig> = {
  [Difficulty.Easy]: {
    depth: 2,
    radius: 1,
    topN: 3,
    timeBudgetMs: 0,
  },
  [Difficulty.Medium]: {
    depth: 4,
    radius: 2,
    topN: 1,
    timeBudgetMs: 0,
  },
  [Difficulty.Hard]: {
    depth: 6,
    radius: 2,
    topN: 1,
    timeBudgetMs: 1500,
  },
};

export interface AIWorkerRequest {
  board: (PlayerSign | null)[];
  boardSize: number;
  marksToWin: number;
  aiSign: PlayerSign;
  difficulty: Difficulty;
}

export interface AIWorkerResponse {
  move: number;
  searchTimeMs: number;
  depthReached: number;
}
