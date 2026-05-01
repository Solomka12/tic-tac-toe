export const WIN_SCORE = 100_000;

/**
 * Evaluates the entire board from the AI's perspective.
 * Scans all horizontal, vertical, and diagonal windows of `marksToWin` length.
 *
 * IMPORTANT: Short-circuits immediately when a completed row (win) is detected,
 * ensuring win/loss is never diluted by positional scoring.
 *
 * Returns:
 * - WIN_SCORE if AI has won
 * - -WIN_SCORE if opponent has won
 * - Intermediate heuristic value for positional advantage
 */
export function evaluateBoard(
  board: (string | null)[],
  boardSize: number,
  marksToWin: number,
  aiSign: string
): number {
  const opponentSign = aiSign === 'x' ? 'o' : 'x';
  let totalScore = 0;

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const idx = row * boardSize + col;

      // Horizontal window
      if (col + marksToWin <= boardSize) {
        const s = scoreWindow(board, idx, 1, marksToWin, aiSign, opponentSign);
        if (s >= WIN_SCORE) return WIN_SCORE;
        if (s <= -WIN_SCORE) return -WIN_SCORE;
        totalScore += s;
      }

      // Vertical window
      if (row + marksToWin <= boardSize) {
        const s = scoreWindow(board, idx, boardSize, marksToWin, aiSign, opponentSign);
        if (s >= WIN_SCORE) return WIN_SCORE;
        if (s <= -WIN_SCORE) return -WIN_SCORE;
        totalScore += s;
      }

      // Diagonal LTR (\)
      if (col + marksToWin <= boardSize && row + marksToWin <= boardSize) {
        const s = scoreWindow(board, idx, boardSize + 1, marksToWin, aiSign, opponentSign);
        if (s >= WIN_SCORE) return WIN_SCORE;
        if (s <= -WIN_SCORE) return -WIN_SCORE;
        totalScore += s;
      }

      // Diagonal RTL (/)
      if (col - marksToWin + 1 >= 0 && row + marksToWin <= boardSize) {
        const s = scoreWindow(board, idx, boardSize - 1, marksToWin, aiSign, opponentSign);
        if (s >= WIN_SCORE) return WIN_SCORE;
        if (s <= -WIN_SCORE) return -WIN_SCORE;
        totalScore += s;
      }
    }
  }

  return totalScore;
}

/**
 * Scores a single window of `marksToWin` consecutive cells.
 * Uses a step value to traverse the board in any direction.
 *
 * Scoring weights are tuned for strong Gomoku-style play:
 * - Exponential increase for longer sequences
 * - Extra weight on (marksToWin - 1) sequences (one move from winning)
 */
function scoreWindow(
  board: (string | null)[],
  startIdx: number,
  step: number,
  marksToWin: number,
  aiSign: string,
  opponentSign: string
): number {
  let aiCount = 0;
  let oppCount = 0;

  for (let k = 0; k < marksToWin; k++) {
    const cell = board[startIdx + k * step];
    if (cell === aiSign) aiCount++;
    else if (cell === opponentSign) oppCount++;
  }

  // Mixed window — dead, no value for either side
  if (aiCount > 0 && oppCount > 0) return 0;

  const count = aiCount || oppCount;
  if (count === 0) return 0;

  // Complete row — win
  if (count === marksToWin) {
    return oppCount > 0 ? -WIN_SCORE : WIN_SCORE;
  }

  // Heuristic scores — strongly favor longer sequences
  // For marksToWin = 5: 1→1, 2→15, 3→200, 4→5000
  let score: number;
  const gap = marksToWin - count; // how many more pieces needed

  if (gap === 1) {
    // One piece away from winning — critical threat
    score = 5000;
  } else if (gap === 2) {
    // Two away — strong potential
    score = 200;
  } else if (gap === 3) {
    score = 15;
  } else {
    score = 1;
  }

  return oppCount > 0 ? -score : score;
}
