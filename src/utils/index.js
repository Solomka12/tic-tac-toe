import confetti from 'canvas-confetti';

export const getSplitArr = (arr, gridCount = 10) => {
    return new Array(Math.ceil(arr.length / gridCount))
        .fill(null)
        .map((item, i) => arr.slice(gridCount * i, gridCount * i + gridCount));
}

export const getWinnerRow = (board, boardSize, marksToWin) => {
    const fitsVertically = i => i + boardSize * (marksToWin - 1) < boardSize * boardSize;
    const fitsHorizontally = i => i % boardSize + marksToWin <= boardSize;
    const fitsBackHorizontally = i => i % boardSize - (marksToWin - 1) >= 0;

    const getHorizontalRow = (i, cell, board = []) => {
        if (!fitsHorizontally(i)) return null;

        let currWinnerRow = [i];
        let currRowCount = 1;

        for (let j = i + 1; currRowCount < marksToWin; j++) {
            if (board[j] === cell) {
                currWinnerRow.push(j);
                currRowCount++;
            } else {
                break;
            }
        }

        return currWinnerRow.length >= marksToWin ? currWinnerRow : null;
    };

    const getVerticalRow = (i, cell, board = []) => {
        if (!fitsVertically(i)) return null;

        let currWinnerRow = [i];
        let currRowCount = 1;

        for (let j = i + boardSize; currRowCount < marksToWin; j += boardSize) {
            if (board[j] === cell) {
                currWinnerRow.push(j);
                currRowCount++;
            } else {
                break;
            }
        }

        return currWinnerRow.length >= marksToWin ? currWinnerRow : null;
    };

    const getDiagonalLTRRow = (i, cell, board = []) => {
        if (!fitsHorizontally(i) || !fitsVertically(i)) return null;

        let currWinnerRow = [i];
        let currRowCount = 1;

        for (let j = i + boardSize + 1; currRowCount < marksToWin; j += boardSize + 1) {
            if (board[j] === cell) {
                currWinnerRow.push(j);
                currRowCount++;
            } else {
                break;
            }
        }

        return currWinnerRow.length >= marksToWin ? currWinnerRow : null;
    };

    const getDiagonalRTLRow = (i, cell, board = []) => {
        if (!fitsVertically(i) || !fitsBackHorizontally(i)) return null;

        let currWinnerRow = [i];
        let currRowCount = 1;

        for (let j = i + boardSize - 1; currRowCount < marksToWin; j += boardSize - 1) {
            if (board[j] === cell) {
                currWinnerRow.push(j);
                currRowCount++;
            } else {
                break;
            }
        }

        return currWinnerRow.length >= marksToWin ? currWinnerRow : null;
    };

    let emptyCellCount = board.length;

    for (let i = 0; i < board.length; i++) {
        const cell = board[i];

        if (cell) {
            emptyCellCount--;

            const horizontalRow = getHorizontalRow(i, cell, board);
            if (horizontalRow) return horizontalRow;

            const verticalRow = getVerticalRow(i, cell, board);
            if (verticalRow) return verticalRow;

            const diagonalLTRRow = getDiagonalLTRRow(i, cell, board);
            if (diagonalLTRRow) return diagonalLTRRow;

            const diagonalRTLRow = getDiagonalRTLRow(i, cell, board);
            if (diagonalRTLRow) return diagonalRTLRow;
        }
    }

    if (board.length && emptyCellCount <= 0) return [];
};

export const fireConfetti = (angle = 90, {x = 0.5, y = 0.5}) => {
    const defaults = {angle, ticks: 400, origin: {x, y}};

    confetti({
        ...defaults,
        particleCount: 40,
        spread: 26,
        startVelocity: 55,
    });
    confetti({
        ...defaults,
        particleCount: 30,
        spread: 60,
        gravity: 0.8
    });
    confetti({
        ...defaults,
        particleCount: 50,
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
        gravity: 1.1
    });
    confetti({
        ...defaults,
        particleCount: 15,
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
        gravity: 0.9
    });
    confetti({
        ...defaults,
        particleCount: 15,
        spread: 120,
        startVelocity: 45,
    });
};