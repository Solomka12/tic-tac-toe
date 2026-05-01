/**
 * Web Worker for AI move computation.
 * Runs the AI engine off the main thread to keep the UI responsive.
 *
 * Note: We use inline imports because path aliases (@/) don't resolve
 * inside Vite web workers reliably. The engine imports handle this internally.
 */
import { computeBestMove } from './engine';
import type { AIWorkerRequest, AIWorkerResponse } from './types';

self.onmessage = (e: MessageEvent<AIWorkerRequest>) => {
  const { board, boardSize, marksToWin, aiSign, difficulty } = e.data;

  const result: AIWorkerResponse = computeBestMove(
    board, boardSize, marksToWin, aiSign, difficulty
  );

  self.postMessage(result);
};
