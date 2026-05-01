import { PlayerSign } from '@/types';
import { Difficulty, DIFFICULTY_CONFIGS, AIWorkerResponse } from './types';
import { findBestMoves } from './search';

/**
 * Main AI engine entry point.
 * Computes the best move for the AI using heuristic minimax with
 * neighborhood pruning, move ordering, and optional iterative deepening.
 */
export function computeBestMove(
  board: (PlayerSign | null)[],
  boardSize: number,
  marksToWin: number,
  aiSign: PlayerSign,
  difficulty: Difficulty
): AIWorkerResponse {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const startTime = performance.now();

  // Make a mutable copy (minimax mutates in-place for performance)
  const boardCopy = [...board];
  let bestMove = -1;
  let depthReached = 0;

  if (config.timeBudgetMs > 0) {
    // Iterative deepening: search at increasing depths until time runs out
    let lastResults: { move: number; score: number }[] = [];

    for (let d = 1; d <= config.depth; d++) {
      const elapsed = performance.now() - startTime;
      if (elapsed > config.timeBudgetMs * 0.8) break; // Leave 20% margin

      const results = findBestMoves(
        boardCopy, boardSize, marksToWin, d, aiSign, config.radius
      );

      if (results.length > 0) {
        lastResults = results;
        depthReached = d;
      }

      // If we found a forced win, stop immediately
      if (results.length > 0 && results[0].score >= 100_000) break;
    }

    if (lastResults.length > 0) {
      bestMove = lastResults[0].move;
    }
  } else {
    // Fixed depth search
    const results = findBestMoves(
      boardCopy, boardSize, marksToWin, config.depth, aiSign, config.radius
    );
    depthReached = config.depth;

    if (results.length > 0) {
      // For Easy mode: pick randomly among top N moves
      if (config.topN > 1 && results.length > 1) {
        const topMoves = results.slice(0, Math.min(config.topN, results.length));
        bestMove = topMoves[Math.floor(Math.random() * topMoves.length)].move;
      } else {
        bestMove = results[0].move;
      }
    }
  }

  const searchTimeMs = performance.now() - startTime;
  return { move: bestMove, searchTimeMs, depthReached };
}
