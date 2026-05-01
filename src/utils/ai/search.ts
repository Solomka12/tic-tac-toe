import { getCandidateMoves } from './candidates';
import { evaluateBoard, WIN_SCORE } from './evaluate';

/**
 * Quick local score for a single move — only checks the lines passing
 * through the given cell instead of evaluating the full board.
 * Much faster than evaluateBoard for move ordering purposes.
 */
function quickMoveScore(
  board: (string | null)[],
  boardSize: number,
  marksToWin: number,
  moveIdx: number,
  sign: string,
  aiSign: string
): number {
  const opponentSign = aiSign === 'x' ? 'o' : 'x';
  const row = Math.floor(moveIdx / boardSize);
  const col = moveIdx % boardSize;

  // Place the piece temporarily
  board[moveIdx] = sign;

  let score = 0;

  // Directions: horizontal, vertical, diagonal-LTR, diagonal-RTL
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal \
    [1, -1],  // diagonal /
  ];

  for (const [dr, dc] of directions) {
    // For each direction, check all windows of length marksToWin that include this cell
    for (let offset = 0; offset < marksToWin; offset++) {
      const startRow = row - dr * offset;
      const startCol = col - dc * offset;
      const endRow = startRow + dr * (marksToWin - 1);
      const endCol = startCol + dc * (marksToWin - 1);

      // Check bounds
      if (
        startRow < 0 || startRow >= boardSize ||
        startCol < 0 || startCol >= boardSize ||
        endRow < 0 || endRow >= boardSize ||
        endCol < 0 || endCol >= boardSize
      ) {
        continue;
      }

      let aiCount = 0;
      let oppCount = 0;

      for (let k = 0; k < marksToWin; k++) {
        const r = startRow + dr * k;
        const c = startCol + dc * k;
        const cell = board[r * boardSize + c];
        if (cell === aiSign) aiCount++;
        else if (cell === opponentSign) oppCount++;
      }

      if (aiCount > 0 && oppCount > 0) continue; // Dead window

      const count = aiCount || oppCount;
      if (count === 0) continue;

      let windowScore: number;
      if (count === marksToWin) {
        windowScore = WIN_SCORE;
      } else {
        const gap = marksToWin - count;
        if (gap === 1) windowScore = 5000;
        else if (gap === 2) windowScore = 200;
        else if (gap === 3) windowScore = 15;
        else windowScore = 1;
      }

      score += oppCount > 0 ? -windowScore : windowScore;
    }
  }

  board[moveIdx] = null;
  return score;
}

/**
 * Orders candidate moves by a quick local heuristic.
 * Uses fast per-move scoring instead of full board evaluation.
 */
function orderMoves(
  candidates: number[],
  board: (string | null)[],
  boardSize: number,
  marksToWin: number,
  currentSign: string,
  aiSign: string
): number[] {
  const opponentSign = aiSign === 'x' ? 'o' : 'x';

  const scored = candidates.map((move) => {
    // Score how good this move is for the current player AND
    // how good it would be for the opponent (to prioritize blocking)
    const attackScore = quickMoveScore(board, boardSize, marksToWin, move, currentSign, aiSign);
    const defenseScore = quickMoveScore(board, boardSize, marksToWin, move, opponentSign, aiSign);

    // Combined importance: attack value + absolute defense value
    const importance = currentSign === aiSign
      ? attackScore - defenseScore // AI: maximize own score, block opponent
      : defenseScore - attackScore; // Opponent: their best moves

    return { move, score: importance };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.move);
}

/**
 * Minimax search with alpha-beta pruning, neighborhood candidate generation,
 * and move ordering for efficient search on large boards.
 */
export function minimax(
  board: (string | null)[],
  boardSize: number,
  marksToWin: number,
  depth: number,
  isMaximizing: boolean,
  aiSign: string,
  alpha: number,
  beta: number,
  radius: number
): number {
  const score = evaluateBoard(board, boardSize, marksToWin, aiSign);

  // Terminal: someone won
  if (score >= WIN_SCORE) return WIN_SCORE + depth;
  if (score <= -WIN_SCORE) return -WIN_SCORE - depth;

  // Terminal: depth exhausted or board full
  const candidates = getCandidateMoves(board, boardSize, radius);
  if (depth === 0 || candidates.length === 0) {
    return score;
  }

  const opponentSign = aiSign === 'x' ? 'o' : 'x';
  const currentSign = isMaximizing ? aiSign : opponentSign;

  // Order moves for better alpha-beta pruning (skip at depth 1 for speed)
  const moves = depth > 1
    ? orderMoves(candidates, board, boardSize, marksToWin, currentSign, aiSign)
    : candidates;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      board[move] = currentSign;
      const evalScore = minimax(
        board, boardSize, marksToWin,
        depth - 1, false, aiSign,
        alpha, beta, radius
      );
      board[move] = null;

      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      board[move] = currentSign;
      const evalScore = minimax(
        board, boardSize, marksToWin,
        depth - 1, true, aiSign,
        alpha, beta, radius
      );
      board[move] = null;

      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Finds the best move for the AI at the given depth.
 * Returns an array of { move, score } sorted best-first.
 */
export function findBestMoves(
  board: (string | null)[],
  boardSize: number,
  marksToWin: number,
  depth: number,
  aiSign: string,
  radius: number
): { move: number; score: number }[] {
  const candidates = getCandidateMoves(board, boardSize, radius);
  if (candidates.length === 0) return [];

  // Quick pre-check: if any move wins immediately, just play it
  for (const move of candidates) {
    board[move] = aiSign;
    const score = evaluateBoard(board, boardSize, marksToWin, aiSign);
    board[move] = null;
    if (score >= WIN_SCORE) {
      return [{ move, score: WIN_SCORE + depth + 1 }];
    }
  }

  // Also check: if opponent wins next move, must block
  const opponentSign = aiSign === 'x' ? 'o' : 'x';
  const urgentBlocks: number[] = [];
  for (const move of candidates) {
    board[move] = opponentSign;
    const score = evaluateBoard(board, boardSize, marksToWin, aiSign);
    board[move] = null;
    if (score <= -WIN_SCORE) {
      urgentBlocks.push(move);
    }
  }

  // If there's exactly one cell that blocks all opponent wins, play it immediately
  if (urgentBlocks.length === 1) {
    return [{ move: urgentBlocks[0], score: WIN_SCORE }];
  }

  const results: { move: number; score: number }[] = [];

  // Order root moves by quick eval for better pruning
  const orderedMoves = orderMoves(
    candidates, board, boardSize, marksToWin, aiSign, aiSign
  );

  let alpha = -Infinity;
  const beta = Infinity;

  for (const move of orderedMoves) {
    board[move] = aiSign;
    const score = minimax(
      board, boardSize, marksToWin,
      depth - 1, false, aiSign,
      alpha, beta, radius
    );
    board[move] = null;

    results.push({ move, score });
    alpha = Math.max(alpha, score);
  }

  // Sort best-first
  results.sort((a, b) => b.score - a.score);
  return results;
}
