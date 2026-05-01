import { PlayerSign } from '@/types';
import type { AIWorkerRequest, AIWorkerResponse } from './types';
import { Difficulty, DIFFICULTY_CONFIGS } from './types';

export { Difficulty, DIFFICULTY_CONFIGS };
export type { AIWorkerResponse };

let worker: Worker | null = null;

function getWorker(): Worker {
  if (!worker) {
    worker = new Worker(
      new URL('./ai.worker.ts', import.meta.url),
      { type: 'module' }
    );
  }
  return worker;
}

/**
 * Compute the AI's best move using a Web Worker (non-blocking).
 * Returns a promise that resolves with the move index and metadata.
 */
export function getAIMove(
  board: (PlayerSign | null)[],
  boardSize: number,
  marksToWin: number,
  aiSign: PlayerSign,
  difficulty: Difficulty
): Promise<AIWorkerResponse> {
  return new Promise((resolve) => {
    const w = getWorker();

    w.onmessage = (e: MessageEvent<AIWorkerResponse>) => {
      resolve(e.data);
    };

    const request: AIWorkerRequest = {
      board: [...board], // send a copy
      boardSize,
      marksToWin,
      aiSign,
      difficulty,
    };

    w.postMessage(request);
  });
}
