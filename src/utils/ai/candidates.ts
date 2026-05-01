/**
 * Generates candidate moves by only considering empty cells
 * within a given radius of existing stones on the board.
 * This dramatically reduces the branching factor on large boards.
 */
export function getCandidateMoves(
  board: (string | null)[],
  boardSize: number,
  radius: number
): number[] {
  const totalCells = boardSize * boardSize;
  const candidates = new Set<number>();
  let hasStones = false;

  for (let i = 0; i < totalCells; i++) {
    if (board[i] !== null) {
      hasStones = true;
      const row = Math.floor(i / boardSize);
      const col = i % boardSize;

      for (let dr = -radius; dr <= radius; dr++) {
        for (let dc = -radius; dc <= radius; dc++) {
          const nr = row + dr;
          const nc = col + dc;
          if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize) {
            const ni = nr * boardSize + nc;
            if (board[ni] === null) {
              candidates.add(ni);
            }
          }
        }
      }
    }
  }

  // Empty board — play center
  if (!hasStones) {
    const center = Math.floor(boardSize / 2) * boardSize + Math.floor(boardSize / 2);
    candidates.add(center);
  }

  return Array.from(candidates);
}
